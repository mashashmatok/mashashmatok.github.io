import React, { useState, useEffect } from 'react';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({
  children,
  title,
  text,
  accentText,
  width,
  open,
  onOk,
  onCancel,
  okTitle,
  cancelTitle,
  onValidate,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event?.key === 'Enter' && !type) {
        handleSubmit();
      }
      if (event?.key === 'Escape') {
        handleCancel(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = () => {
    if ((onValidate && onValidate()) || !onValidate) {
      onOk && onOk();
      setIsOpen(false);
    }
  };

  const handleCancel = event => {
    if (event.target !== event.currentTarget && event.key !== 'Escape') return;

    onCancel && onCancel();
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modal_container} onMouseDown={handleCancel}>
          <div
            className={styles.modal}
            style={width ? { minWidth: `${width}px` } : null}
          >
            <h2>{title || 'Modal Window'}</h2>
            {text ? <p className={styles.text}>{text}</p> : null}
            {accentText ? (
              <span className={styles.accent_text}>{accentText}</span>
            ) : null}
            <div className={styles.content}>{children}</div>
            <div className={styles.actions}>
              <button
                className={type ? type : 'primary'}
                onClick={handleSubmit}
              >
                {okTitle || 'Ок'}
              </button>
              <button
                className={type ? 'outlined' : 'secondary'}
                onClick={handleCancel}
              >
                {cancelTitle || 'Отмена'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
