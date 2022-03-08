import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import authSlice from "../../store/slices/auth";

const usernameSchema = yup.object().shape({
  username: yup.string().required("Is required"),
});

export default function BlockedUsersSettingsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [blockLoading, setBlockLoading] = useState(false);
  const [blockSuccess, setBlockSuccess] = useState(false);
  const [blockError, setBlockError] = useState(null);

  const onBlockUser = (values, { setFieldError, resetForm }) => {
    setBlockLoading(true);
    setBlockSuccess(false);
    setBlockError(null);

    axios
      .patch(
        `/users/${values.username}`,
        { blocked: true },
        {
          baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => setBlockSuccess(true))
      .then(() => resetForm())
      .catch((err) => {
        if (err.response && err.response.data?.code === "ValidationError") {
          err.response.data.details?.forEach((detail) =>
            setFieldError(detail.path, detail.message)
          );
        } else if (
          err.response &&
          err.response.data?.code === "NotFoundError"
        ) {
          setFieldError("username", "User doesn't exist");
        } else if (
          err.response &&
          err.response.data?.code === "MustBeAdministrableError"
        ) {
          setBlockError("Blocking the last administrator is not allowed!");
        } else if (
          err.response &&
          err.response.data?.code === "InvalidTokenError"
        ) {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setBlockError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setBlockLoading(false));
  };

  return (
    <div className="space-y-4">
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Block an user</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          Blocks a user. This excludes the user from all chats and use of their
          account. Blocking is <span className="font-bold">only allowed</span>
          &nbsp;for policy violations.
        </p>
        {blockError && <p className="text-left text-red-500">{blockError}</p>}
        {blockSuccess && (
          <p className="text-left text-green-500">User blocked successfully.</p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ email: "" }}
            onSubmit={onBlockUser}
            validationSchema={usernameSchema}
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
                    name="username"
                    placeholder="Username"
                    value={props.values.username}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.username}
                    touched={props.errors.username && props.touched.username}
                    disabled={blockLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="max-w-fit"
                  disabled={!(props.isValid && props.dirty) || blockLoading}
                >
                  {!blockLoading && <span>Block</span>}
                  {blockLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
