import { useStore } from 'effector-react/ssr';

import { useStart, withStart } from '@drag/shared/lib/page-routing';

import * as model from './model';
import styles from './styles/home.module.scss';

export const HomePage = withStart(model.pageLoaded, () => {
  useStart(model.pageLoaded);

  const data = useStore(model.$data);

  return <section className={styles.main}>TITLE - {data[0]?.title}</section>;
});
