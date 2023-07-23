import React, { useState } from 'react';
import styles from './Tooltip.module.scss';

const Tooltip = ({ children, text, imageURL }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {show && !!text?.length && (
        <div className={styles.container}>
          <div className={styles.tooltip}>
            <pre>{text}</pre>
            <span className={styles.tooltip_arrow} />
          </div>
        </div>
      )}
      {show && !!imageURL?.length && (
        <div className={styles.container}>
          <div className={styles.image_container}>
            <span className={styles.tooltip_arrow} />
            <img src={imageURL} alt="" />
          </div>
        </div>
      )}
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default React.memo(Tooltip);
