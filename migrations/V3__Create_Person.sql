CREATE TABLE IF NOT EXISTS person (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    last_name TEXT NOT NULL,
    vice TEXT,
    description TEXT,
    regret TEXT,
    goal TEXT,
    age INTEGER NOT NULL,
    sex TEXT,
    gender TEXT,
    living BOOLEAN NOT NULL DEFAULT(true),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER person_update_modified_time BEFORE UPDATE ON person FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS person_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person UUID NOT NULL REFERENCES person (id),
    skill TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER person_skills_update_modified_time BEFORE UPDATE ON person_skills FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();
