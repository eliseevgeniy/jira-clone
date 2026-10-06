import dayjs from 'dayjs';

// Строит массив точек для графика burndown
// Задачи считаются выполненными в дату их "completedAt" (или createdAt, если нет)
export const buildBurndownData = (sprint, tasks) => {
  if (!sprint || !tasks.length) return [];

  const start = dayjs(sprint.startDate).startOf('day');
  const end = dayjs(sprint.endDate).startOf('day');
  const totalDays = Math.max(1, end.diff(start, 'day'));

  const totalTasks = tasks.length;
  const idealStep = totalTasks / totalDays;

  // Считаем, сколько задач реально закрыто к какому дню
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const doneByDay = doneTasks.map((t) =>
    dayjs(t.completedAt || t.createdAt).startOf('day').diff(start, 'day')
  );

  const points = [];
  for (let i = 0; i <= totalDays; i++) {
    const date = start.add(i, 'day');
    const doneSoFar = doneByDay.filter((d) => d <= i).length;
    const remaining = totalTasks - doneSoFar;

    points.push({
      day: i,
      date: date.format('DD.MM'),
      ideal: Math.max(0, Number((totalTasks - idealStep * i).toFixed(2))),
      remaining,
    });
  }
  return points;
};