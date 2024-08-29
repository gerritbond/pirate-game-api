import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         first_name:
 *           type: string
 *         nickname:
 *           type: string
 *         last_name:
 *           type: string
 *         vice:
 *           type: string
 *         description:
 *           type: string
 *         regret:
 *           type: string
 *         goal:
 *           type: string
 *         age:
 *           type: number   
 *         sex:
 *           type: string
 *         gender:
 *           type: string
 *         living:
 *           type: boolean
 *         skills:
 *           type: array    
 *         job:
*            type: object       
 */ 
export class Person {
    constructor(
        public id: string = uuidv4(),
        public first_name: string,
        public nickname: string | null,
        public last_name: string,
        public vice: string | null,
        public description: string | null,
        public regret: string | null,
        public goal: string | null,
        public age: number | null,
        public sex: string | null,
        public gender: string | null,
        public living: boolean,
        public skills: PersonSkill[] = [],
        public job: Crew | null
    ) {
        this.id = id;
        this.first_name = first_name;
        this.nickname = nickname;
        this.last_name = last_name;
        this.vice = vice;
        this.description = description;
        this.regret = regret;
        this.goal = goal;
        this.age = age; 
        this.gender = gender;
        this.living = living;
        this.skills = skills;
        this.job = job; 
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PersonSkill:
 *       type: object
 *       properties:
 *         id:
 *           type: string   
 *         person:
 *           type: string
 *         skill:
 *           type: string
 *         description:
 *           type: string
 */
export class PersonSkill {
    constructor(
        public id: string = uuidv4(),
        public person: string,
        public skill: string,
        public description: string,
    ) {
        this.id = id;
        this.person = person;
        this.skill = skill;
        this.description = description;
    }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Crew:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         person:
 *           type: string
 *         ship:
 *           type: string
 *         experience:
 *           type: number
 *         payrate:
 *           type: number
 *         role:
 *           type: string
 */
export class Crew {
    constructor(
        public id: string = uuidv4(),
        public person: string,
        public ship: string,
        public experience: number,
        public payrate: number,
        public role: string,
    ) {
        this.id = id;
        this.person = person;
        this.ship = ship;
        this.experience = experience;
        this.payrate = payrate;
        this.role = role;
    }
};

