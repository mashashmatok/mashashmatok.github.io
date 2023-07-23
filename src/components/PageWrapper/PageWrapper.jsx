import Header from 'components/Header';
import ToTopButton from 'components/Button/ToTopButton';
import styles from './PageWrapper.module.scss';

const PageWrapper = ({ children }) => {
  return (
    <div className={styles.content}>
      <Header />
      {children}
      <ToTopButton />
    </div>
  );
};

export default PageWrapper;
