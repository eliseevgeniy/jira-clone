import { useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { StatsCards } from './components/StatsCards';
import { DoneList } from './components/DoneList';
import { BurndownChart } from './components/BurndownChart';
import { Tabs } from './components/Tabs';
import { buildBurndownData } from '../../shared/lib/burndown';
import { remainingHours, formatDate } from '../../shared/lib/dateHelpers';
import { formatDuration } from '../../shared/lib/formatDuration';
import styles from './Dashboard.module.scss';

const TABS = [
  { value: 'product', label: 'Product' },
  { value: 'backlog', label: 'Backlog' },
];

export default function Dashboard() {
  const tasks = useAppSelector((s) => s.tasks.items);
  const users = useAppSelector((s) => s.users.items);
  const sprints = useAppSelector((s) => s.sprints.items);
  const activeSprintId = useAppSelector((s) => s.sprints.activeSprintId);
  const currentUserId = useAppSelector((s) => s.users.currentUserId);
  const activeSprint = sprints.find((s) => s.id === activeSprintId);

  // «Все» или конкретный пользователь
  const [userFilter, setUserFilter] = useState('all');
  // Product / Backlog
  const [tab, setTab] = useState('product');

  // Задачи активного спринта
  const sprintTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === activeSprintId),
    [tasks, activeSprintId]
  );

  // Фильтр по пользователю
  const userTasks = useMemo(
    () =>
      userFilter === 'all'
        ? sprintTasks
        : sprintTasks.filter((t) => t.assigneeId === userFilter),
    [sprintTasks, userFilter]
  );

  // Фильтр по вкладке:
  //   product — все задачи спринта (бэклог + работа + done)
  //   backlog — только те, что ещё не начаты (todo)
  const tabTasks = useMemo(() => {
    if (tab === 'backlog') return userTasks.filter((t) => t.status === 'todo');
    return userTasks;
  }, [userTasks, tab]);

  // Статистика по текущему фильтру
  const stats = useMemo(() => {
    
    return {
      total: userTasks.length,
      inProgress: userTasks.filter((t) => t.status === 'in-progress').length,
      done: userTasks.filter((t) => t.status === 'done').length,
      overdue:
        activeSprint && remainingHours(activeSprint.endDate) <= 0
          ? userTasks.filter((t) => t.status !== 'done').length
          : 0,
    };
  }, [userTasks, activeSprint]);

  const doneTasks = useMemo(
    () => tabTasks.filter((t) => t.status === 'done'),
    [tabTasks]
  );

  const burndownData = useMemo(
    () => buildBurndownData(activeSprint, sprintTasks),
    [activeSprint, sprintTasks]
  );

  const progress = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  return (
    <div className={styles.page}>
      {activeSprint && (
        <div className={styles.sprintCard}>
          <div className={styles.sprintHead}>
            <div>
              <h1 className={styles.sprintName}>{activeSprint.name}</h1>
              <p className={styles.sprintGoal}>{activeSprint.goal}</p>
            </div>
            <div className={styles.sprintMeta}>
              <div>
                <span className={styles.metaLabel}>Период</span>
                <span className={styles.metaValue}>
                  {formatDate(activeSprint.startDate)} — {formatDate(activeSprint.endDate)}
                </span>
              </div>
              <div>
                <span className={styles.metaLabel}>Осталось</span>
                <span className={styles.metaValueStrong}>
                  {formatDuration(remainingHours(activeSprint.endDate))}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              Прогресс: {progress}% ({stats.done} из {stats.total})
            </span>
          </div>
        </div>
      )}

      <StatsCards stats={stats} />

      <div className={styles.filtersRow}>
        <Tabs value={tab} onChange={setTab} options={TABS} />
        <div className={styles.userFilter}>
          <label className={styles.userFilterLabel}>Фильтр:</label>
          <select
            className={styles.select}
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="all">Вся команда</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
          {userFilter === currentUserId && (
            <span className={styles.badge}>only my issues</span>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <DoneList tasks={doneTasks} />
        <BurndownChart data={burndownData} />
      </div>
    </div>
  );
}