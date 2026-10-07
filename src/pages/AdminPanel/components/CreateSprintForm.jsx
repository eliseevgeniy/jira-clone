import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addSprint } from '../../../features/sprints/sprintsSlice';
import { Input } from '../../../shared/ui/Input/Input';
import { Textarea } from '../../../shared/ui/Textarea/Textarea';
import { Select } from '../../../shared/ui/Select/Select';
import { Button } from '../../../shared/ui/Button/Button';
import { Modal } from '../../../shared/ui/Modal/Modal';
import { generateId } from '../../../shared/lib/generateId';
import { formatDate } from '../../../shared/lib/dateHelpers';
import styles from './CreateSprintForm.module.scss';

const DURATIONS = [
  { value: '1', label: '1 неделя' },
  { value: '2', label: '2 недели' },
  { value: '3', label: '3 недели' },
  { value: '4', label: '4 недели' },
];

const countWorkingDays = (start, end) => {
  if (!start || !end) return 0;
  let from = dayjs(start).startOf('day');
  const to = dayjs(end).startOf('day');
  if (to.isBefore(from)) return 0;

  let count = 0;
  while (from.isBefore(to) || from.isSame(to, 'day')) {
    const dow = from.day();
    if (dow !== 0 && dow !== 6) count++;
    from = from.add(1, 'day');
  }
  return count;
};

export const CreateSprintForm = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const sprints = useAppSelector((s) => s.sprints.items);

  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      goal: '',
      durationWeeks: '2',
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().add(14, 'day').format('YYYY-MM-DD'),
    },
  });

  const startDate = watch('startDate');
  const durationWeeks = watch('durationWeeks');

  useEffect(() => {
    if (startDate && durationWeeks) {
      const weeks = Number(durationWeeks);
      const end = dayjs(startDate).add(weeks * 7, 'day').format('YYYY-MM-DD');
      setValue('endDate', end);
    }
  }, [startDate, durationWeeks, setValue]);

  const endDate = watch('endDate');
  const workingDays = countWorkingDays(startDate, endDate);

  const onSubmit = (data) => {
    const sprint = {
      id: generateId(),
      name: data.name.trim(),
      goal: data.goal.trim(),
      startDate: dayjs(data.startDate).toISOString(),
      endDate: dayjs(data.endDate).toISOString(),
      status: 'planned',
    };
    dispatch(addSprint(sprint));
    setSuccess(sprint);
    reset();
  };

  const handleClose = () => {
    setSuccess(null);
    reset();
    onClose();
  };

  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Обязательное поле';
    const exists = sprints.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    return !exists || 'Спринт с таким именем уже существует';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={success ? 'Спринт создан' : 'Создать спринт'}
      footer={
        success ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
            <Button onClick={() => setSuccess(null)}>Создать ещё</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" form="create-sprint-form">
              Создать
            </Button>
          </>
        )
      }
    >
      {success ? (
        <div className={styles.success}>
          <p>
            Спринт <strong>{success.name}</strong> успешно создан.
          </p>
          <p className={styles.muted}>
            Период: {formatDate(success.startDate)} — {formatDate(success.endDate)}
          </p>
        </div>
      ) : (
        <form id="create-sprint-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Имя спринта"
            placeholder="Например: Sprint 2"
            error={errors.name?.message}
            {...register('name', { validate: validateName })}
          />

          <Textarea
            label="Цель спринта"
            placeholder="Что команда должна успеть за этот спринт?"
            error={errors.goal?.message}
            {...register('goal', {
              required: 'Обязательное поле',
              minLength: { value: 10, message: 'Минимум 10 символов' },
            })}
          />

          <div className={styles.row}>
            <Select
              label="Длительность"
              options={DURATIONS}
              error={errors.durationWeeks?.message}
              {...register('durationWeeks', { required: 'Укажите длительность' })}
            />

            <Input
              label="Дата начала"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate', {
                required: 'Укажите дату начала',
              })}
            />
          </div>

          <Input
            label="Дата окончания (рассчитывается автоматически)"
            type="text"
            readOnly
            className={styles.readonly}
            value={endDate ? dayjs(endDate).format('DD.MM.YYYY') : ''}
            error={errors.endDate?.message}
          />

          <p className={styles.hint}>
            📅 Рабочих дней в спринте: <strong>{workingDays}</strong>
          </p>
        </form>
      )}
    </Modal>
  );
};