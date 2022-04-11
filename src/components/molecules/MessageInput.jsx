import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popover, Menu, Transition, Dialog } from "@headlessui/react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  PaperAirplaneIcon,
  EmojiHappyIcon,
  PhotographIcon,
  VideoCameraIcon,
  PaperClipIcon,
  XIcon,
} from "@heroicons/react/solid";
import { Picker } from "emoji-mart";
import TextField from "../atoms/TextField";
import FileButton from "../atoms/FileButton";
import Button from "../atoms/Button";
import { uploadAttachment } from "../../api/attachments";

const schema = yup.object().shape({
  message: yup.string().required("Is required"),
});

/**
 * @typedef {object} MessageInputProperties
 * @property {(content: string) => void} onSendTextMessage
 * @property {(attachment: string) => void} onSendImageMessage
 * @property {(attachment: string) => void} onSendVideoMessage
 * @property {boolean} disabled
 */

/**
 * Constructs a chat message input form.
 *
 * @param {MessageInputProperties} properties The input properties
 * @returns Returns the constructed component
 */
export default function MessageInput({
  onSendTextMessage,
  onSendImageMessage,
  onSendVideoMessage,
  disabled,
}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const darkMode = useSelector((state) => state.theme.darkMode);

  const onCloseErrorModal = () => setError(false);

  const onSubmitTextMessage = (values, { resetForm }) => {
    onSendTextMessage(values.message);
    resetForm();
  };

  const onSubmitImageMessage = async (event) => {
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("file", event.target.files[0]);

    try {
      const res = await uploadAttachment(data);
      onSendImageMessage(res.data.id);
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

  const onSubmitVideoMessage = async (event) => {
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("file", event.target.files[0]);

    try {
      const res = await uploadAttachment(data);
      onSendVideoMessage(res.data.id);
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

  return (
    <>
      <Transition appear show={!!error} as={Fragment}>
        <Dialog
          as="div"
          onClose={onCloseErrorModal}
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
                    Upload failed
                  </Dialog.Title>
                  <button
                    onClick={onCloseErrorModal}
                    disabled={loading}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="text-red-500">
                  Attachment upload failed. The message will not be sent. Please
                  repeat the process to send the message.
                </div>
                <div className="flex">
                  <Button
                    onClick={onCloseErrorModal}
                    disabled={loading}
                    variant="secondary"
                    className="w-full"
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Formik
        initialValues={{ message: "" }}
        onSubmit={onSubmitTextMessage}
        validationSchema={schema}
      >
        {(props) => (
          <form
            className="flex w-full p-2 space-x-2"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <Popover className="relative">
              {() => (
                <>
                  <Popover.Button
                    disabled={disabled}
                    className="group h-full p-1 rounded-full text-gray-800 dark:text-white hover:brightness-110 disabled:opacity-50"
                  >
                    <EmojiHappyIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute shadow-md border dark:border-gray-900 rounded-md z-10 -translate-y-full -top-1 left-0 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                      <Picker
                        native={true}
                        showPreview={false}
                        showSkinTones={false}
                        title="Twaddle Icons"
                        theme={darkMode ? "dark" : "light"}
                        onSelect={(emoji) => {
                          props.setFieldValue(
                            "message",
                            `${props.values.message}${emoji.native}`
                          );
                        }}
                      />
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                disabled={disabled || loading}
                className="group h-full p-1 rounded-full text-gray-800 dark:text-white hover:brightness-110 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <PaperClipIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute shadow-md border dark:border-gray-900 rounded-md z-10 -translate-y-full -top-1 left-0 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <FileButton
                          onChange={onSubmitImageMessage}
                          accept="image/*"
                          className={`!group focus:outline-transparent flex rounded-md items-center w-full !px-2 !py-2 text-sm ${
                            active
                              ? "!bg-lime-500 !text-white"
                              : "!bg-transparent !text-gray-800 dark:!text-white"
                          }`}
                        >
                          <PhotographIcon
                            className="h-6 w-6 mr-2"
                            aria-hidden="true"
                          />
                          Image
                        </FileButton>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <FileButton
                          onChange={onSubmitVideoMessage}
                          accept="video/*"
                          className={`!group focus:outline-transparent flex rounded-md items-center w-full !px-2 !py-2 text-sm ${
                            active
                              ? "!bg-lime-500 !text-white"
                              : "!bg-transparent !text-gray-800 dark:!text-white"
                          }`}
                        >
                          <VideoCameraIcon
                            className="h-6 w-6 mr-2"
                            aria-hidden="true"
                          />
                          Video
                        </FileButton>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="w-full">
              <TextField
                autoFocus
                rows="1"
                name="message"
                placeholder="Message"
                value={props.values.message}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                disabled={disabled}
                className="resize-none"
              />
            </div>
            <button
              type="submit"
              className="p-1 rounded-full text-lime-500 hover:brightness-110 disabled:opacity-50"
              disabled={!(props.isValid && props.dirty) || disabled}
            >
              <PaperAirplaneIcon
                className="h-6 w-6 rotate-90"
                aria-hidden="true"
              />
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}
