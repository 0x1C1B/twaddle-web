import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  refreshToken: null,
  accessExpiresAt: null,
  refreshExpiresAt: null,
  principal: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        accessExpiresAt: new Date(new Date().getTime() + action.payload.accessExpiresIn * 1000).getTime(),
        refreshExpiresAt: new Date(new Date().getTime() + action.payload.refreshExpiresIn * 1000).getTime(),
      };
    },
    clearToken: (state) => {
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        accessExpiresAt: null,
        refreshExpiresAt: null,
      };
    },
    setPrincipal: (state, action) => {
      return {
        ...state,
        principal: action.payload,
      };
    },
    clearPrincipal: (state) => {
      return {
        ...state,
        principal: null,
      };
    },
    clearAuthentication: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

export default authSlice;
