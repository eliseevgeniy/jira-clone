import styles from './Tabs.module.scss';

export const Tabs = ({ value, onChange, options }) => (
  <div className={styles.tabs}>
    {options.map((o) => (
      <button
        key={o.value}
        className={`${styles.tab} ${value === o.value ? styles.active : ''}`}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);