import express, { Request, Response } from 'express';
import { PersonDataService } from '../services.data/person';
import { Person } from '../models/person';
import { Logger } from '../utils/logger';

const router = express.Router();
const personDataService = new PersonDataService();
const logger = new Logger('People');

// Get a specific person by ID
/**
 * @swagger
 * /people/{id}:
 *   get:
 *     summary: Get a person by ID
 *     description: Retrieve a person by their unique identifier.
 *     tags:
 *       - People 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the person to retrieve. 
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A person object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'  
 *       404:
 *         description: Person not found
 *       500: 
 *         description: Error retrieving person
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const person = await personDataService.fetchOne(req.params.id);
    if (person) {
      res.json(person);
    } else {
      logger.error('Person not found', { id: req.params.id });
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    logger.error('Error retrieving person', { error });
    res.status(500).json({ message: 'Error retrieving person', error });
  }
});

// Get a paginated list of people
/**
 * @swagger
 * /people:
 *   get:
 *     summary: Get a list of people
 *     description: Retrieve a paginated list of people.
 *     tags:
 *       - People 
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: The number of people to retrieve per page.
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of people
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Error retrieving people
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const people = await personDataService.fetchMany(page, limit);
    res.json(people);
  } catch (error) {
    logger.error('Error retrieving people', { error });
    res.status(500).json({ message: 'Error retrieving people', error });
  }
});

// Create a new person
/**
 * @swagger
 * /people:
 *   post:
 *     summary: Create a new person
 *     description: Create a new person with the provided details.
 *     tags:
 *       - People
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Person'
 *     responses:
 *       201:
 *         description: The created person  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'  
 *       400:
 *         description: Bad request
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newPerson: Person = req.body;
    const createdPerson = await personDataService.create([newPerson]);
    res.status(201).json(createdPerson);
  } catch (error) {
    logger.error('Error creating person', { error });
    res.status(400).json({ message: 'Error creating person', error });
  }
});

// Update a person
/**
 * @swagger
 * /people/{id}:
 *   put:
 *     summary: Update a person
 *     description: Update an existing person by their unique identifier.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the person to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Person'
 *     responses:
 *       200:
 *         description: The updated person
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Person not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error updating person
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedPerson: Person = req.body;
    const person = await personDataService.update(req.params.id, updatedPerson);
    if (person) {
      res.json(person);
    } else {
      logger.error('Person not found', { id: req.params.id });
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    logger.error('Error updating person', { error });
    res.status(400).json({ message: 'Error updating person', error });
  }
});

// Kill endpoint (set living attribute to false)
/**
 * @swagger
 * /people/{id}/kill:
 *   put:
 *     summary: Kill a person
 *     description: Set the living attribute to false for a person by their unique identifier.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id 
 *         in: path
 *         description: The ID of the person to kill.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated person  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'  
 *       404:
 *         description: Person not found
 *       500:
 *         description: Error killing person
 */ 
router.put('/:id/kill', async (req: Request, res: Response) => {
  try {
    const person = await personDataService.update(req.params.id, { living: false });
    if (person) {
      res.json(person);
    } else {
      logger.error('Person not found', { id: req.params.id });
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    logger.error('Error killing person', { error });
    res.status(400).json({ message: 'Error killing person', error });
  }
});

export default router;
