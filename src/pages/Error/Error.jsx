import PageWrapper from 'components/PageWrapper';
import styles from './Error.module.scss';

const Error = () => {
  return (
    <PageWrapper>
      <h1 className={styles.title}>404 Страница не найдена</h1>
    </PageWrapper>
  );
};

export default Error;
