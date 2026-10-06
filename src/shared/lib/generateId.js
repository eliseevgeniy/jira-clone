export const generateTaskId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
};

export const generateId = () => Math.random().toString(36).slice(2, 10);