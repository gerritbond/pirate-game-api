-- Create a game table as the top most data structure
CREATE TABLE IF NOT EXISTS game (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER game_update_modified_time BEFORE UPDATE ON game FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

-- Event clocks represent a plot progression event, and are meant to be advanced either individually or by a group
CREATE TABLE IF NOT EXISTS event_clock_group (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    game_id UUID NOT NULL REFERENCES game(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER event_clock_group_update_modified_time BEFORE UPDATE ON event_clock_group FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

CREATE TABLE IF NOT EXISTS event_clock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    segments INTEGER NOT NULL DEFAULT (4),
    group_id UUID REFERENCES event_clock_group(id) DEFAULT (null),
    game_id UUID NOT NULL REFERENCES game(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW ()
);
CREATE TRIGGER event_clock_update_modified_time BEFORE UPDATE ON event_clock FOR EACH ROW EXECUTE PROCEDURE update_modified_timestamp();

-- Update the existing base tables to reference a game id
ALTER TABLE person ADD COLUMN game_id UUID NOT NULL REFERENCES game(id);
ALTER TABLE ship ADD COLUMN game_id UUID NOT NULL REFERENCES game(id);
ALTER TABLE crew ADD COLUMN game_id UUID NOT NULL REFERENCES game(id);
ALTER TABLE location ADD COLUMN game_id UUID NOT NULL REFERENCES game(id);
ALTER TABLE systems ADD COLUMN game_id UUID NOT NULL REFERENCES game(id);

