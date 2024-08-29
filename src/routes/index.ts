import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check the health of the service
 *     description: Ensure the service is running and responding correctly.
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string 
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
