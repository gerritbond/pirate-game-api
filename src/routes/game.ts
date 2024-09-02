import { Router } from "express";
import { GameDataService } from "../services.data/game";
import { Logger } from "../utils/logger";

const router = Router();

const gameDataService = new GameDataService();
const logger = new Logger('GamesRouter')

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: API endpoints for managing games
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     description: Retrieve a list of all games
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: A list of games
 */
router.get("/", async (req, res) => {
    const games = await gameDataService.fetchAll();
    res.json(games);
});
  
/**
 * @swagger
 * /games/{gameId}:
 *   get:
 *     summary: Get a game by ID
 *     description: Retrieve a game by its unique identifier
 *     tags:
 *       - Games
 *     parameters:
 *       - name: gameId
 *         in: path
 *         description: ID of the game to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A game object
 *       404:
 *         description: Game not found
 */
router.get("/:gameId", async (req, res) => {
    const game = await gameDataService.fetchOne(req.params.gameId);
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ error: "Game not found" });
    }
});
  
/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     description: Create a new game with the provided data
 *     tags:
 *       - Games    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string 
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Game created successfully
 *       400:
 *         description: Failed to create game
 */
router.post("/", async (req, res) => {
    const newGame = await gameDataService.create(req.body);

    if (newGame) {
        res.status(201).json(newGame);
    } else {
        // TODO add submission validation to make this more useful
        res.status(400).json({ error: "Failed to create game" });
    }
});

/**
 * @swagger
 * /games/{gameId}:
 *   put:
 *     summary: Update a game by ID
 *     description: Update a game by its unique identifier
 *     tags:
 *       - Games
 *     parameters:
 *       - name: gameId
 *         in: path
 *         description: ID of the game to update
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:   
 *       200:
 *         description: Game updated successfully
 *       404:
 *         description: Game not found
 */
router.put("/:gameId", async (req, res) => {
    const { gameId } = req.params;
    const { name, description } = req.body;
    const updatedGame = await gameDataService.update({id: gameId, name, description });

    if (updatedGame) {
        res.json(updatedGame);
    } else {
        res.status(404).json({ error: "Game not found" });
    }
});
  
/**
 * @swagger
 * /games/{gameId}:
 *   delete:
 *     summary: Delete a game by ID
 *     description: Delete a game by its unique identifier
 *     tags:
 *       - Games
 *     parameters:
 *       - name: gameId
 *         in: path
 *         description: ID of the game to delete
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Game deleted successfully
 *       404:   
 *         description: Failed to delete game
 */ 
router.delete("/:gameId", async (req, res) => {
    const deleted = await gameDataService.delete(req.params.gameId);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Unable to delete game, no game found with specific id" });
    }
});
  

export default router;
