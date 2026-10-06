import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  items: [
    {
      id: 's1',
      name: 'Sprint 1',
      goal: 'Запустить MVP',
      startDate: dayjs().subtract(3, 'day').toISOString(),
      endDate: dayjs().add(11, 'day').toISOString(),
      status: 'active',
    },
  ],
  activeSprintId: 's1',
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    addSprint: (state, action) => {
      state.items.push(action.payload);
    },
    setActiveSprint: (state, action) => {
      state.activeSprintId = action.payload;
    },
  },
});

export const { addSprint, setActiveSprint } = sprintsSlice.actions;
export default sprintsSlice.reducer;