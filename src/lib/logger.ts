/**
 * Custom logging utility
 * Replaces console.log with environment-aware logging
 */

import { env } from './env';

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log level colors for terminal output
 */
const LOG_COLORS = {
  [LogLevel.DEBUG]: '\x1b[36m', // Cyan
  [LogLevel.INFO]: '\x1b[32m',  // Green
  [LogLevel.WARN]: '\x1b[33m',  // Yellow
  [LogLevel.ERROR]: '\x1b[31m', // Red
  RESET: '\x1b[0m',
} as const;

/**
 * Format timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format log message with metadata
 */
function formatMessage(
  level: LogLevel,
  message: string,
  data?: unknown
): string {
  const timestamp = getTimestamp();
  const color = LOG_COLORS[level];
  const reset = LOG_COLORS.RESET;

  let formatted = `${color}[${timestamp}] [${level}]${reset} ${message}`;

  if (data !== undefined) {
    formatted += '\n' + JSON.stringify(data, null, 2);
  }

  return formatted;
}

/**
 * Should log based on environment and level
 */
function shouldLog(level: LogLevel): boolean {
  if (env.IS_PRODUCTION) {
    // In production, only log WARN and ERROR
    return level === LogLevel.WARN || level === LogLevel.ERROR;
  }
  // In development, log everything
  return true;
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, data?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const formattedMessage = formatMessage(level, message, data);

  switch (level) {
    case LogLevel.ERROR:
      console.error(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    case LogLevel.INFO:
      console.info(formattedMessage);
      break;
    case LogLevel.DEBUG:
      console.debug(formattedMessage);
      break;
  }
}

/**
 * Logger instance
 */
export const logger = {
  /**
   * Debug level logging
   * Only shows in development
   */
  debug: (message: string, data?: unknown) => {
    log(LogLevel.DEBUG, message, data);
  },

  /**
   * Info level logging
   * Only shows in development
   */
  info: (message: string, data?: unknown) => {
    log(LogLevel.INFO, message, data);
  },

  /**
   * Warning level logging
   * Shows in all environments
   */
  warn: (message: string, data?: unknown) => {
    log(LogLevel.WARN, message, data);
  },

  /**
   * Error level logging
   * Shows in all environments
   */
  error: (message: string, error?: unknown) => {
    log(LogLevel.ERROR, message, error);

    // In production, you might want to send errors to a monitoring service
    if (env.IS_PRODUCTION) {
      // TODO: Integrate with error monitoring service (e.g., Sentry)
      // Example: Sentry.captureException(error);
    }
  },

  /**
   * Log API request
   */
  apiRequest: (method: string, endpoint: string, data?: unknown) => {
    logger.debug(`API Request: ${method} ${endpoint}`, data);
  },

  /**
   * Log API response
   */
  apiResponse: (method: string, endpoint: string, status: number, data?: unknown) => {
    const message = `API Response: ${method} ${endpoint} - Status: ${status}`;
    if (status >= 400) {
      logger.error(message, data);
    } else {
      logger.debug(message, data);
    }
  },

  /**
   * Log authentication event
   */
  auth: (event: string, email?: string) => {
    logger.info(`Auth Event: ${event}`, email ? { email } : undefined);
  },

  /**
   * Log database operation
   */
  db: (operation: string, details?: unknown) => {
    logger.debug(`DB Operation: ${operation}`, details);
  },

  /**
   * Log payment event
   */
  payment: (event: string, details?: unknown) => {
    logger.info(`Payment Event: ${event}`, details);
  },

  /**
   * Log validation error
   */
  validation: (field: string, errors: string | Record<string, string>) => {
    logger.warn(`Validation Error: ${field}`, typeof errors === 'string' ? { error: errors } : { errors });
  },
};

/**
 * Create a namespaced logger
 * Useful for component or module-specific logging
 */
export function createLogger(namespace: string) {
  return {
    debug: (message: string, data?: unknown) =>
      logger.debug(`[${namespace}] ${message}`, data),
    info: (message: string, data?: unknown) =>
      logger.info(`[${namespace}] ${message}`, data),
    warn: (message: string, data?: unknown) =>
      logger.warn(`[${namespace}] ${message}`, data),
    error: (message: string, error?: unknown) =>
      logger.error(`[${namespace}] ${message}`, error),
  };
}

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
    logger.debug(`⏱️  Started: ${label}`);
  }

  end(): number {
    const duration = Date.now() - this.startTime;
    logger.debug(`⏱️  Completed: ${this.label} in ${duration}ms`);
    return duration;
  }
}

/**
 * Time an async operation
 */
export async function timeAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const timer = new PerformanceTimer(label);
  try {
    const result = await fn();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}

// Export default logger
export default logger;
