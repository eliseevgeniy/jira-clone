import { forwardRef } from 'react';
import styles from './Input.module.scss';

export const Input = forwardRef(({ label, error, ...rest }, ref) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <input
      ref={ref}
      className={`${styles.input} ${error ? styles.error : ''}`}
      {...rest}
    />
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
));