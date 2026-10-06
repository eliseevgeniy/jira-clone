import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../app/hooks';
import { addUser } from '../../../features/users/usersSlice';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { Modal } from '../../../shared/ui/Modal/Modal';
import { generateId } from '../../../shared/lib/generateId';
import styles from './AddMemberForm.module.scss';

const DEPARTMENTS = ['Разработка', 'Тестирование', 'Дизайн', 'Продукт', 'Аналитика'];

export const AddMemberForm = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: '', position: '', department: '' },
  });

  // ФИО: ровно 2–3 слова, каждое с большой буквы
  const validateFullName = (value) => {
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return 'Введите минимум имя и фамилию';
    if (parts.length > 3) return 'Не более трёх слов (ФИО)';
    const re = /^[А-ЯЁA-Z][а-яёa-z-]+$/;
    const bad = parts.find((p) => !re.test(p));
    return !bad || 'Каждое слово — с большой буквы, только буквы';
  };

  const onSubmit = (data) => {
    const user = {
      id: generateId(),
      fullName: data.fullName.trim().replace(/\s+/g, ' '),
      position: data.position.trim(),
      department: data.department,
    };
    dispatch(addUser(user));
    setSuccess(user);
    reset();
  };

  const handleClose = () => {
    setSuccess(null);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={success ? 'Участник добавлен' : 'Добавить участника'}
      footer={
        success ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
            <Button onClick={() => setSuccess(null)}>Добавить ещё</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" form="add-member-form">
              Добавить
            </Button>
          </>
        )
      }
    >
      {success ? (
        <div className={styles.success}>
          <p>
            <strong>{success.fullName}</strong> добавлен(а) в команду.
          </p>
          <p className={styles.muted}>
            {success.position} · {success.department}
          </p>
        </div>
      ) : (
        <form id="add-member-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="ФИО"
            placeholder="Иванов Иван Иванович"
            error={errors.fullName?.message}
            {...register('fullName', { validate: validateFullName })}
          />

          <Input
            label="Должность"
            placeholder="Frontend-разработчик"
            error={errors.position?.message}
            {...register('position', {
              required: 'Обязательное поле',
              minLength: { value: 2, message: 'Минимум 2 символа' },
            })}
          />

          <div className={styles.field}>
            <label className={styles.label}>Подразделение</label>
            <select
              className={styles.select}
              {...register('department', { required: 'Выберите подразделение' })}
            >
              <option value="">— выберите —</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <span className={styles.errorText}>{errors.department.message}</span>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};