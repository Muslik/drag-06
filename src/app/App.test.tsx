import { fork } from 'effector';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import { App } from './App';

describe('<Application />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div');
    const scope = fork();
    render(
      <MemoryRouter>
        <App root={scope} />
      </MemoryRouter>,
      div,
    );
  });
});
