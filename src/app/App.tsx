import { Scope } from 'effector';
import { Provider } from 'effector-react/ssr';

import { Pages } from '@drag/pages';

import './styles/index.scss';

interface Props {
  root: Scope;
}

export const App = ({ root }: Props) => (
  <Provider value={root}>
    <Pages />
  </Provider>
);
