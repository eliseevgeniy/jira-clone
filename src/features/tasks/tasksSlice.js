import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'AB-1234',
      title: 'Настроить авторизацию',
      subtitle: 'JWT + refresh token',
      authorId: 'u1',
      assigneeId: 'u1',
      watcherIds: [],
      durationHours: 6,
      description: 'Необходимо реализовать вход и обновление токена для всех пользователей системы.',
      priority: 'high',
      status: 'in-progress',
      sprintId: 's1',
      createdAt: new Date().toISOString(),
      attachments: [],
    },
    {
      id: 'CD-5678',
      title: 'Свёрстать дашборд',
      subtitle: 'Главная страница',
      authorId: 'u2',
      assigneeId: 'u2',
      watcherIds: [],
      durationHours: 14,
      description: 'Сверстать главную страницу со статистикой по спринтам и выполненным задачам.',
      priority: 'medium',
      status: 'done',
      sprintId: 's1',
      createdAt: new Date().toISOString(),
      attachments: [],
    },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.push(action.payload);
    },
    moveTask: (state, action) => {
      const { id, status } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (task) task.status = status;
    },
    updateTask: (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, moveTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;