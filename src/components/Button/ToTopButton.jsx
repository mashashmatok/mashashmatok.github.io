import React, { useState, useEffect } from 'react';
import { ReactComponent as Arrow } from 'assets/icons/up_arrow_button.svg';
import styles from './ToTopButton.module.scss';

const ToTopButton = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const onScroll = () => {
    if (
      document.body.scrollTop > 30 ||
      document.documentElement.scrollTop > 30
    ) {
      setIsButtonVisible(true);
    } else {
      setIsButtonVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleOnTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <Arrow
      className={styles.arrow_icon}
      style={{
        opacity: isButtonVisible ? '1' : '0',
      }}
      onClick={handleOnTop}
    />
  );
};

export default ToTopButton;
