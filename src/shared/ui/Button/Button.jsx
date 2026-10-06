import styles from './Button.module.scss';

export const Button = ({ children, variant = 'primary', ...rest }) => (
  <button className={`${styles.btn} ${styles[variant]}`} {...rest}>
    {children}
  </button>
);