CREATE TABLE IF NOT EXISTS technology_level (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER technology_level_update_modified_time BEFORE UPDATE ON technology_level FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

INSERT INTO technology_level (name) VALUES
    ('Neolithic'),
    ('Pre-Gunpowder'),
    ('Early Industrial'),
    ('21st Century'),
    ('Postech'),
    ('Pretech'),
    ('Pretech-Plus');

-- Adding a table for items, that will include cargo, weapons, armor, modifications, trade goods, etc.
CREATE TABLE IF NOT EXISTS item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    base_value INTEGER NOT NULL DEFAULT 0,
    technology_level_id UUID NOT NULL REFERENCES technology_level(id),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER item_update_modified_time BEFORE UPDATE ON item FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

ALTER TABLE ship_cargo ADD COLUMN item_id UUID NOT NULL REFERENCES item(id);
ALTER TABLE ship_cargo DROP COLUMN name;
ALTER TABLE ship_cargo DROP COLUMN description;
ALTER TABLE ship_cargo DROP COLUMN cost;

CREATE TABLE IF NOT EXISTS trade_good (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_per_unit INTEGER NOT NULL DEFAULT 0,
    item_id UUID NOT NULL REFERENCES item(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);  
CREATE TRIGGER trade_good_update_modified_time BEFORE UPDATE ON trade_good FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS weapon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES item(id),
    type TEXT NOT NULL,
    damage_die TEXT NOT NULL,
    damage_count INTEGER NOT NULL DEFAULT 1,
    damage_bonus INTEGER NOT NULL DEFAULT 0,
    minimum_range INTEGER NOT NULL DEFAULT 0,
    maximum_range INTEGER NOT NULL,
    magazine_size INTEGER DEFAULT 0,
    magazine_cost INTEGER DEFAULT 0,
    attribute TEXT NOT NULL,
    technology_level_id UUID NOT NULL REFERENCES technology_level(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER weapon_update_modified_time BEFORE UPDATE ON weapon FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS armor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES item(id),
    type TEXT NOT NULL,
    armor_class INTEGER NOT NULL DEFAULT 0,
    armor_class_bonus INTEGER NOT NULL DEFAULT 0,
    technology_level_id UUID NOT NULL REFERENCES technology_level(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER armor_update_modified_time BEFORE UPDATE ON armor FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    base_value INTEGER NOT NULL DEFAULT 0,
    effect TEXT NOT NULL,
    fix_skill_required INTEGER DEFAULT 0,
    type TEXT NOT NULL,
    technology_level_id UUID NOT NULL REFERENCES technology_level(id),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER modifications_update_modified_time BEFORE UPDATE ON modifications FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS weapon_modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weapon_id UUID NOT NULL REFERENCES weapon(id),
    modification_id UUID NOT NULL REFERENCES modifications(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER weapon_modifications_update_modified_time BEFORE UPDATE ON weapon_modifications FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();  

CREATE TABLE IF NOT EXISTS armor_modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    armor_id UUID NOT NULL REFERENCES armor(id),
    modification_id UUID NOT NULL REFERENCES modifications(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER armor_modifications_update_modified_time BEFORE UPDATE ON armor_modifications FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();  