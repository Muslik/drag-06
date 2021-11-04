import { createEffect } from 'effector';

import { FakeData } from '@drag/shared/api';
import { sendRequestFx } from '@drag/shared/api/request';

// TEMP DATA
export const fetchData = createEffect<void, FakeData[]>({
  async handler() {
    const response = await sendRequestFx({
      path: 'https://jsonplaceholder.typicode.com/todos',
      method: 'get',
    });
    return response.body as FakeData[];
  },
});
