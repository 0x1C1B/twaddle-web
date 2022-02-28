import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, XIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import axios from "axios";
import { Formik } from "formik";
import TextField from "../atoms/TextField";
import TextArea from "../atoms/TextArea";
import Button from "../atoms/Button";
import authSlice from "../../store/slices/auth";

const schema = yup.object().shape({
  name: yup.string().required("Is required"),
  description: yup.string().required("Is required"),
});

/**
 * @typedef {object} RoomCreationModalProperties
 * @property {() => void} onSuccess
 */

/**
 * Constructs a room creation modal component.
 *
 * @param {RoomCreationModalProperties} properties The modal properties
 * @returns {JSX.Element} Returns the modal component
 */
export default function RoomCreationModal({ onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const closeModal = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  const onSubmit = (values, { setFieldError }) => {
    setLoading(true);
    setError(null);

    axios
      .post(
        "/rooms",
        {
          name: values.name,
          description: values.description,
        },
        {
          baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setOpen(false);
        onSuccess();
      })
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
          setError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        variant="secondary"
        className="inline-flex items-center justify-center"
      >
        <PlusIcon className="h-6 w-6" aria-hidden="true" />
        <div className="ml-2">Add room</div>
      </Button>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Add chat room
                  </Dialog.Title>
                  <button
                    onClick={() => closeModal()}
                    disabled={loading}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {error && <p className="text-center text-red-500">{error}</p>}
                <Formik
                  initialValues={{ name: "", description: "" }}
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
                          name="name"
                          type="text"
                          placeholder="Name"
                          disabled={loading}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.name}
                          error={props.errors.name}
                          touched={props.errors.name && props.touched.name}
                        />
                      </div>
                      <div>
                        <TextArea
                          name="description"
                          type="text"
                          rows="3"
                          placeholder="Description"
                          disabled={loading}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.description}
                          error={props.errors.description}
                          touched={
                            props.errors.description &&
                            props.touched.description
                          }
                          className="resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={!(props.isValid && props.dirty) || loading}
                        className="w-full flex justify-center"
                      >
                        {!loading && <span>Create</span>}
                        {loading && (
                          <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                        )}
                      </Button>
                    </form>
                  )}
                </Formik>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
