import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useAppSelector } from '../../../app/hooks';
import { formatDuration } from '../../../shared/lib/formatDuration';
import styles from './TaskCard.module.scss';

const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const TaskCard = ({ task }) => {
  const users = useAppSelector((s) => s.users.items);
  const assignee = users.find((u) => u.id === task.assigneeId);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : 'auto',
  };

  const attachmentsCount = task.attachments?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.card}
      {...listeners}
      {...attributes}
    >
      <div className={styles.top}>
        <span className={styles.id}>{task.id}</span>
        <span className={`${styles.priority} ${styles[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      <h4 className={styles.title}>{task.title}</h4>

      {task.subtitle && <p className={styles.subtitle}>{task.subtitle}</p>}

      <div className={styles.footer}>
        <span className={styles.duration}>
          ⏱ {formatDuration(task.durationHours)}
        </span>

        <div className={styles.footerRight}>
          {attachmentsCount > 0 && (
            <span
              className={styles.attachments}
              title={`Вложений: ${attachmentsCount}`}
            >
              📎 {attachmentsCount}
            </span>
          )}

          {assignee && (
            <span className={styles.assignee} title={assignee.fullName}>
              {assignee.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};