import { attach, createStore, forward } from 'effector';

import { api, FakeData } from '@drag/shared/api';
import { createStart } from '@drag/shared/lib/page-routing';

export const pageLoaded = createStart();

// TEMP DATA
export const $data = createStore<FakeData[]>([]);

const fetchDataFx = attach({ effect: api.fetchData });

$data.on(fetchDataFx.doneData, (_, data) => data);

forward({
  from: pageLoaded,
  to: fetchDataFx,
});
