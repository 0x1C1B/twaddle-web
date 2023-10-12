import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  online: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Marks a user as online.
     *
     * @param {*} state The current state
     * @param {string} action The action object, hence the user id
     * @return {*} The altered state
     */
    markUserOnline(state, action) {
      return {
        ...state,
        online: [...state.online, action.payload],
      };
    },
    /**
     * Marks a user as offline.
     *
     * @param {*} state The current state
     * @param {string} action The action object, hence the user id
     * @return {*} The altered state
     */
    markUserOffline(state, action) {
      return {
        ...state,
        online: state.online.filter((userId) => userId !== action.payload),
      };
    },
  },
});

export default usersSlice;
