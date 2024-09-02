CREATE OR REPLACE FUNCTION update_modified_timestamp ()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';
