import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../molecules/Select";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import authSlice from "../../store/slices/auth";

const roles = ["MEMBER", "MODERATOR", "ADMINISTRATOR"];

const roleSchema = yup.object().shape({
  username: yup.string().required("Is required"),
  role: yup.string().required("Is required"),
});

export default function AccessManagementSettingsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [roleLoading, setRoleLoading] = useState(false);
  const [roleSuccess, setRoleSuccess] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const onChangeRole = (values, { setFieldError, resetForm }) => {
    setRoleLoading(true);
    setRoleSuccess(false);
    setRoleError(null);

    const update = {};

    if (values.role && values.role !== "") {
      update.role = values.role;
    }

    axios
      .patch(`/users/${values.username}`, update, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setRoleSuccess(true))
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
          setRoleError(
            "Changing the role of the last administrator is not allowed!"
          );
        } else if (
          err.response &&
          err.response.data?.code === "InvalidTokenError"
        ) {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setRoleError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setRoleLoading(false));
  };

  return (
    <div className="space-y-4">
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change user role</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>Changes a user's role. This also changes his access rights.</p>
        {roleError && <p className="text-left text-red-500">{roleError}</p>}
        {roleSuccess && (
          <p className="text-left text-green-500">Role changed successfully.</p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ username: "", role: "MEMBER" }}
            onSubmit={onChangeRole}
            validationSchema={roleSchema}
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
                    disabled={roleLoading}
                  />
                </div>
                <div>
                  <Select
                    items={roles}
                    value={props.values.role}
                    onChange={(role) => props.setFieldValue("role", role)}
                  />
                </div>
                <Button
                  type="submit"
                  className="max-w-fit"
                  disabled={!(props.isValid && props.dirty) || roleLoading}
                >
                  {!roleLoading && <span>Change</span>}
                  {roleLoading && (
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
