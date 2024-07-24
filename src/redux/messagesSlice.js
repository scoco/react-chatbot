// src/redux/messagesSlice.js
import { createSlice } from '@reduxjs/toolkit';

// https://redux-toolkit.js.org/api/createSlice
const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    setMessages: (state, action) => action.payload
  }
});

export const { addMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
