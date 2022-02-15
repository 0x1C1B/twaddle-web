import { useEffect, useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import StackTemplate from "../components/templates/StackTemplate";
import { login } from "../store/slices/auth";

import Logo from "../assets/images/logo.svg";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Twaddle Web | Login";
  }, []);

  const onSubmit = (values) => {
    setLoading(true);

    dispatch(login({ username: values.username, password: values.password }))
      .unwrap()
      .then(() => navigate("/chat"))
      .catch((err) => {
        if (typeof err === "object" && err.code === "InvalidCredentialsError") {
          return setError("Either username or password are wrong!");
        }

        return setError("An unexpected error occurred, please retry!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <StackTemplate>
      <div className="h-full bg-lime-500 flex items-center justify-center p-2">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md rounded-md p-8 space-y-6">
          <div>
            <img
              className="mx-auto h-10 md:h-12 lg:h-14 w-auto"
              src={Logo}
              alt="Logo"
            />
            <h1 className="mt-4 text-center lg:text-3xl text-2xl font-extrabold">
              Sign in to your account
            </h1>
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={onSubmit}
          >
            {(props) => (
              <form
                className="space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <input
                    name="username"
                    type="text"
                    className={`relative bg-white dark:bg-gray-600 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border ${
                      props.errors.username && props.touched.username
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-500"
                    } block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-lime-500`}
                    placeholder="Username"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.username}
                  />
                  {props.errors.username && props.touched.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {props.errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    className={`relative bg-white dark:bg-gray-600 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border ${
                      props.errors.password && props.touched.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-500"
                    } block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-lime-500`}
                    placeholder="Password"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.password}
                  />
                  {props.errors.password && props.touched.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {props.errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!(props.isValid && props.dirty) || loading}
                  className="flex items-center justify-center group relative w-full py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-lime-500 hover:brightness-110 disabled:opacity-50 focus:outline-none focus:outline-lime-500"
                >
                  {!loading && <span>Login</span>}
                  {loading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </button>
              </form>
            )}
          </Formik>
          <div className="text-center">
            <Link
              className="text-sm text-amber-500 hover:text-amber-400"
              to="/register"
            >
              Don't have an account?
            </Link>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
