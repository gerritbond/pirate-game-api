import express, { Request, Response } from 'express';
import { EventClockDataService } from '../services.data/eventClocks';
import { EventClock, EventClockGroup } from '../models/eventClocks';
import { Logger } from '../utils/logger';

const router = express.Router();
const eventClockDataService = new EventClockDataService();
const logger = new Logger('EventClocks');

interface IncreaseClockSegmentsRequest {
    clockId: string;
    segments: number;
}

interface IncreaseClockSegmentsByGroupRequest {
    groupId: string;
    segments: number;
}

interface AttachClockToGroupRequest {
    clockId: string;
    groupId: string;
}

interface DetachClockFromGroupRequest {
    clockId: string;
}

/**
 * @swagger
 * /clocks:
 *   get:
 *     summary: Get event clock by id
 *     description: Get an event clock by its id
 *     tags:
 *       - EventClock
 *     parameters:
 *       - in: query
 *         name: clockId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event clock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:
 *         description: Error fetching event clock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string   
 */
router.get('/', async (req: Request, res: Response) => {
    const clockId = req.query.clockId as string;

    try {
        const eventClock = await eventClockDataService.fetchEventClock(clockId);
        res.json(eventClock);
    } catch (error: any) {
        logger.error("Error fetching event clock", { error });
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /clocks:
 *   post:
 *     summary: Create an event clock
 *     description: Create a new event clock
 *     tags:
 *       - EventClock
 *     parameters:
 *       - in: body
 *         name: eventClock
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description: 
 *               type: string
 *             segments:
 *               type: integer
 *             groupId:
 *               type: string
 *     responses:
 *       200:
 *         description: Event clock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:
 *         description: Error creating event clock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */ 
router.post('/', async (req: Request, res: Response) => {
    const eventClock = req.body;

    try {
        const newEventClock: EventClock = await eventClockDataService.createEventClock(eventClock);
        res.json(newEventClock);
    } catch (error: any) {
        logger.error("Error creating event clock", { error });
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /clocks:
 *   delete:
 *     summary: Delete an event clock
 *     description: Delete an event clock by its id
 *     tags:
 *       - EventClock
 *     parameters:
 *       - in: query
 *         name: clockId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event clock deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:
 *         description: Error deleting event clock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/', async (req: Request, res: Response) => {
    const clockId = req.query.clockId as string;

    try {
        const deletedEventClock = await eventClockDataService.deleteEventClock(clockId);
        res.json(deletedEventClock);
    } catch (error: any) {
        logger.error("Error deleting event clock", { error });  
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /clocks/group:
 *   post:
 *     summary: Create an event clock group
 *     description: Create a new event clock group
 *     tags:
 *       - EventClockGroup
 *     parameters:
*       - in: body
 *         name: eventClockGroup
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Event clock group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClockGroup'
 *       500:
 *         description: Error creating event clock group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/group', async (req: Request, res: Response) => {
    const eventClockGroup = req.body;

    try {
        const newEventClockGroup: EventClockGroup = await eventClockDataService.createEventClockGroup(eventClockGroup);
        res.json(newEventClockGroup);
    } catch (error: any) {
        logger.error("Error creating event clock group", { error });
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /clocks/group:
 *   delete:
 *     summary: Delete an event clock group
 *     description: Delete an event clock group by its id
 *     tags:
 *       - EventClockGroup
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event clock group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClockGroup'
 *       500:
 *         description: Error deleting event clock group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/group', async (req: Request, res: Response) => {
    const groupId = req.query.groupId as string;

    try {
        const deletedEventClockGroup = await eventClockDataService.deleteEventClockGroup(groupId);
        res.json(deletedEventClockGroup);
    } catch (error: any) {
        logger.error("Error deleting event clock group", { error });
        res.status(500).json({ error: error.message });
    }
}); 

/**
 * @swagger
 * /clocks/advance:
 *   put:
 *     summary: Advance an event clock
 *     description: Advance an event clock by its id
 *     tags:
 *       - EventClock
 *     parameters:
 *       - in: body
 *         name: increaseClockSegmentsRequest
 *         schema:
 *           type: object
 *           properties:
 *             clockId:
 *               type: string
 *             segments:
 *               type: integer  
 *     responses:
 *       200:
 *         description: Event clock advanced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:
 *         description: Error advancing event clock 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */ 
router.put('/advance', async (req: Request, res: Response) => {
    const increaseClockSegmentsRequest: IncreaseClockSegmentsRequest = req.body;

    try {
        const updatedEventClock: EventClock = await eventClockDataService.advanceEventClock(increaseClockSegmentsRequest.clockId, increaseClockSegmentsRequest.segments);
        res.json(updatedEventClock);
    } catch (error: any) {
        logger.error("Error increasing clock segments", { error });
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /clocks/advance-group:
 *   put:
 *     summary: Advance an event clock group
 *     description: Advance an event clock group by its id
 *     tags:
 *       - EventClockGroup
 *     parameters:
 *       - in: body
 *         name: increaseClockSegmentsByGroupRequest
 *         schema:
 *           type: object
 *           properties:
 *             groupId:
 *               type: string
 *             segments:
 *               type: integer  
 *     responses:
 *       200:
 *         description: Event clock group advanced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClockGroup'
 *       500:
 *         description: Error advancing event clock group   
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */ 
router.put('/advance-group', async (req: Request, res: Response) => {
    const increaseClockSegmentsByGroupRequest: IncreaseClockSegmentsByGroupRequest = req.body;

    try {
        const updatedEventClockGroup: EventClockGroup = await eventClockDataService.advanceEventClockGroup(increaseClockSegmentsByGroupRequest.groupId, increaseClockSegmentsByGroupRequest.segments);
        res.json(updatedEventClockGroup);
    } catch (error: any) {
        logger.error("Error increasing clock segments by group", { error });
        res.status(500).json({ error: error.message }); 
    }
}); 

/**
 * @swagger
 * /clocks/attach-to-group:
 *   put:
 *     summary: Attach an event clock to a group
 *     description: Attach an event clock to a group by its id
 *     tags:
 *       - EventClock
 *     parameters:
*       - in: body
 *         name: attachClockToGroupRequest
 *         schema:
 *           type: object
 *           properties:
 *             clockId:
 *               type: string
 *             groupId:
 *               type: string
 *     responses:
 *       200:
 *         description: Event clock attached to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:   
 *         description: Error attaching clock to group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */ 
router.put('/attach-to-group', async (req: Request, res: Response) => {
    const attachClockToGroupRequest: AttachClockToGroupRequest = req.body;

    try {
        const updatedEventClock: EventClock = await eventClockDataService.attachToGroup(attachClockToGroupRequest.clockId, attachClockToGroupRequest.groupId);
        res.json(updatedEventClock);
    } catch (error: any) {
        logger.error("Error attaching clock to group", { error });
        res.status(500).json({ error: error.message }); 
    }
});

/**
 * @swagger
 * /clocks/detach-from-group:
 *   delete:
 *     summary: Detach an event clock from a group
 *     description: Detach an event clock from a group by its id
 *     tags:
 *       - EventClock
 *     parameters:
 *       - in: query
 *         name: clockId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event clock detached from group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventClock'
 *       500:
 *         description: Error detaching clock from group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:    
 *                 error:
 *                   type: string
 */ 
router.delete('/detach-from-group', async (req: Request, res: Response) => {
    const detachClockFromGroupRequest: DetachClockFromGroupRequest = req.body;

    try {
        const updatedEventClock: EventClock = await eventClockDataService.detachFromGroup(detachClockFromGroupRequest.clockId);
        res.json(updatedEventClock);
    } catch (error: any) {
        logger.error("Error detaching clock from group", { error });
        res.status(500).json({ error: error.message });  
    }
});


export default router;