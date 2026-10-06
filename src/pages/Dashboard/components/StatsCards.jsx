import styles from './StatsCards.module.scss';

export const StatsCards = ({ stats }) => {
  const items = [
    { key: 'total', label: 'Всего задач', value: stats.total, tone: 'neutral' },
    { key: 'inProgress', label: 'В работе', value: stats.inProgress, tone: 'info' },
    { key: 'done', label: 'Выполнено', value: stats.done, tone: 'success' },
    { key: 'overdue', label: 'Просрочено', value: stats.overdue, tone: 'danger' },
  ];

  return (
    <div className={styles.grid}>
      {items.map((it) => (
        <div key={it.key} className={`${styles.card} ${styles[it.tone]}`}>
          <span className={styles.label}>{it.label}</span>
          <span className={styles.value}>{it.value}</span>
        </div>
      ))}
    </div>
  );
};