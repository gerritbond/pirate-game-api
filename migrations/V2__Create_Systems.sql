CREATE TABLE IF NOT EXISTS systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER systems_update_modified_time BEFORE UPDATE ON systems FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS neighboring_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_a UUID NOT NULL REFERENCES systems (id),
    system_b UUID NOT NULL REFERENCES systems (id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER neighboring_systems_update_modified_time BEFORE UPDATE ON neighboring_systems FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS location (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system UUID NOT NULL REFERENCES systems (id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER location_update_modified_time BEFORE UPDATE ON location FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();
