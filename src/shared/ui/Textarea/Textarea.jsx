import { forwardRef } from 'react';
import styles from './Textarea.module.scss';

export const Textarea = forwardRef(({ label, error, ...rest }, ref) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <textarea
      ref={ref}
      rows={4}
      className={`${styles.textarea} ${error ? styles.error : ''}`}
      {...rest}
    />
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
));