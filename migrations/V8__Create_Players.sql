CREATE TABLE IF NOT EXISTS player (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    game_id UUID NOT NULL REFERENCES game(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER player_update_modified_time BEFORE UPDATE ON player FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();
