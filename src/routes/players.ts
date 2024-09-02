import express, { Request, Response } from 'express';
import { PlayerDataService } from '../services.data/player';
import { Logger } from '../utils/logger';

const router = express.Router();
const playerDataService = new PlayerDataService();
const logger = new Logger('Players');

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all players
 *     description: Retrieve a list of all players by game id
 *     parameters:
 *       - in: query
 *         name: gameId
 *         schema:
 *           type: string
 *         description: The ID of the game to filter players by
 *     tags:
 *       - Players
 *     responses:
 *       200:
 *         description: A list of players
 *         content:
 *           application/json:  
 *             schema:
 *               type: array
 *               items:
*                 $ref: '#/components/schemas/Player'
 *       400:
 *         description: Invalid game ID
 *       404:
 *         description: Game not found  
 */
router.get('/', async (req: Request, res: Response) => {
    const players = await playerDataService.fetchManyByGameId(req.query.gameId as string);
    res.json(players);
}); 

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     description: Retrieve a player by their ID
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the player to retrieve
 *     responses:
 *       200:
 *         description: A player object
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 */ 
router.get('/:id', async (req: Request, res: Response) => {
    const player = await playerDataService.fetchOne(req.params.id);

    if (!player) {  
        logger.warn(`Player not found: ${req.params.id}`);
        res.status(404).send();
    } else {
        res.json(player);
    }
});

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create a new player
 *     description: Create a new player for a game
 *     tags:
 *       - Players
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:  
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       400:
 *         description: Invalid request body
 */
router.post('/', async (req: Request, res: Response) => {
    const player = await playerDataService.create(req.body);

    if (!player) {
        logger.error(`Failed to create player: ${req.body}`);
        res.status(400).send();
    } else {    
        res.status(201).json(player);
    }
});

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Update a player
 *     description: Update an existing player
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the player to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Player updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Player not found
 */
router.put('/:id', async (req: Request, res: Response) => {
    const player = await playerDataService.update(req.body);

    if (!player) {
        logger.error(`Failed to update player: ${req.body}`);
        res.status(400).send();
    } else {    
        res.json(player);
    }
});

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     description: Delete a player by their ID
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the player to delete
 *     responses:
 *       204:
 *         description: Player deleted successfully
 *       400:   
 *         description: Invalid player ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const result = await playerDataService.delete(req.params.id);

    if (!result) {
        logger.error(`Failed to delete player: ${req.params.id}`);
        res.status(400).send();
    } else {    
        res.status(204).send();
    }
});

export default router;