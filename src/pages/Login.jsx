import { useEffect, useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import StackTemplate from "../components/templates/StackTemplate";
import TextField from "../components/atoms/TextField";
import Button from "../components/atoms/Button";
import authSlice from "../store/slices/auth";
import { fetchUser } from "../api/users";
import { createToken } from "../api/tokens";

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

  const onLogin = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await createToken(values.username, values.password);

      dispatch(
        authSlice.actions.login({
          token: tokenRes.data.token,
          expiration: new Date(
            Date.now() + tokenRes.data.expires * 1000
          ).getTime(),
        })
      );

      const principalRes = await fetchUser(tokenRes.data.subject);

      dispatch(
        authSlice.actions.setPrincipal({ principal: principalRes.data })
      );

      navigate("/");
    } catch (err) {
      if (
        err.response &&
        err.response.data?.code === "InvalidCredentialsError"
      ) {
        setError("Either username or password are wrong!");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StackTemplate>
      <div className="h-full bg-lime-500 flex items-center justify-center p-4">
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
            onSubmit={onLogin}
          >
            {(props) => (
              <form
                className="space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <TextField
                    name="username"
                    type="text"
                    placeholder="Username"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.username}
                    error={props.errors.username}
                    touched={props.errors.username && props.touched.username}
                  />
                </div>
                <div>
                  <TextField
                    name="password"
                    type="password"
                    placeholder="Password"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.password}
                    error={props.errors.password}
                    touched={props.errors.password && props.touched.password}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!(props.isValid && props.dirty) || loading}
                  className="w-full flex justify-center"
                >
                  {!loading && <span>Login</span>}
                  {loading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
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
