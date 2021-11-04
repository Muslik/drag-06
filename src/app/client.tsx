import { allSettled, createEvent, fork } from 'effector';
import { history, initializeClientHistory } from 'entities/navigation';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import { App } from './App';

const ready = createEvent();

const scope = fork({ values: INITIAL_STATE });

initializeClientHistory(scope);

allSettled(ready, { scope }).then(() => {
  ReactDOM.hydrate(
    <Router history={history}>
      <App root={scope} />
    </Router>,
    document.querySelector('#root'),
  );
});

if (module.hot) {
  module.hot.accept();
}
