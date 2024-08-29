import { v4 as uuidv4 } from 'uuid';

interface LogContext {
  [key: string]: any;
}

interface LogEntry {
  name: string;
  level: string;
  description: string;
  spanId: string;
  traceId: string;
  timestamp: string;
  context?: LogContext;
}

export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  log(level: string, description: string, context?: LogContext) {
    const logEntry: LogEntry = {
      name: this.name,
      level,
      description,
      spanId: uuidv4(),
      traceId: uuidv4(),
      timestamp: new Date().toISOString(),
      context,
    };

    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  info(description: string, context?: LogContext) {
    this.log('info', description, context);
  }

  warn(description: string, context?: LogContext) {
    this.log('warn', description, context);
  }

  error(description: string, context?: LogContext) {
    this.log('error', description, context);
  }
}
