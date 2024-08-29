import { Location } from "../models/systems";
import { pool } from "./db";
import { Logger } from "../utils/logger";

export class LocationDataService {
    private logger = new Logger('LocationDataService');

    async fetchOne(id: string) {
        const client = await pool.connect();

        try {
            const query = `SELECT * FROM location WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            const location = new Location(result.rows[0].id, result.rows[0].system, result.rows[0].name, result.rows[0].description);
            return location;
        } catch (error) {
            this.logger.error('Error getting location', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async fetchManyBySystem(system_id: string) {
        const client = await pool.connect();

        try {
            const query = `SELECT * FROM location WHERE system = $1`;
            const values = [system_id];
            const result = await client.query(query, values);
            const locations = result.rows.map((row) => new Location(row.id, row.system, row.name, row.description));
            return locations;   
        } catch (error) {
            this.logger.error('Error getting locations by system', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async create(location: Location) {
        const client = await pool.connect();

        try {
            this.logger.info('Creating location', { location });

            const query = `INSERT INTO location (system, name, description) VALUES ($1, $2, $3) RETURNING *`;
            const values = [location.system_id, location.name, location.description];
            const result = await client.query(query, values);

            const locationResult = new Location(result.rows[0].id, result.rows[0].system, result.rows[0].name, result.rows[0].description);
            this.logger.info('Location created', { location: locationResult });

            return locationResult;
        } catch (error) {
            this.logger.error('Error creating location', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async createMany(locations: Location[]) {
        const client = await pool.connect();
        const results: Location[] = [];

        try {
            this.logger.info('Creating locations', { locations });
            await client.query('BEGIN');

            for (const location of locations) {
                const query = `INSERT INTO location (system, name, description) VALUES ($1, $2, $3) RETURNING *`;
                const values = [location.system_id, location.name, location.description];
                const result = await client.query(query, values);

                const locationResult = new Location(result.rows[0].id, result.rows[0].system, result.rows[0].name, result.rows[0].description);
                results.push(locationResult);

                this.logger.info('Location created - Pending Commit', { location: locationResult });
            }

            await client.query('COMMIT');
            this.logger.info('Locations created', { locations: results });

            return results; 
        } catch (error) {
            this.logger.error('Error creating locations', { error });
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async update(location: Location) {
        const client = await pool.connect();

        try {
            const query = `UPDATE location SET system = $1, name = $2, description = $3 WHERE id = $4 RETURNING *`;
            const values = [location.system_id, location.name, location.description, location.id];
            const result = await client.query(query, values);
            const locationResult = new Location(result.rows[0].id, result.rows[0].system, result.rows[0].name, result.rows[0].description); 
            this.logger.info('Location updated', { location: locationResult });
            return locationResult;
        } catch (error) {
            this.logger.error('Error updating location', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async delete(id: string) {
        const client = await pool.connect();

        try {
            const query = `DELETE FROM location WHERE id = $1`;
            const values = [id];
            await client.query(query, values);
            this.logger.info('Location deleted', { id });   
        } catch (error) {
            this.logger.error('Error deleting location', { error });
            throw error;
        } finally {
            client.release();
        }
    }   
}