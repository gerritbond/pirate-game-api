import { pool } from './db';
import { Ship, ShipCargo, ShipDefence, ShipFitting, ShipFittingLimit, ShipModification, ShipWeapon } from '../models/ship';
import { Logger } from '../utils/logger';
import { Crew } from '../models/person';

export class ShipDataService {
    private logger = new Logger('ShipDataService');

    async create(ships: Ship[]) {
        const client = await pool.connect();

        try {
            this.logger.info('Creating ships', { ships });
            await client.query('BEGIN');

            for(const ship of ships) {
                const query = `INSERT INTO ship (captain, registry, hull, class, location, value, speed, bounty, armour, current_hp, max_hp, armour_class, cargo_mass_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
                const values = [ship.captain, ship.registry, ship.hull, ship.shipClass, ship.location, ship.value, ship.speed, ship.bounty, ship.armour, ship.current_hp, ship.max_hp, ship.armour_class, ship.cargo_mass_limit];
                const result = await client.query(query, values);
                
                const shipResult = new Ship(result.rows[0].id, result.rows[0].captain, result.rows[0].registry, result.rows[0].hull, result.rows[0].class, result.rows[0].location, result.rows[0].value, result.rows[0].speed, result.rows[0].bounty, result.rows[0].armour, result.rows[0].current_hp, result.rows[0].max_hp, result.rows[0].armour_class, result.rows[0].cargo_mass_limit, [], []);
                
                const crewQuery = `INSERT INTO crew (person, ship, experience, payrate, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                for(const c of ship.crew) {
                    const crewValues = [shipResult.captain, shipResult.id, c.experience, c.payrate, c.role];
                    const crewQueryResult = await client.query(crewQuery, crewValues);
                
                    const crewResult = new Crew(crewQueryResult.rows[0].id, crewQueryResult.rows[0].person, crewQueryResult.rows[0].ship, crewQueryResult.rows[0].experience, crewQueryResult.rows[0].payrate, crewQueryResult.rows[0].role);
                    shipResult.crew.push(crewResult);
                }

                this.logger.info('Ship created - Pending Commit', { ship: shipResult });
            }

            await client.query('COMMIT');
            this.logger.info('Ships created', { ships });

            return ships;
        } catch (error) {
            this.logger.error('Error creating ships', { error });
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async addCargo(shipId: string, cargo: ShipCargo) {
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_cargo (ship, name, description, quantity, cost, space_occupied) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [shipId, cargo.name, cargo.description, cargo.quantity, cargo.cost, cargo.space_occupied];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error adding cargo', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async removeCargo(shipId: string, cargoId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE FROM ship_cargo WHERE ship = $1 AND id = $2`;
            const values = [shipId, cargoId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error removing cargo', { error });
            throw error;    
        } finally {
            client.release();
        }
    }

    async addDefence(shipId: string, defence: ShipDefence) {
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_defences (ship, name, description, cost, power, mass, minimum_class, effect) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            const values = [shipId, defence.name, defence.description, defence.cost, defence.power, defence.mass, defence.minimum_class, defence.effect];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error adding defence', { error });
            throw error;    
        } finally {
            client.release();
        }
    }

    async removeDefence(shipId: string, defenceId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE FROM ship_defences WHERE ship = $1 AND id = $2`;
            const values = [shipId, defenceId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error removing defence', { error });
            throw error;    
        } finally {
            client.release();
        }
    }

    async addFitting(shipId: string, fitting: ShipFitting) {
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_fittings (ship, name, description, mass, power, hardpoints) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [shipId, fitting.name, fitting.description, fitting.mass, fitting.power, fitting.hardpoints];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error adding fitting', { error });
            throw error;
        } finally {
            client.release();
        }
    }   

    async removeFitting(shipId: string, fittingId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE FROM ship_fittings WHERE ship = $1 AND id = $2`;
            const values = [shipId, fittingId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error removing fitting', { error });
            throw error;    
        } finally {
            client.release();
        }
    }

    async addModification(shipId: string, modification: ShipModification) {
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_modifications (ship, name, description) VALUES ($1, $2, $3) RETURNING *`;
            const values = [shipId, modification.name, modification.description];
            const result = await client.query(query, values);
            return result.rows[0];  
        } catch (error) {
            this.logger.error('Error adding modification', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async removeModification(shipId: string, modificationId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE FROM ship_modifications WHERE ship = $1 AND id = $2`;
            const values = [shipId, modificationId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error removing modification', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async addWeapon(shipId: string, weapon: ShipWeapon) {   
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_weapons (ship, name, description, cost, power, mass, minimum_class, tech_level, current_ammunition, max_ammunition, replenishment_cost, qualities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
            const values = [shipId, weapon.name, weapon.description, weapon.cost, weapon.power, weapon.mass, weapon.minimum_class, weapon.tech_level, weapon.current_ammunition, weapon.max_ammunition, weapon.replenishment_cost, weapon.qualities ];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error adding weapon', { error });
            throw error;
        } finally { 
            client.release();
        }
    }

    async removeWeapon(shipId: string, weaponId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE FROM ship_weapons WHERE ship = $1 AND id = $2`;
            const values = [shipId, weaponId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error removing weapon', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async defineFittingLimits(shipId: string, limits: ShipFittingLimit) {
        const client = await pool.connect();
        try {
            const query = `INSERT INTO ship_fitting_limits (ship, power, mass, hardpoints) VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [shipId, limits.power, limits.mass, limits.hardpoints];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error defining fitting limits', { error });
            throw error;
        } finally { 
            client.release();
        }
    }

    async delete(shipId: string) {
        const client = await pool.connect();
        try {
            const query = `DELETE CASCADE FROM ship WHERE id = $1`;
            const values = [shipId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error deleting ship', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async update(shipId: string, ship: Ship) {
        const client = await pool.connect();
        try {
            const query = `UPDATE ship SET captain = $1, registry = $2, hull = $3, class = $4, location = $5, value = $6, speed = $7, bounty = $8, armour = $9, current_hp = $10, max_hp = $11, armour_class = $12, cargo_mass_limit = $13 WHERE id = $14`;
            const values = [ship.captain, ship.registry, ship.hull, ship.shipClass, ship.location, ship.value, ship.speed, ship.bounty, ship.armour, ship.current_hp, ship.max_hp, ship.armour_class, ship.cargo_mass_limit, shipId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error updating ship', { error });
            throw error;    
        } finally {
            client.release();
        }
    }
    
    async moveShipToLocation (shipId: string, locationId: string) {
        const client = await pool.connect();
        try {
            const query = `UPDATE ship SET location = $1 WHERE id = $2`;
            const values = [locationId, shipId];
            await client.query(query, values);
        } catch (error) {
            this.logger.error('Error moving ship', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async fetchMany (page: number = 1, pageSize: number = 10): Promise<{ ships: Ship[], total: number }> {
        const client = await pool.connect();
        try {
            const offset = (page - 1) * pageSize;

            // Fetch ships with pagination
            const shipQuery = `
                SELECT * FROM ship 
                ORDER BY id 
                LIMIT $1 OFFSET $2
            `;
            const shipResult = await client.query(shipQuery, [pageSize, offset]);

            // Get total count of ships
            const countQuery = `SELECT COUNT(*) FROM ship`;
            const countResult = await client.query(countQuery);
            const total = parseInt(countResult.rows[0].count);

            const ships: Ship[] = [];

            for (const shipData of shipResult.rows) {
                const shipId = shipData.id;

                // Fetch related data for each ship
                const [weapons, defenses, fittings, limits, modifications, crew, cargo] = await Promise.all([
                    this.fetchWeapons(client, shipId),
                    this.fetchDefenses(client, shipId),
                    this.fetchFittings(client, shipId),
                    this.fetchFittingLimits(client, shipId),
                    this.fetchModifications(client, shipId),
                    this.fetchCrew(client, shipId),
                    this.fetchCargo(client, shipId)
                ]);

                // Construct Ship instance
                const ship = new Ship(
                    shipData.id,
                    shipData.captain,
                    shipData.registry,
                    shipData.hull,
                    shipData.class,
                    shipData.location,
                    shipData.value,
                    shipData.speed,
                    shipData.bounty,
                    shipData.armour,
                    shipData.current_hp,
                    shipData.max_hp,
                    shipData.armour_class,
                    shipData.cargo_mass_limit,
                    crew,
                    fittings,
                    limits,
                    modifications,
                    weapons,
                    defenses,
                    cargo
                );

                ships.push(ship);
            }

            return { ships, total };
        } catch (error) {
            this.logger.error('Error reading multiple ships', { error, page, pageSize });
            throw error;
        } finally {
            client.release();
        }
    }

    async fetchOne (shipId: string): Promise<Ship | null> {
        const client = await pool.connect();
        try {
            // Fetch ship data
            const shipQuery = `SELECT * FROM ship WHERE id = $1`;
            const shipResult = await client.query(shipQuery, [shipId]);
            
            if (shipResult.rows.length === 0) {
                return null;
            }

            const shipData = shipResult.rows[0];

            const [weapons, defenses, fittings, limits, modifications, crew, cargo] = await Promise.all([
                this.fetchWeapons(client, shipId),
                this.fetchDefenses(client, shipId),
                this.fetchFittings(client, shipId),
                this.fetchFittingLimits(client, shipId),
                this.fetchModifications(client, shipId),
                this.fetchCrew(client, shipId),
                this.fetchCargo(client, shipId)
            ]);

            // Construct and return the Ship instance
            return new Ship(
                shipData.id,
                shipData.captain,
                shipData.registry,
                shipData.hull,
                shipData.class,
                shipData.location,
                shipData.value,
                shipData.speed,
                shipData.bounty,
                shipData.armour,
                shipData.current_hp,
                shipData.max_hp,
                shipData.armour_class,
                shipData.cargo_mass_limit,
                crew,
                fittings,
                limits,
                modifications,
                weapons,
                defenses,
                cargo
            );
        } catch (error) {
            this.logger.error('Error reading ship', { error, shipId });
            throw error;
        } finally {
            client.release();
        }
    }

         // Helper methods to fetch related data
    private async fetchWeapons(client: any, shipId: string): Promise<ShipWeapon[]> {
        const query = `SELECT * FROM ship_weapons WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any) => new ShipWeapon(row.id, row.ship, row.name, row.description, 
            row.cost, row.damage_die, row.damage_die_quantity, row.mass, row.power, row.hardpoints, 
            row.minimum_class, row.tech_level, row.qualities, row.current_ammunition, 
            row.max_ammunition, row.replenishment_cost, null));
    }

    private async fetchDefenses(client: any, shipId: string): Promise<ShipDefence[]> {
        const query = `SELECT * FROM ship_defences WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any) => new ShipDefence(row.id, row.ship, row.name, row.description, 
            row.cost, row.power, row.mass, row.minimum_class, row.effect));
    }

    private async fetchFittings(client: any, shipId: string): Promise<ShipFitting[]> {
        const query = `SELECT * FROM ship_fittings WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any) => new ShipFitting(row.id, row.ship, row.name, row.description, 
            row.mass, row.power, row.hardpoints));
    }

    private async fetchFittingLimits(client: any, shipId: string): Promise<ShipFittingLimit | null> {
        const query = `SELECT * FROM ship_fitting_limits WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.length > 0 ? new ShipFittingLimit(result.rows[0].id, result.rows[0].ship, 
            result.rows[0].power, result.rows[0].mass, result.rows[0].hardpoints) : null;
    }

    private async fetchModifications(client: any, shipId: string): Promise<ShipModification[]> {
        const query = `SELECT * FROM ship_modifications WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any) => new ShipModification(row.id, row.ship, row.name, row.description));
    }

    private async fetchCrew(client: any, shipId: string): Promise<Crew[]> {
        const query = `SELECT * FROM crew WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any) => new Crew(row.id, row.person, row.ship, row.experience, row.payrate, row.role));
    }

    private async fetchCargo(client: any, shipId: string): Promise<ShipCargo[]> {
        const query = `SELECT * FROM ship_cargo WHERE ship = $1`;
        const result = await client.query(query, [shipId]);
        return result.rows.map((row: any)    => new ShipCargo(row.id, row.ship, row.name, row.description, 
            row.quantity, row.cost, row.space_occupied));
    }    
}



