import superagent from 'superagent';

import type { Request } from '@drag/shared/api';
import { env } from '@drag/shared/config';

import { sendRequestFx } from './base';

sendRequestFx.use(request);

async function request({ path, method, query = {}, body, headers = {} }: Request) {
  const prefix = env.CLIENT_BACKEND_URL;
  const url = path.startsWith('/') ? `${prefix}${path}` : path;
  try {
    const response = await superagent[method](url).send(body).query(query).set(headers);

    const result = {
      ok: response.ok,
      status: response.status,
      body: response.body,
      headers: response.headers,
    };

    return result;
  } catch (error) {
    const errorResponse = error?.response || {};
    throw {
      ok: false,
      body: errorResponse.body ?? null,
      status: errorResponse.status ?? 900,
      headers: errorResponse.headers ?? null,
    };
  }
}
