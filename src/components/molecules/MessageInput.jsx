import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Popover, Menu, Transition } from "@headlessui/react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  PaperAirplaneIcon,
  EmojiHappyIcon,
  PhotographIcon,
  PaperClipIcon,
} from "@heroicons/react/solid";
import { Picker } from "emoji-mart";
import TextField from "../atoms/TextField";
import FileButton from "../atoms/FileButton";

const schema = yup.object().shape({
  message: yup.string().required("Is required"),
});

/**
 * @typedef {object} MessageInputProperties
 * @property {(content: string, type: string) => void} onSendTextMessage
 * @property {(content: string, type: string) => void} onSendImageMessage
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
  disabled,
}) {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const onSubmitTextMessage = (values, { resetForm }) => {
    onSendTextMessage(values.message, "text/plain");
    resetForm();
  };

  const onSubmitImageMessage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const mimeType = reader.result.split(",")[0].split(":")[1].split(";")[0];
      onSendImageMessage(reader.result, mimeType);
    };

    reader.readAsDataURL(file);
  };

  return (
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
              disabled={disabled}
              className="group h-full p-1 rounded-full text-gray-800 dark:text-white hover:brightness-110 disabled:opacity-50"
            >
              <PaperClipIcon className="h-6 w-6" aria-hidden="true" />
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
  );
}
