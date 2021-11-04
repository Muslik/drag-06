/* eslint-disable no-console */
const createLogger = () => ({
  info: (...messages: unknown[]) => console.info(...messages),
  warn: (...messages: unknown[]) => console.warn(...messages),
  error: (...messages: unknown[]) => console.error(...messages),
});

export const logger = createLogger();
