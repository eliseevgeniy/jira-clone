import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import styles from './Column.module.scss';

export const Column = ({ status, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.over : ''}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.body}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className={styles.empty}>Перетащите сюда задачу</p>
        )}
      </div>
    </div>
  );
};