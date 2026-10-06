import { useRef } from 'react';
import styles from './FileInput.module.scss';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
};

export const FileInput = ({
  label = 'Вложения',
  files = [],
  onChange,
  error,
  maxSizeMB = 5,
}) => {
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    const oversized = picked.filter((f) => f.size > maxSizeMB * 1024 * 1024);
    const allowed = picked.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    onChange([...files, ...allowed], oversized);
    e.target.value = ''; // позволяет выбрать тот же файл повторно
  };

  const removeFile = (idx) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <div
        className={`${styles.dropzone} ${error ? styles.error : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          const oversized = dropped.filter(
            (f) => f.size > maxSizeMB * 1024 * 1024
          );
          const allowed = dropped.filter(
            (f) => f.size <= maxSizeMB * 1024 * 1024
          );
          onChange([...files, ...allowed], oversized);
        }}
      >
        <span className={styles.icon}>📎</span>
        <span className={styles.hint}>
          Перетащите файлы сюда или <u>выберите</u>
        </span>
        <span className={styles.subHint}>Максимум {maxSizeMB} МБ на файл</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleSelect}
        />
      </div>

      {files.length > 0 && (
        <ul className={styles.list}>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className={styles.item}>
              <span className={styles.fileName} title={f.name}>
                {f.name}
              </span>
              <span className={styles.fileSize}>{formatSize(f.size)}</span>
              <button
                type="button"
                className={styles.remove}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                aria-label="Удалить файл"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};