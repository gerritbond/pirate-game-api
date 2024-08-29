import { System } from "../models/systems";
import { Logger } from "../utils/logger";
import { pool } from "./db";
import { Location } from "../models/systems";

export class SystemDataService {
    private logger = new Logger('SystemDataService');

    async create(system: System) {
        const client = await pool.connect();

        try {
            const query = `INSERT INTO systems (name) VALUES ($1) RETURNING *`;
            const values = [system.name];
            const result = await client.query(query, values);
            this.logger.info('System created', { system: result.rows[0] });
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error creating system', { error });
        }
    }

    async get(id: string) {
        const client = await pool.connect();

        try {
            const query = `SELECT * FROM systems WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            const system = new System(result.rows[0].id, result.rows[0].name, [], []);

            const neighboringSystems = await client.query(`
                SELECT system_b.*
                FROM neighboring_systems
                WHERE system_a = $1
            `, [id]);   
            
            neighboringSystems.rows.forEach((system) => {
                system.neighbors.push(new System(system.id, system.name, [], []));
            });

            const locations = await client.query(`
                SELECT id, system, name, description
                FROM location
                WHERE system = $1
            `, [id]);

            locations.rows.forEach((location) => {
                system.locations.push(new Location(location.id, location.system, location.name, location.description));
            });

            this.logger.info('System retrieved', { system: result.rows[0] });
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error retrieving system', { error });
        }
    }

    async update(system: System) {
        const client = await pool.connect();

        try {
            const query = `UPDATE systems SET name = $1 WHERE id = $2 RETURNING *`;
            const values = [system.name, system.id];
            const result = await client.query(query, values);
            this.logger.info('System updated', { system: result.rows[0] });
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error updating system', { error });
        }
    }

    async delete(id: string) {
        const client = await pool.connect();

        try {
            const query = `DELETE FROM systems WHERE id = $1`;
            const values = [id];
            await client.query(query, values);
            this.logger.info('System deleted', { id });
        } catch (error) {
            this.logger.error('Error deleting system', { error });
        }
    }
}