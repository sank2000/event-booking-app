import React, { useEffect } from 'react';
import classes from './Modal.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

import cx from 'classnames';

export default function Modal({
  style,
  innerStyle,
  className,
  title,
  children,
  isOpen,
  setIsOpen,
  CloseIcon,
  disableClose
}) {
  //  must props  ---->   isOpen ,setIsOpen

  useEffect(() => {
    if (isOpen) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div
      className={classes.modal__container}
      style={
        !isOpen
          ? { zIndex: -10, opacity: 0, transform: 'translateY("100%")' }
          : {
              zIndex: 8888,
              opacity: 1,
              transform: 'translateY("0")'
            }
      }
    >
      <div style={style} className={cx(classes.modal, { className: className !== undefined })}>
        <div className={classes.modal__header}>
          {title !== undefined && <h2 className={classes.modal__title}>{title}</h2>}
          {CloseIcon && (
            <div
              className={classes.close_btn}
              onClick={() => {
                if (disableClose === true) return;
                setIsOpen(false);
              }}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>

        <div style={innerStyle} className={classes.modal__inner}>
          {children}
        </div>
      </div>
    </div>
  );
}
