/* 
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       tags:
 *         - Game
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 */
export class Game {
    constructor(
        public id: string,
        public name: string,
        public description: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
    }   
}