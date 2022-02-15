import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  subject: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/tokens",
        {
          username,
          password,
        },
        { baseURL: process.env.REACT_APP_TWADDLE_REST_URI }
      );

      return res.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      }

      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      return { ...state, token: null, subject: null };
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      return {
        ...state,
        token: action.payload.token,
        subject: action.payload.subject,
      };
    },
    [login.rejected]: (state) => {
      return {
        ...state,
        token: null,
        subject: null,
      };
    },
  },
});

export default authSlice;
