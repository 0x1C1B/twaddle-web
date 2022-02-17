import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  expiration: null,
  user: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const tokenRes = await axios.post(
        "/tokens",
        {
          username,
          password,
        },
        { baseURL: process.env.REACT_APP_TWADDLE_REST_URI }
      );

      const tokenData = tokenRes.data;

      const userRes = await axios.get(`/users/${tokenData.subject}`, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: {
          Authorization: `${tokenData.type} ${tokenData.token}`,
        },
      });

      const userData = userRes.data;

      return { ...tokenData, user: userData };
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
      const expiration = new Date(Date.now() + action.payload.expires * 1000);

      return {
        ...state,
        token: action.payload.token,
        expiration: expiration.getTime(),
        user: action.payload.user,
      };
    },
    [login.rejected]: (state) => {
      return {
        ...state,
        token: null,
        expiration: null,
        user: null,
      };
    },
  },
});

export default authSlice;
