import { useState } from 'react';
import { Button } from '../../shared/ui/Button/Button';
import { CreateTaskForm } from './components/CreateTaskForm';
import { CreateSprintForm } from './components/CreateSprintForm';
import { AddMemberForm } from './components/AddMemberForm';
import { useAppSelector } from '../../app/hooks';
import { formatDuration } from '../../shared/lib/formatDuration';
import { formatDate } from '../../shared/lib/dateHelpers';
import styles from './AdminPanel.module.scss';

const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const SPRINT_STATUS_LABELS = {
  planned: 'Запланирован',
  active: 'Активный',
  closed: 'Закрыт',
};

export default function AdminPanel() {
  const [taskOpen, setTaskOpen] = useState(false);
  const [sprintOpen, setSprintOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  const tasks = useAppSelector((s) => s.tasks.items);
  const users = useAppSelector((s) => s.users.items);
  const sprints = useAppSelector((s) => s.sprints.items);

  const userById = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Панель администратора</h1>
          <p className={styles.subtitle}>
            Создание задач, управление спринтами и участниками команды
          </p>
        </div>
        <div className={styles.actions}>
          <Button onClick={() => setTaskOpen(true)}>+ Задача</Button>
          <Button variant="secondary" onClick={() => setSprintOpen(true)}>
            + Спринт
          </Button>
          <Button variant="secondary" onClick={() => setMemberOpen(true)}>
            + Участник
          </Button>
        </div>
      </div>

      {/* --- Спринты --- */}
      <section className={styles.section}>
        <h2>Спринты ({sprints.length})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цель</th>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {sprints.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>
                    Спринтов пока нет. Создайте первый!
                  </td>
                </tr>
              )}
              {sprints.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.goal}</td>
                  <td>{formatDate(s.startDate)}</td>
                  <td>{formatDate(s.endDate)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[s.status]}`}>
                      {SPRINT_STATUS_LABELS[s.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Участники --- */}
      <section className={styles.section}>
        <h2>Участники ({users.length})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Подразделение</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.position}</td>
                  <td>{u.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Задачи --- */}
      <section className={styles.section}>
        <h2>Все задачи ({tasks.length})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Заголовок</th>
                <th>Исполнитель</th>
                <th>Приоритет</th>
                <th>Время</th>
                <th>Файлы</th>
                <th>Статус</th>
                <th>Создана</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.empty}>
                    Задач пока нет. Создайте первую!
                  </td>
                </tr>
              )}
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td className={styles.mono}>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{userById[t.assigneeId]?.fullName || '—'}</td>
                  <td>{PRIORITY_LABELS[t.priority]}</td>
                  <td>{formatDuration(t.durationHours)}</td>
                  <td>
                    {t.attachments?.length
                      ? `📎 ${t.attachments.length}`
                      : '—'}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Модалки --- */}
      <CreateTaskForm open={taskOpen} onClose={() => setTaskOpen(false)} />
      <CreateSprintForm open={sprintOpen} onClose={() => setSprintOpen(false)} />
      <AddMemberForm open={memberOpen} onClose={() => setMemberOpen(false)} />
    </div>
  );
}