import {style} from '@mui/system';
import clsx from 'clsx';
import React from 'react';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';

const CheckoutInput = ({message, twobytwo,hookForm = {}, title, type, ...props}) => {
  if (type === 'phone') {
    return (
      <div className={clsx(styles.inputContainer,  twobytwo && styles.inputOverride)}>
        <ReactInputMask
          {...hookForm}
          {...props}
          type={'tel'}
          mask="+\9\94 (99) 999 99 99"
          className={clsx(styles.input,message && styles.errorStyle)}
        />
        <span className={styles.dynamicPlaceholder}>{title}</span>
      </div>
    );
  }

  return (
    <div 
    className={clsx(styles.inputContainer,  twobytwo && styles.inputOverride)}
    >
      <input
        {...hookForm}
        {...props}
        className={clsx(styles.input, message && styles.errorStyle)}
      />
      <span className={styles.dynamicPlaceholder}>{title}</span>
    </div>
  );
};

export default CheckoutInput;
