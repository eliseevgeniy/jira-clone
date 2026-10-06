import styles from './UserFilter.module.scss';

export const UserFilter = ({ users, value, onChange }) => {
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.chip} ${value === 'all' ? styles.active : ''}`}
        onClick={() => onChange('all')}
      >
        Все участники
      </button>
      {users.map((u) => (
        <button
          key={u.id}
          className={`${styles.chip} ${value === u.id ? styles.active : ''}`}
          onClick={() => onChange(u.id)}
          title={`${u.fullName} — ${u.position}`}
        >
          {u.fullName}
        </button>
      ))}
    </div>
  );
};