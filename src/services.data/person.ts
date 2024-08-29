import { pool } from './db';
import { Person, PersonSkill, Crew } from '../models/person';
import { Logger } from '../utils/logger';

export class PersonDataService {
    private logger = new Logger('PersonDataService');

    async create(people: Person[]) {
        const client = await pool.connect();
        const results: Person[] = [];
        try {
            this.logger.info('Creating people', { people });
            await client.query('BEGIN');

            for(const person of people) {
                const query = `INSERT INTO person (first_name, nickname, last_name, vice, description, regret, goal, age, sex, gender, living) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
                const values = [person.first_name, person.nickname, person.last_name, person.vice, person.description, person.regret, person.goal, person.age, person.sex, person.gender, person.living];
                const result = await client.query(query, values);

                const personResult = new Person(result.rows[0].id, result.rows[0].first_name, result.rows[0].nickname, result.rows[0].last_name, result.rows[0].vice, result.rows[0].description, result.rows[0].regret, result.rows[0].goal, result.rows[0].age, result.rows[0].sex, result.rows[0].gender, result.rows[0].living, [], null);
                
                const skillsQuery = `INSERT INTO skills (person, skill, description) VALUES ($1, $2, $3) RETURNING *`;
                for(const s of person.skills) {
                    const skillsValues = [personResult.id, s.skill, s.description];
                    const skillsResult = await client.query(skillsQuery, skillsValues);
                
                    const skill: PersonSkill = {id: skillsResult.rows[0].id, person: personResult.id, skill: skillsResult.rows[0].skill, description: skillsResult.rows[0].description};
                    personResult.skills.push(skill);
                }
                results.push(personResult);

                this.logger.info('Person created - Pending Commmit', { person: personResult });
            }

            await client.query('COMMIT');
            this.logger.info('People created', { people: results });
            return results;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async fetchOne(id: string) {
        const query = `SELECT * FROM person LEFT JOIN person_skills ON person.id = person_skills.person WHERE person.id = $1`;
        const values = [id];

        this.logger.info('Reading person', { id });
        const result = await pool.query(query, values);

        const person = new Person(result.rows[0].id, result.rows[0].first_name, result.rows[0].nickname, result.rows[0].last_name, result.rows[0].vice, result.rows[0].description, result.rows[0].regret, result.rows[0].goal, result.rows[0].age, result.rows[0].sex, result.rows[0].gender, result.rows[0].living, [], null);

        for(const s of result.rows) {
            const skill: PersonSkill = {id: s.id, person: s.person, skill: s.skill, description: s.description};
            person.skills.push(skill);
        }

        const jobQuery = `SELECT * FROM crew WHERE person = $1`;
        const jobResult = await pool.query(jobQuery, [person.job]);
        const job = new Crew(jobResult.rows[0].id, jobResult.rows[0].person, jobResult.rows[0].ship, jobResult.rows[0].experience, jobResult.rows[0].payrate, jobResult.rows[0].role);
        person.job = job;
        this.logger.info('Person read', { person });
        return person;
    }

    async fetchMany(page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const query = `
            SELECT p.*, ps.id as skill_id, ps.skill, ps.description as skill_description,
                   c.id as crew_id, c.ship, c.experience, c.payrate, c.role
            FROM person p
            LEFT JOIN person_skills ps ON p.id = ps.person
            LEFT JOIN crew c ON p.id = c.person
            ORDER BY p.last_name
            LIMIT $1 OFFSET $2
        `;
        const values = [pageSize, offset];

        const result = await pool.query(query, values);

        const peopleMap = new Map<string, Person>();

        for (const row of result.rows) {
            if (!peopleMap.has(row.id)) {
                const person = new Person(
                    row.id, row.first_name, row.nickname, row.last_name,
                    row.vice, row.description, row.regret, row.goal,
                    row.age, row.sex, row.gender, row.living, [], null
                );
                peopleMap.set(row.id, person);
            }

            const person = peopleMap.get(row.id)!;

            if (row.skill_id) {
                const skill: PersonSkill = {
                    id: row.skill_id,
                    person: row.id,
                    skill: row.skill,
                    description: row.skill_description
                };
                if (!person.skills.some(s => s.id === skill.id)) {
                    person.skills.push(skill);
                }
            }

            if (row.crew_id && !person.job) {
                person.job = new Crew(
                    row.crew_id, row.id, row.ship,
                    row.experience, row.payrate, row.role
                );
            }
        }

        return Array.from(peopleMap.values());
    }

    async update(id: string, updateFields: Partial<Person>): Promise<Person | null> {
        const updateColumns = Object.keys(updateFields).filter(key => key !== 'id' && key !== 'skills' && key !== 'job');
        const setClauses = updateColumns.map((col, index) => `${col} = $${index + 1}`);
        const query = `UPDATE person SET ${setClauses.join(', ')} WHERE id = $${updateColumns.length + 1}`;
        const values = [...updateColumns.map(col => updateFields[col as keyof Person]), id];
        
        this.logger.info('Updating person', { id, updateFields });
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return null;
        }
        this.logger.info('Person updated', { id });
        return this.fetchOne(id);
    }

    async delete(id: string) {
        const query = `DELETE FROM person WHERE id = $1`;
        const values = [id];
        await pool.query(query, values);
    }   

    async addSkill(personId: string, skill: PersonSkill) {
        const query = `INSERT INTO person_skills (person, skill, description) VALUES ($1, $2, $3) RETURNING *`;
        const values = [personId, skill.skill, skill.description];
        const result = await pool.query(query, values);
        return result.rows[0];
    }   

    async removeSkill(personId: string, skillId: string) {
        const query = `DELETE FROM person_skills WHERE id = $1 AND person = $2`;
        const values = [skillId, personId];
        await pool.query(query, values);
    }

    async addJob(personId: string, crew: Crew) {
        const query = `INSERT INTO crew (person, ship, experience, payrate, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [personId, crew.ship, crew.experience, crew.payrate, crew.role];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async removeJob(personId: string, crewId: string) {
        const query = `DELETE FROM crew WHERE id = $1 AND person = $2`; 
        const values = [crewId, personId];
        await pool.query(query, values);
    }
}