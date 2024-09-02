import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import peopleRouter from './src/routes/people';
import shipsRouter from './src/routes/ships';
import indexRouter from './src/routes/index';
import clocksRouter from './src/routes/clocks';
import gamesRouter from './src/routes/game';
import playersRouter from './src/routes/players';
import requestLoggerMiddleware from './src/middleware/requestLogger';
import path from 'path';

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aquilifer API',
      version: '1.0.0',
      description: 'API backing the Stars Without Number RPG campaign and administration platform.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
  },
  apis: [path.join(__dirname, './src/routes/*.ts'), path.join(__dirname, './src/models/*.ts'), path.join(__dirname, './src/routes/*.js'), path.join(__dirname, './src/models/*.js')],
  encoding: 'utf8',
  failOnErrors: true,
  verbose: true,
  format: 'json',
  output: 'json',
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
// app.use(logger('dev'));
app.use(requestLoggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/people', peopleRouter);
app.use('/ships', shipsRouter);
app.use('/games', gamesRouter);
app.use('/clocks', clocksRouter);
app.use('/players', playersRouter);

// 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;


