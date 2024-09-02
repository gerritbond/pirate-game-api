import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

const requestLogger = new Logger('RequestLogger');

const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestLogger.info(`${req.method} ${req.url}`, {
        headers: req.headers,
    });
    next();
};

export default requestLoggerMiddleware;