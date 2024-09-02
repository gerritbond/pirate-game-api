import { Logger } from "../utils/logger"
import { pool } from "./db"
import { Player } from "../models/player"

export class PlayerDataService {
    private logger: Logger
    constructor () {
        this.logger = new Logger("PlayerDataService")
    }

    async create(player: Player) {
        try {
            const query = `
                INSERT INTO players (name,  email, game_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await pool.query(query, [player.name, player.email, player.gameId]);
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Error creating player: ${error}`);
            throw error;
        }
    }

    async fetchOne(id: string) {
        const query = `
            SELECT * FROM players
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        const player: Player = result.rows[0];
        return player;
    }

    async fetchManyByGameId(gameId: string) {
        const query = `
            SELECT * FROM players
            WHERE game_id = $1
        `;
        const result = await pool.query(query, [gameId]);
        return result.rows;
    }   

    async update(player: Player) {
        const query = `
            UPDATE players
            SET name = $1, email = $2
            WHERE id = $3
            RETURNING *
        `;
        const result = await pool.query(query, [player.name, player.email, player.id]);
        return result.rows[0];
    }   

    async delete(id: string) {
        const query = `
            DELETE CASCADE FROM players
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rowCount != null && result.rowCount > 0;
    }   
}