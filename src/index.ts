import express from 'express';

import { logger } from '@drag/shared/lib/logger';

let app = require('./app/server').default;

if (module.hot) {
  module.hot.accept('./app/server', () => {
    logger.info('🔁  HMR Reloading `./server`...');
    try {
      app = require('./app/server').default;
    } catch (error) {
      logger.error(error);
    }
  });
  logger.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

// eslint-disable-next-line import/no-anonymous-default-export
export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    logger.info(`> App started http://localhost:${port}`);
  });
