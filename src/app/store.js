import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasks/tasksSlice';
import sprintsReducer from '../features/sprints/sprintsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    sprints: sprintsReducer,
    users: usersReducer,
  },
});