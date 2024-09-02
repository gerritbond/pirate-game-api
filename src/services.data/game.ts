import { pool } from "./db";
import { Game } from "../models/game";
import { Logger } from "../utils/logger";

export class GameDataService {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('GameDataService');
    }

    async fetchOne (id: string) {
        const client = await pool.connect();

        try {
            const query = `SELECT * FROM game WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            const game = new Game(result.rows[0].id, result.rows[0].name, result.rows[0].description);
            return game;
        } catch (error) {
            this.logger.error('Error getting game', { error });
        } finally {
            client.release();
        }
        return undefined;
    }

    async fetchAll () {
        const client = await pool.connect();

        try {
            const query = `SELECT * FROM game`;
            const result = await client.query(query);
            return result.rows.map((row) => new Game(row.id, row.name, row.description));
        } catch (error) {
            this.logger.error('Error getting games', { error });
        } finally {
            client.release();
        }
        return [];
    }

    async create (game: Game) {
        const client = await pool.connect();

        try {
            const query = `INSERT INTO game (name, description) VALUES ($1, $2) RETURNING *`;
            const values = [game.name, game.description];
            const result = await client.query(query, values);
            return new Game(result.rows[0].id, result.rows[0].name, result.rows[0].description);
        } catch (error) {
            this.logger.error('Error creating game', { error });
        } finally {
            client.release();
        }
        return undefined;
    }

    async update (game: Game) {
        const client = await pool.connect();

        try {
            const query = `UPDATE game SET name = $1, description = $2 WHERE id = $3 RETURNING *`;
            const values = [game.name, game.description, game.id];
            const result = await client.query(query, values);
            return new Game(result.rows[0].id, result.rows[0].name, result.rows[0].description);
        } catch (error) {
            this.logger.error('Error updating game', { error });
        } finally {
            client.release();
        }
        return undefined;
    }

    async delete (id: string) {
        const client = await pool.connect();

        try {
            const query = `DELETE FROM game WHERE id = $1`;
            const values = [id];
            await client.query(query, values);
            return true;
        } catch (error) {
            this.logger.error('Error deleting game', { error });
        } finally {
            client.release();
        }
        return false;
    }
}
    
