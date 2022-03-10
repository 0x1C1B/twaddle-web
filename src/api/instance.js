import axios from "axios";
import store from "../store";
import authSlice from "../store/slices/auth";

const instance = axios.create({
  baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const state = store.getState();

  if (state.auth.token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${state.auth.token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data?.code === "InvalidTokenError") {
      store.dispatch(authSlice.actions.logout());
    }

    return Promise.reject(err);
  }
);

export default instance;
