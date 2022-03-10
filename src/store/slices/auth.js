import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  expiration: null,
  principal: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        token: action.payload.token,
        expiration: action.payload.expiration,
      };
    },
    setPrincipal: (state, action) => {
      return {
        ...state,
        principal: action.payload.principal,
      };
    },
    logout: (state) => {
      return { ...state, token: null, principal: null, expiration: null };
    },
  },
});

export default authSlice;
