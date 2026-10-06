import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: 'u1', fullName: 'Иван Иванов', position: 'Frontend', department: 'Разработка' },
    { id: 'u2', fullName: 'Пётр Петров', position: 'Backend', department: 'Разработка' },
    { id: 'u3', fullName: 'Анна Сидорова', position: 'QA', department: 'Тестирование' },
  ],
  currentUserId: 'u1',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.items.push(action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUserId = action.payload;
    },
  },
});

export const { addUser, setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;