import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { updateUser, fetchUsers } from "../../api/users";

const usernameSchema = yup.object().shape({
  username: yup.string().required("Is required"),
});

export default function BlockedUsersSettingsTab() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageable, setPageable] = useState(null);
  const [users, setUsers] = useState([]);

  const [blockLoading, setBlockLoading] = useState(false);
  const [blockSuccess, setBlockSuccess] = useState(false);
  const [blockError, setBlockError] = useState(null);

  const [unblockLoading, setUnblockLoading] = useState(false);
  const [unblockSuccess, setUnblockSuccess] = useState(false);
  const [unblockError, setUnblockError] = useState(null);

  const onFetchPage = async (_page) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchUsers(_page, "blocked==true");

      setUsers(res.data.content);
      setPageable(res.data.info);
    } catch (err) {
      if (err.response && err.response.data?.code === "InvalidTokenError") {
        navigate("/login");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onBlockUser = async (values, { setFieldError, resetForm }) => {
    setBlockLoading(true);
    setBlockSuccess(false);
    setBlockError(null);

    try {
      await updateUser(values.username, { blocked: true });

      setBlockSuccess(true);
      onFetchPage(page);
      resetForm();
    } catch (err) {
      if (err.response && err.response.data?.code === "ValidationError") {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.path, detail.message)
        );
      } else if (err.response && err.response.data?.code === "NotFoundError") {
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
        navigate("/login");
      } else {
        setBlockError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setBlockLoading(false);
    }
  };

  const onUnblockUser = async (username) => {
    setUnblockLoading(true);
    setUnblockSuccess(false);
    setUnblockError(null);

    try {
      await updateUser(username, { blocked: false });

      setUnblockSuccess(true);
      onFetchPage(page);
    } catch (err) {
      if (err.response && err.response.data?.code === "InvalidTokenError") {
        navigate("/login");
      } else {
        setUnblockError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setUnblockLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      onFetchPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
            initialValues={{ username: "" }}
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
        <div className="text-gray-800 dark:text-white space-y-4">
          <div>
            <h2 className="text-2xl">Blocked users</h2>
            <hr className="border-gray-300 dark:border-gray-400 mt-2" />
          </div>
          <p>The following list contains all blocked users.</p>
          {loading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
            </div>
          )}
          {!loading && error && (
            <p className="text-center text-red-500">{error}</p>
          )}
          {!loading && !error && users.length <= 0 && (
            <p className="text-center text-gray-800 dark:text-white">
              No blocked users available.
            </p>
          )}
          {!loading && !error && users.length > 0 && (
            <div className="flex flex-col space-y-4">
              {unblockError && (
                <p className="text-left text-red-500">{unblockError}</p>
              )}
              {unblockSuccess && (
                <p className="text-left text-green-500">
                  User blocked successfully.
                </p>
              )}
              <div className="flex flex-col space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center shadow rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-4 max-h-36 grow flex space-x-4"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="h-10 aspect-square">
                        <Avatar value={user.username} />
                      </div>
                      <h2 className="truncate">{user.username}</h2>
                    </div>
                    <Button
                      className="max-w-fit"
                      disabled={blockLoading || unblockLoading}
                      onClick={() => onUnblockUser(user.username)}
                    >
                      <span>Unblock</span>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.page * pageable.perPage + 1}
                  </span>
                  &nbsp;to&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(
                      pageable.page * pageable.perPage + pageable.perPage,
                      pageable.totalElements
                    )}
                  </span>
                  &nbsp;of&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.totalElements}
                  </span>
                  &nbsp;Users
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <Button
                    variant="primary"
                    disabled={pageable.page * pageable.perPage + 1 <= 1}
                    className="border-r-0 rounded-r-none inline-flex"
                    onClick={() => setPage(pageable.page - 1)}
                  >
                    <ArrowLeftIcon
                      className="h-6 w-6 mr-2"
                      aria-hidden="true"
                    />
                    Prev
                  </Button>
                  <Button
                    variant="primary"
                    disabled={
                      Math.min(
                        pageable.page * pageable.perPage + pageable.perPage,
                        pageable.totalElements
                      ) >= pageable.totalElements
                    }
                    className="border-l-0 rounded-l-none inline-flex"
                    onClick={() => setPage(pageable.page + 1)}
                  >
                    Next
                    <ArrowRightIcon
                      className="h-6 w-6 ml-2"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
