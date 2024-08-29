import express from 'express';
import { ShipDataService } from '../services.data/ships';
import { Logger } from '../utils/logger';

const router = express.Router();
const shipService = new ShipDataService();

const logger = new Logger('Ships');

// Get a single ship by ID
/**
 * @swagger
 * /ships/{id}:
 *   get:
 *     summary: Get a ship by ID
 *     description: Retrieve a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
*       - name: id
 *         in: path
 *         description: The ID of the ship to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A ship object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 *       404:
 *         description: Ship not found
 */
router.get('/:id', async (req, res) => {
  try {
    const ship = await shipService.fetchOne(req.params.id);
    if (!ship) {
      logger.error('Ship not found', { id: req.params.id });
      return res.status(404).json({ message: 'Ship not found' });
    }
    res.json(ship);
  } catch (error) {
    logger.error('Error fetching ship', { error });
    res.status(500).json({ message: 'Error fetching ship', error });
  }
});

// Get paginated list of ships
/**
 * @swagger
 * /ships:
 *   get:
 *     summary: Get a paginated list of ships
 *     description: Retrieve a paginated list of ships.
 *     tags:
 *       - Ships  
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query  
 *         description: The number of ships to retrieve per page.
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A paginated list of ships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ship'
 *       500:
 *         description: Error fetching ships
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const ships = await shipService.fetchMany(page, limit);
    res.json(ships);
  } catch (error) {
    logger.error('Error fetching ships', { error });
    res.status(500).json({ message: 'Error fetching ships', error });
  }
});

// Create a new ship
/**
 * @swagger
 * /ships:
 *   post:
 *     summary: Create a new ship
 *     description: Create a new ship with the specified details.
 *     tags:
 *       - Ships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ship'
 *     responses:
 *       201:
 *         description: Ship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */
router.post('/', async (req, res) => {
  try {
    const { ship, crew } = req.body;
    const newShip = await shipService.create(ship);
    res.status(201).json(newShip);
  } catch (error) {
    logger.error('Error creating ship', { error });
    res.status(500).json({ message: 'Error creating ship', error });
  }
});

// Update a ship by ID
/**
 * @swagger
 * /ships/{id}:
 *   put:
 *     summary: Update a ship by ID
 *     description: Update a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ship'
 *     responses:
 *       200:
 *         description: Ship updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */
router.put('/:id', async (req, res) => {
  try {
    const { ship, crew } = req.body;
    const updatedShip = await shipService.update(req.params.id, ship);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error updating ship', { error });
    res.status(500).json({ message: 'Error updating ship', error });
  }
});

// Add weapons to a ship
/**
 * @swagger
 * /ships/{id}/weapons:
 *   post:
 *     summary: Add weapons to a ship
 *     description: Add weapons to a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to add weapons to.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Weapon'
 *     responses:
 *       200:
 *         description: Weapons added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */     
router.post('/:id/weapons', async (req, res) => {
  try {
    const { weapons } = req.body;
    const updatedShip = await shipService.addWeapon(req.params.id, weapons);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error adding weapons to ship', { error });
    res.status(500).json({ message: 'Error adding weapons to ship', error });
  }
});

// Add fittings to a ship
/**
 * @swagger
 * /ships/{id}/fittings:
 *   post:
 *     summary: Add fittings to a ship
 *     description: Add fittings to a ship by its unique identifier.
 *     tags:
 *       - Ships  
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to add fittings to.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Fitting'
 *     responses:
 *       200:
 *         description: Fittings added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */
router.post('/:id/fittings', async (req, res) => {
  try {
    const { fittings } = req.body;
    const updatedShip = await shipService.addFitting(req.params.id, fittings);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error adding fittings to ship', { error });
    res.status(500).json({ message: 'Error adding fittings to ship', error });
  }
});

// Add modifications to a ship
/**
 * @swagger
 * /ships/{id}/modifications:
 *   post:
 *     summary: Add modifications to a ship
 *     description: Add modifications to a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to add modifications to.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Modification'
 *     responses:
 *       200:
 *         description: Modifications added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */
router.post('/:id/modifications', async (req, res) => {
  try {
    const { modifications } = req.body;
    const updatedShip = await shipService.addModification(req.params.id, modifications);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error adding modifications to ship', { error });
    res.status(500).json({ message: 'Error adding modifications to ship', error });
  }
});

// Add cargo to a ship
/**
 * @swagger
 * /ships/{id}/cargo:
 *   post:
 *     summary: Add cargo to a ship
 *     description: Add cargo to a ship by its unique identifier.
 *     tags:  
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to add cargo to.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Cargo'
 *     responses:
 *       200:
 *         description: Cargo added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */
router.post('/:id/cargo', async (req, res) => {
  try {
    const { cargo } = req.body;
    const updatedShip = await shipService.addCargo(req.params.id, cargo);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error adding cargo to ship', { error });
    res.status(500).json({ message: 'Error adding cargo to ship', error });
  }
});

// Remove weapons from a ship
/**
 * @swagger
 * /ships/{id}/weapons:
 *   delete:
 *     summary: Remove weapons from a ship
 *     description: Remove weapons from a ship by its unique identifier.
 *     tags:  
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to remove weapons from.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Weapon'
 *     responses:
 *       200:
 *         description: Weapons removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */ 
router.delete('/:id/weapons', async (req, res) => {
  try {
    const { weaponIds } = req.body;
    const updatedShip = await shipService.removeWeapon(req.params.id, weaponIds);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error removing weapons from ship', { error });
    res.status(500).json({ message: 'Error removing weapons from ship', error });
  }
});

// Remove fittings from a ship
/**
 * @swagger
 * /ships/{id}/fittings:
 *   delete:
 *     summary: Remove fittings from a ship
 *     description: Remove fittings from a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to remove fittings from.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 */ 
router.delete('/:id/fittings', async (req, res) => {
  try {
    const { fittingIds } = req.body;
    const updatedShip = await shipService.removeFitting(req.params.id, fittingIds);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error removing fittings from ship', { error });
    res.status(500).json({ message: 'Error removing fittings from ship', error });
  }
});

// Remove modifications from a ship
/**
 * @swagger
 * /ships/{id}/modifications:
 *   delete:
 *     summary: Remove modifications from a ship
 *     description: Remove modifications from a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to remove modifications from.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Modification'
 *     responses:
 *       200:
 *         description: Modifications removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'  
 */ 
router.delete('/:id/modifications', async (req, res) => {
  try {
    const { modificationIds } = req.body;
    const updatedShip = await shipService.removeModification(req.params.id, modificationIds);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error removing modifications from ship', { error });
    res.status(500).json({ message: 'Error removing modifications from ship', error });
  }
});

// Remove cargo from a ship
/**
 * @swagger
 * /ships/{id}/cargo:
 *   delete:
 *     summary: Remove cargo from a ship
 *     description: Remove cargo from a ship by its unique identifier.
 *     tags:
 *       - Ships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the ship to remove cargo from.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Cargo'
 *     responses:
 *       200:
 *         description: Cargo removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ship'
 */ 
router.delete('/:id/cargo', async (req, res) => {
  try {
    const { cargoIds } = req.body;
    const updatedShip = await shipService.removeCargo(req.params.id, cargoIds);
    res.json(updatedShip);
  } catch (error) {
    logger.error('Error removing cargo from ship', { error });
    res.status(500).json({ message: 'Error removing cargo from ship', error });
  }
});

export default router;
