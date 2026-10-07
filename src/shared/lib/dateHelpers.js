import dayjs from 'dayjs';

// Считает РАБОЧИЕ часы между сейчас и endDate.
// Рабочий день = 8 часов (с 10:00 до 19:00 с перерывом, для простоты берём 8 часов).
// Суббота и воскресенье не считаются.
export const workingHoursLeft = (endDate) => {
  const now = dayjs();
  const end = dayjs(endDate);

  if (end.isBefore(now)) return 0;

  let total = 0;
  let cursor = now.clone();

  while (cursor.isBefore(end, 'day') || cursor.isSame(end, 'day')) {
    const dow = cursor.day(); // 0 = воскресенье, 6 = суббота
    if (dow !== 0 && dow !== 6) {
      // Сколько рабочих часов приходится на этот день
      const dayStart = cursor.hour(10).minute(0).second(0); // начало рабочего дня
      const dayEnd = cursor.hour(18).minute(0).second(0);   // конец (8 часов)

      // Если сейчас первый день — берём с текущего момента
      const from = cursor.isSame(now, 'day') && now.isAfter(dayStart)
        ? now
        : dayStart;

      const to = cursor.isSame(end, 'day') && end.isBefore(dayEnd)
        ? end
        : dayEnd;

      const hours = to.diff(from, 'hour', true);
      if (hours > 0) total += hours;
    }
    cursor = cursor.add(1, 'day').startOf('day');
  }

  return Math.round(total);
};

// Для обратной совместимости оставляем старую функцию
export const remainingHours = (endDate) =>
  Math.max(0, dayjs(endDate).diff(dayjs(), 'hour'));

export const fitsInSprint = (durationHours, endDate) =>
  durationHours <= workingHoursLeft(endDate);

export const formatDate = (iso) => dayjs(iso).format('DD.MM.YYYY HH:mm');