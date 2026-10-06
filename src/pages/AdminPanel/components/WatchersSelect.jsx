import styles from './WatchersSelect.module.scss';

export const WatchersSelect = ({ users, value = [], onChange, excludeId }) => {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>Наблюдатели (необязательно)</label>
      <div className={styles.list}>
        {users
          .filter((u) => u.id !== excludeId)
          .map((u) => (
            <label key={u.id} className={styles.item}>
              <input
                type="checkbox"
                checked={value.includes(u.id)}
                onChange={() => toggle(u.id)}
              />
              <span>
                {u.fullName} <span className={styles.muted}>— {u.position}</span>
              </span>
            </label>
          ))}
      </div>
    </div>
  );
};