import { createEffect } from 'effector';

import { Answer, Request } from '@drag/shared/api';
import { env } from '@drag/shared/config';
import { logger } from '@drag/shared/lib/logger';

export const sendRequestFx = createEffect<Request, Answer, Answer>();

if (env.IS_DEBUG || env.IS_DEV_ENV) {
  sendRequestFx.watch(({ path, method }) => {
    logger.info('[ REQUEST ]', { method, path });
  });

  sendRequestFx.done.watch(({ params: { path, method }, result: { status } }) => {
    logger.info('[ REQUEST DONE ]', { method, path, status });
  });

  sendRequestFx.fail.watch(({ params: { path, method }, error: { status } }) => {
    logger.info('[ REQUEST FAIL ]', { method, path, status });
  });
}
