import { useMemo, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { moveTask } from '../../features/tasks/tasksSlice';
import { Column } from './components/Column';
import { UserFilter } from './components/UserFilter';
import { remainingHours, formatDate } from '../../shared/lib/dateHelpers';
import { formatDuration } from '../../shared/lib/formatDuration';
import styles from './ActiveSprint.module.scss';

const COLUMNS = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'testing', title: 'Testing' },
  { status: 'done', title: 'Done' },
];

export default function ActiveSprint() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const users = useAppSelector((s) => s.users.items);
  const sprints = useAppSelector((s) => s.sprints.items);
  const activeSprintId = useAppSelector((s) => s.sprints.activeSprintId);
  const activeSprint = sprints.find((s) => s.id === activeSprintId);

  const [selectedUser, setSelectedUser] = useState('all');

  // Требуем сдвиг мыши минимум на 5px, чтобы не начать drag при клике
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const sprintTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === activeSprintId),
    [tasks, activeSprintId]
  );

  const visibleTasks = useMemo(
    () =>
      selectedUser === 'all'
        ? sprintTasks
        : sprintTasks.filter((t) => t.assigneeId === selectedUser),
    [sprintTasks, selectedUser]
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;
    dispatch(moveTask({ id: taskId, status: newStatus }));
  };

  if (!activeSprint) {
    return (
      <div className={styles.page}>
        <h1>Активный спринт</h1>
        <p className={styles.hint}>Активный спринт не найден.</p>
      </div>
    );
  }

  const hoursLeft = remainingHours(activeSprint.endDate);

  return (
    <div className={styles.page}>
      <div className={styles.sprintBar}>
        <div>
          <h1 className={styles.sprintName}>{activeSprint.name}</h1>
          <p className={styles.sprintGoal}>{activeSprint.goal}</p>
        </div>
        <div className={styles.sprintMeta}>
          <div>
            <span className={styles.metaLabel}>Начало</span>
            <span className={styles.metaValue}>{formatDate(activeSprint.startDate)}</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Конец</span>
            <span className={styles.metaValue}>{formatDate(activeSprint.endDate)}</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Осталось</span>
            <span className={styles.metaValueStrong}>
              {formatDuration(hoursLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <UserFilter users={users} value={selectedUser} onChange={setSelectedUser} />
        <span className={styles.taskCount}>
          Показано задач: <strong>{visibleTasks.length}</strong>
        </span>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              status={col.status}
              title={col.title}
              tasks={visibleTasks.filter((t) => t.status === col.status)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}