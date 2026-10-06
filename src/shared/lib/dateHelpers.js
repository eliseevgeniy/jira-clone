import dayjs from 'dayjs';

export const remainingHours = (endDate) =>
  Math.max(0, dayjs(endDate).diff(dayjs(), 'hour'));

export const fitsInSprint = (durationHours, endDate) =>
  durationHours <= remainingHours(endDate);

export const formatDate = (iso) => dayjs(iso).format('DD.MM.YYYY HH:mm');