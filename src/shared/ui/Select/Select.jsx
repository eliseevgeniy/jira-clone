import { forwardRef } from 'react';
import styles from './Select.module.scss';

export const Select = forwardRef(({ label, error, options = [], ...rest }, ref) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <select
      ref={ref}
      className={`${styles.select} ${error ? styles.error : ''}`}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
));