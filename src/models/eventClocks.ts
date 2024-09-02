
/* 
 * @swagger
 * components:
 *   schemas:
 *     EventClock:
 *       type: object
 *       tags:
 *         - EventClock
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string   
 *         description:
 *           type: string
 *         segments:
 *           type: integer
 *         gameId:
 *           type: string
 *         groupId:
 *           type: string   
 */
export class EventClock {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public segments: number,
        public gameId: string,
        public groupId: string | null = null,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.segments = segments;
        this.gameId = gameId;
        this.groupId = groupId;
    }
}

/* 
 * @swagger
 * components:
 *   schemas:
 *     EventClockGroup:
 *       type: object
 *       tags:
 *         - EventCLock
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string   
 *         description:
 *           type: string
 *         gameId:
 *           type: string
 */ 
export class EventClockGroup {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public gameId: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.gameId = gameId;
    }
}