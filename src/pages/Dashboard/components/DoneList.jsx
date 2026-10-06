import { useAppSelector } from '../../../app/hooks';
import { formatDuration } from '../../../shared/lib/formatDuration';
import styles from './DoneList.module.scss';

export const DoneList = ({ tasks }) => {
  const users = useAppSelector((s) => s.users.items);
  const userById = Object.fromEntries(users.map((u) => [u.id, u]));

  if (!tasks.length) {
    return (
      <div className={styles.wrap}>
        <h3 className={styles.title}>Выполненные задачи</h3>
        <p className={styles.empty}>Пока нет выполненных задач по этому фильтру.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Выполненные задачи ({tasks.length})</h3>
      <ul className={styles.list}>
        {tasks.map((t) => (
          <li key={t.id} className={styles.item}>
            <div className={styles.left}>
              <span className={styles.id}>{t.id}</span>
              <div>
                <p className={styles.name}>{t.title}</p>
                {t.subtitle && <p className={styles.sub}>{t.subtitle}</p>}
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.duration}>{formatDuration(t.durationHours)}</span>
              <span className={styles.assignee}>
                {userById[t.assigneeId]?.fullName || '—'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};