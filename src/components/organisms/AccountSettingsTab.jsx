import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import authSlice, { refreshUser } from "../../store/slices/auth";
import AccountDeletionModal from "./AccountDeletionModal";

const emailSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Is required"),
});

const passwordSchema = yup.object().shape({
  password: yup.string().required("Is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Is required"),
});

export default function AccountSettingsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPaswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const onUpdateEmail = (values, { setFieldError, resetForm }) => {
    setEmailLoading(true);
    setEmailSuccess(false);
    setEmailError(null);

    const update = {};

    if (values.email && values.email !== "") {
      update.email = values.email;
    }

    axios
      .patch(`/users/${user.username}`, update, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => dispatch(refreshUser()))
      .then(() => setEmailSuccess(true))
      .then(() => resetForm())
      .catch((err) => {
        if (err.response && err.response.data?.code === "ValidationError") {
          err.response.data.details?.forEach((detail) =>
            setFieldError(detail.path, detail.message)
          );
        } else if (
          err.response &&
          err.response.data?.code === "EmailAlreadyInUseError"
        ) {
          setFieldError("email", "Is already in use");
        } else if (
          err.response &&
          err.response.data?.code === "InvalidTokenError"
        ) {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setEmailError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setEmailLoading(false));
  };

  const onUpdatePassword = (values, { setFieldError, resetForm }) => {
    setPasswordLoading(true);
    setPaswordSuccess(false);
    setPasswordError(null);

    const update = {};

    if (values.password && values.password !== "") {
      update.password = values.password;
    }

    axios
      .patch(`/users/${user.username}`, update, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setPaswordSuccess(true))
      .then(() => resetForm())
      .catch((err) => {
        if (err.response && err.response.data?.code === "ValidationError") {
          err.response.data.details?.forEach((detail) =>
            setFieldError(detail.path, detail.message)
          );
        } else if (
          err.response &&
          err.response.data?.code === "InvalidTokenError"
        ) {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setPasswordError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setPasswordLoading(false));
  };

  return (
    <div className="space-y-4">
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change E-Mail</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          Change the E-Mail address under which you want to be reachable and
          which is used to restore your account. This email address will not be
          visible to other users.
        </p>
        {emailError && <p className="text-left text-red-500">{emailError}</p>}
        {emailSuccess && (
          <p className="text-left text-green-500">
            E-Mail changed successfully.
          </p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ email: "" }}
            onSubmit={onUpdateEmail}
            validationSchema={emailSchema}
          >
            {(props) => (
              <form
                className="flex flex-col w-full space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div className="grow">
                  <TextField
                    type="text"
                    name="email"
                    placeholder={user.email}
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.email}
                    touched={props.errors.email && props.touched.email}
                    disabled={passwordLoading || emailLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="max-w-fit"
                  disabled={
                    !(props.isValid && props.dirty) ||
                    passwordLoading ||
                    emailLoading
                  }
                >
                  {!emailLoading && <span>Change</span>}
                  {emailLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change Password</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          Change your account password. The new password will take effect the
          next time you log in.
        </p>
        {passwordError && (
          <p className="text-left text-red-500">{passwordError}</p>
        )}
        {passwordSuccess && (
          <p className="text-left text-green-500">
            Password changed successfully.
          </p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={onUpdatePassword}
            validationSchema={passwordSchema}
          >
            {(props) => (
              <form
                className="flex flex-col w-full space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <TextField
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={props.values.password}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.password}
                    touched={props.errors.password && props.touched.password}
                    disabled={passwordLoading || emailLoading}
                    className="grow"
                  />
                </div>
                <div>
                  <TextField
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={props.values.confirmPassword}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.confirmPassword}
                    touched={
                      props.errors.confirmPassword &&
                      props.touched.confirmPassword
                    }
                    disabled={passwordLoading || emailLoading}
                    className="grow"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    !(props.isValid && props.dirty) ||
                    passwordLoading ||
                    emailLoading
                  }
                  className="max-w-fit"
                >
                  Change
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl text-red-500">Delete your account</h2>
          <hr className="border-red-500 mt-2" />
        </div>
        <p>
          This will permanently delete your account. Attention all your chats
          will be deleted and the use of your username will be released for
          other users.
        </p>
        <div className="w-full">
          <AccountDeletionModal
            username={user.username}
            onSuccess={() => {
              dispatch(authSlice.actions.logout());
              navigate("/login");
            }}
          >
            <Button
              type="button"
              disabled={passwordLoading || emailLoading}
              className="bg-red-500 focus:outline-red-500"
            >
              Delete your account
            </Button>
          </AccountDeletionModal>
        </div>
      </div>
    </div>
  );
}
