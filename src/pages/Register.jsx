import { useEffect, useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import StackTemplate from "../components/templates/StackTemplate";
import TextField from "../components/atoms/TextField";
import Button from "../components/atoms/Button";

import Logo from "../assets/images/logo.svg";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  email: yup.string().email("Must be a valid email").required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Twaddle Web | Register";
  }, []);

  const onSubmit = (values, { setFieldError }) => {
    setLoading(true);
    setError(null);

    axios
      .post(
        "/users",
        {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        { baseURL: process.env.REACT_APP_TWADDLE_REST_URI }
      )
      .then(() => navigate("/login"))
      .catch((err) => {
        if (err.response && err.response.data?.code === "ValidationError") {
          err.response.data.details?.forEach((detail) =>
            setFieldError(detail.path, detail.message)
          );
        } else if (
          err.response &&
          err.response.data?.code === "UsernameAlreadyInUseError"
        ) {
          setFieldError("username", "Is already in use");
        } else if (
          err.response &&
          err.response.data?.code === "EmailAlreadyInUseError"
        ) {
          setFieldError("email", "Is already in use");
        } else {
          setError("An unexpected error occurred, please retry!");
        }
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
              Create your new account
            </h1>
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
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
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                    error={props.errors.email}
                    touched={props.errors.email && props.touched.email}
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
                  {!loading && <span>Register</span>}
                  {loading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
                <p className="text-center text-xs">
                  By clicking "Register" you agree to our&nbsp;
                  <Link className="text-amber-500 hover:text-amber-400" to="#">
                    Terms of Use
                  </Link>
                  &nbsp;and our&nbsp;
                  <Link className="text-amber-500 hover:text-amber-400" to="#">
                    Data Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </Formik>
          <div className="text-center">
            <Link
              className="text-sm text-amber-500 hover:text-amber-400"
              to="/login"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
