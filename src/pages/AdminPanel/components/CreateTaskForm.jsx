import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addTask } from '../../../features/tasks/tasksSlice';
import { Input } from '../../../shared/ui/Input/Input';
import { Textarea } from '../../../shared/ui/Textarea/Textarea';
import { Select } from '../../../shared/ui/Select/Select';
import { Button } from '../../../shared/ui/Button/Button';
import { Modal } from '../../../shared/ui/Modal/Modal';
import { FileInput } from '../../../shared/ui/FileInput/FileInput';
import { WatchersSelect } from './WatchersSelect';
import { generateTaskId } from '../../../shared/lib/generateId';
import { formatDuration, sprintHint } from '../../../shared/lib/formatDuration';
import { fitsInSprint } from '../../../shared/lib/dateHelpers';
import styles from './CreateTaskForm.module.scss';

const PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export const CreateTaskForm = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.items);
  const currentUserId = useAppSelector((s) => s.users.currentUserId);
  const sprints = useAppSelector((s) => s.sprints.items);
  const activeSprintId = useAppSelector((s) => s.sprints.activeSprintId);
  const activeSprint = sprints.find((s) => s.id === activeSprintId);

  const [watchers, setWatchers] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [successId, setSuccessId] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      authorId: currentUserId,
      assigneeId: '',
      durationHours: 1,
      description: '',
      comments: '',
      priority: 'medium',
    },
  });

  const durationValue = watch('durationHours');
  const hint = activeSprint
    ? sprintHint(durationValue, activeSprint.endDate)
    : null;

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.fullName} — ${u.position}`,
  }));

  const handleFilesChange = (nextFiles, oversized = []) => {
    setFiles(nextFiles);
    if (oversized.length) {
      setFileError(
        `Превышен лимит 5 МБ: ${oversized.map((f) => f.name).join(', ')}`
      );
    } else {
      setFileError('');
    }
  };

  const resetForm = () => {
    reset();
    setWatchers([]);
    setFiles([]);
    setFileError('');
  };

  const onSubmit = (data) => {
    const id = generateTaskId();
    const task = {
      id,
      title: data.title.trim(),
      subtitle: data.subtitle.trim(),
      authorId: data.authorId,
      assigneeId: data.assigneeId,
      watcherIds: watchers,
      durationHours: Number(data.durationHours),
      description: data.description.trim(),
      comments: data.comments?.trim() || '',
      priority: data.priority,
      status: 'todo',
      sprintId: activeSprintId,
      attachments: files,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTask(task));
    setSuccessId(id);
    resetForm();
  };

  const handleClose = () => {
    setSuccessId('');
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={successId ? 'Задача создана' : 'Создать задачу'}
      footer={
        successId ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
            <Button onClick={() => setSuccessId('')}>Создать ещё</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" form="create-task-form" disabled={isSubmitting}>
              Создать
            </Button>
          </>
        )
      }
    >
      {successId ? (
        <div className={styles.success}>
          <p>
            Задача <strong>{successId}</strong> успешно создана и добавлена в
            бэклог.
          </p>
          <p className={styles.muted}>
            Она появится на доске в колонке «To Do» активного спринта.
          </p>
        </div>
      ) : (
        <form id="create-task-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Заголовок"
            placeholder="Например: Настроить авторизацию"
            error={errors.title?.message}
            {...register('title', {
              required: 'Обязательное поле',
              maxLength: { value: 200, message: 'Не более 200 символов' },
            })}
          />

          <Input
            label="Подзаголовок"
            placeholder="Краткое уточнение"
            error={errors.subtitle?.message}
            {...register('subtitle', {
              required: 'Обязательное поле',
              maxLength: { value: 200, message: 'Не более 200 символов' },
            })}
          />

          <Select
            label="Автор"
            options={userOptions}
            error={errors.authorId?.message}
            {...register('authorId', { required: 'Выберите автора' })}
          />

          <Select
            label="Исполнитель"
            options={[{ value: '', label: '— выберите —' }, ...userOptions]}
            error={errors.assigneeId?.message}
            {...register('assigneeId', { required: 'Выберите исполнителя' })}
          />

          <Input
            label={`Время выполнения (часы)${
              durationValue ? ` — ${formatDuration(durationValue)}` : ''
            }`}
            type="number"
            min={1}
            step={1}
            error={errors.durationHours?.message}
            {...register('durationHours', {
              required: 'Укажите время',
              valueAsNumber: true,
              min: { value: 1, message: 'Минимум 1 час' },
              validate: (value) => {
                if (!activeSprint) return 'Активный спринт не найден';
                return (
                  fitsInSprint(value, activeSprint.endDate) ||
                  'Задача не влезает в оставшееся время спринта'
                );
              },
            })}
          />

          {hint && (
            <p
              className={`${styles.hint} ${
                hint.left < 0 ? styles.hintError : ''
              }`}
            >
              {hint.text}
            </p>
          )}

          <Select
            label="Приоритет"
            options={PRIORITIES}
            error={errors.priority?.message}
            {...register('priority')}
          />

          <Textarea
            label="Описание (минимум 40 символов)"
            placeholder="Опишите задачу подробнее..."
            error={errors.description?.message}
            {...register('description', {
              required: 'Обязательное поле',
              minLength: { value: 40, message: 'Минимум 40 символов' },
            })}
          />

          <Textarea
            label="Комментарии (необязательно, если есть — минимум 40 символов)"
            placeholder="Дополнительные заметки..."
            error={errors.comments?.message}
            {...register('comments', {
              validate: (value) => {
                if (!value || value.trim() === '') return true;
                return value.trim().length >= 40 || 'Минимум 40 символов';
              },
            })}
          />

          <WatchersSelect
            users={users}
            value={watchers}
            onChange={setWatchers}
            excludeId={watch('assigneeId')}
          />

          <FileInput
            label="Вложения (необязательно)"
            files={files}
            onChange={handleFilesChange}
            error={fileError}
            maxSizeMB={5}
          />
        </form>
      )}
    </Modal>
  );
};