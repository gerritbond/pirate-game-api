import { Logger } from "../utils/logger";
import { EventClock, EventClockGroup } from "../models/eventClocks";
import { pool } from "./db";

export class EventClockDataService {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger('EventClockDataService');
    }

    public async createEventClock(eventClock: EventClock): Promise<EventClock> {
        this.logger.info(`Creating event clock: ${eventClock.name}`);

        const client = await pool.connect();

        try {
            const query = `
                INSERT INTO event_clock (name, description, segments, game_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const values = [eventClock.name, eventClock.description, eventClock.segments, eventClock.gameId];
            const result = await client.query(query, values);
            const createdEventClock = new EventClock(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].segments, result.rows[0].game_id);
            return createdEventClock;
        } catch (error) {
            this.logger.error('Error creating event clock', { error, eventClock });
            throw error;
        } finally {
            client.release();
        }
    }

    public async createEventClockGroup(eventClockGroup: EventClockGroup): Promise<EventClockGroup> {
        this.logger.info(`Creating event clock group: ${eventClockGroup.name}`);

        const client = await pool.connect();

        try {
            const query = `
                INSERT INTO event_clock_group (name, description, game_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const values = [eventClockGroup.name, eventClockGroup.description, eventClockGroup.gameId];
            const result = await client.query(query, values);
            const createdEventClockGroup = new EventClockGroup(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].game_id);
            return createdEventClockGroup;
        } catch (error) {
            this.logger.error('Error creating event clock group', { error, eventClockGroup });
            throw error;
        } finally {
            client.release();
        }
    }

    public async fetchEventClockGroup(eventClockGroupId: string): Promise<EventClockGroup> {
        this.logger.info(`Getting event clock group: ${eventClockGroupId}`);

        const client = await pool.connect();

        try {
            const query = `
                SELECT * FROM event_clock_group WHERE id = $1   
            `;
            const values = [eventClockGroupId];
            const result = await client.query(query, values);
            const eventClockGroup = new EventClockGroup(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].game_id);
            return eventClockGroup;
        } catch (error) {
            this.logger.error('Error getting event clock group', { error, eventClockGroupId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async fetchEventClocksByGroup(eventClockGroupId: string): Promise<EventClock[]> {
        this.logger.info(`Getting event clocks by group: ${eventClockGroupId}`);

        const client = await pool.connect();

        try {
            const query = `
                SELECT * FROM event_clock WHERE group_id = $1
            `;
            const values = [eventClockGroupId];
            const result = await client.query(query, values);
            const eventClocks = result.rows.map((row) => new EventClock(row.id, row.name, row.description, row.segments, row.game_id, row.group_id));
            return eventClocks;
        } catch (error) {
            this.logger.error('Error getting event clocks by group', { error, eventClockGroupId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async fetchEventClock(eventClockId: string): Promise<EventClock> {
        this.logger.info(`Getting event clock: ${eventClockId}`);

        const client = await pool.connect();

        try {
            const query = `
                SELECT * FROM event_clock WHERE id = $1
            `;
            const values = [eventClockId];
            const result = await client.query(query, values);
            const eventClock = new EventClock(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].segments, result.rows[0].game_id, result.rows[0].group_id);
            return eventClock;
        } catch (error) {
            this.logger.error('Error getting event clock', { error, eventClockId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async attachToGroup(eventClockId: string, eventClockGroupId: string): Promise<EventClock> {
        this.logger.info(`Attaching event clock to group: ${eventClockId} - ${eventClockGroupId}`);

        const client = await pool.connect();

        try {
            const query = `
                UPDATE event_clock
                SET group_id = $1
                WHERE id = $2
                RETURNING *
            `;
            const values = [eventClockGroupId, eventClockId];
            const result = await client.query(query, values);
            const updatedEventClock = new EventClock(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].segments, result.rows[0].game_id, result.rows[0].group_id);
            return updatedEventClock;
        } catch (error) {
            this.logger.error('Error attaching event clock to group', { error, eventClockId, eventClockGroupId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async detachFromGroup(eventClockId: string): Promise<EventClock> {
        this.logger.info(`Detaching event clock from group: ${eventClockId}`);

        const client = await pool.connect();

        try {
            const query = `
                UPDATE event_clock  
                SET group_id = null
                WHERE id = $1
                RETURNING *
            `;
            const values = [eventClockId];
            const result = await client.query(query, values);
            const updatedEventClock = new EventClock(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].segments, result.rows[0].game_id, result.rows[0].group_id);
            return updatedEventClock;   
        } catch (error) {
            this.logger.error('Error detaching event clock from group', { error, eventClockId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async advanceEventClock(eventClockId: string, segments: number): Promise<EventClock> {
        this.logger.info(`Advancing event clock: ${eventClockId} by ${segments} segments`);

        const client = await pool.connect();

        try {
            const query = `
                UPDATE event_clock  
                SET elapsed_segments = elapsed_segments + $1
                WHERE id = $2
                RETURNING *
            `;
            const values = [segments, eventClockId];
            const result = await client.query(query, values);
            const updatedEventClock = new EventClock(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].segments, result.rows[0].game_id, result.rows[0].group_id);
            return updatedEventClock;
        } catch (error) {
            this.logger.error('Error advancing event clock by segments', { error, segments, eventClockId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async advanceEventClockGroup(eventClockGroupId: string, segments: number): Promise<EventClockGroup> {
        this.logger.info(`Advancing event clock group: ${eventClockGroupId} by ${segments} segments`);

        const client = await pool.connect();

        try {
            const query = `
                UPDATE event_clock
                SET elapsed_segments = elapsed_segments + $1
                WHERE group_id = $2
                RETURNING *
            `;
            const values = [segments, eventClockGroupId];
            const result = await client.query(query, values);
            const updatedEventClockGroup = new EventClockGroup(result.rows[0].id, result.rows[0].name, result.rows[0].description, result.rows[0].game_id);
            return updatedEventClockGroup;
        } catch (error) {
            this.logger.error('Error advancing event clock group by segments', { error, segments, eventClockGroupId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async deleteEventClock(eventClockId: string): Promise<void> {
        this.logger.info(`Deleting event clock: ${eventClockId}`);

        const client = await pool.connect();

        try {
            const query = `
                DELETE FROM event_clock WHERE id = $1
            `;
            const values = [eventClockId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error deleting event clock', { error, eventClockId });
            throw error;
        } finally {
            client.release();
        }
    }

    public async deleteEventClockGroup(eventClockGroupId: string): Promise<void> {
        this.logger.info(`Deleting event clock group: ${eventClockGroupId}`);

        const client = await pool.connect();

        try {
            const query = ` 
                DELETE CASCADE FROM event_clock_group WHERE id = $1
            `;
            const values = [eventClockGroupId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error deleting event clock group', { error, eventClockGroupId });
            throw error;
        } finally {
            client.release();
        }
    }
}