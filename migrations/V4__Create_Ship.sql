CREATE TABLE IF NOT EXISTS ship (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    captain UUID references person (id),
    registry TEXT NOT NULL,
    hull TEXT NOT NULL,
    class TEXT NOT NULL,
    location UUID references location (id),
    value INTEGER NOT NULL DEFAULT(0),
    speed INTEGER NOT NULL,
    bounty INTEGER NOT NULL DEFAULT(0),
    armour INTEGER NOT NULL,
    current_hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    armour_class INTEGER NOT NULL,
    cargo_mass_limit INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_update_modified_time BEFORE UPDATE ON ship FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS crew (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person UUID NOT NULL REFERENCES person(id),
    ship UUID NOT NULL REFERENCES ship(id),
    experience INTEGER DEFAULT(0),
    payrate INTEGER DEFAULT(0),
    role TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER crew_update_modified_time BEFORE UPDATE ON crew FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_fitting_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    power INTEGER NOT NULL DEFAULT(0),
    mass INTEGER NOT NULL DEFAULT(0),
    hardpoints INTEGER NOT NULL DEFAULT(0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()

);
CREATE TRIGGER ship_fitting_limits_update_modified_time BEFORE UPDATE ON ship_fitting_limits FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_fittings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    mass INTEGER NOT NULL,
    power INTEGER NOT NULL,
    hardpoints INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_fittings_update_modified_time BEFORE UPDATE ON ship_fittings FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_modifications_update_modified_time BEFORE UPDATE ON ship_modifications FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_weapons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cost INTEGER NOT NULL,
    damage_die TEXT NOT NULL,
    damage_die_quantity INTEGER NOT NULL DEFAULT(1),
    mass INTEGER NOT NULL,
    power INTEGER NOT NULL,
    hardpoints INTEGER NOT NULL,
    minimum_class TEXT,
    tech_level INTEGER,
    qualities TEXT, -- Eventually will need to change this but leaving it for creating the API in a few hours
    current_ammunition INTEGER NOT NULL DEFAULT(0),
    max_ammunition INTEGER NOT NULL DEFAULT(0),
    replenishment_cost INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_weapons_update_modified_time BEFORE UPDATE ON ship_weapons FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_defences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cost INTEGER NOT NULL,
    power INTEGER NOT NULL,
    mass INTEGER NOT NULL,
    minimum_class TEXT,
    effect TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_defences_update_modified_time BEFORE UPDATE ON ship_defences FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS ship_cargo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship UUID NOT NULL REFERENCES ship (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    space_occupied INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER ship_cargo_update_modified_time BEFORE UPDATE ON ship_cargo FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

