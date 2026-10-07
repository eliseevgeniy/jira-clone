import { workingHoursLeft } from './dateHelpers';

export const formatDuration = (hours) => {
  const h = Number(hours);
  if (!h || h < 0) return '';
  const days = Math.floor(h / 8);
  const rest = h % 8;
  if (days === 0) return `${rest}ч`;
  if (rest === 0) return `${days}д`;
  return `${days}д ${rest}ч`;
};

export const sprintHint = (durationHours, endDate) => {
  const total = Math.max(0, workingHoursLeft(endDate));
  const left = total - Number(durationHours || 0);
  return {
    total,
    left,
    text:
      left >= 0
        ? `До конца спринта останется ${formatDuration(left)}`
        : `Не хватает ${formatDuration(Math.abs(left))} до конца спринта`,
  };
};