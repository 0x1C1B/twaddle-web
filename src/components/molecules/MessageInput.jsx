import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Popover, Transition } from "@headlessui/react";
// eslint-disable-next-line no-unused-vars
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { PaperAirplaneIcon, EmojiHappyIcon } from "@heroicons/react/solid";
import { Picker } from "emoji-mart";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";

const schema = yup.object().shape({
  message: yup.string().required("Is required"),
});

/**
 * @typedef {object} MessageInputProperties
 * @property {(values: {message:string}, helpers: FormikHelpers<{message:string}>) => void} onSubmit
 * @property {boolean} disabled
 */

/**
 * Constructs a chat message input form.
 *
 * @param {MessageInputProperties} properties The input properties
 * @returns Returns the constructed component
 */
export default function MessageInput({ onSubmit, disabled }) {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      {(props) => (
        <form
          className="flex w-full p-2 space-x-2 bg-gray-200 dark:bg-gray-500"
          onSubmit={props.handleSubmit}
          noValidate
        >
          <Popover className="relative">
            {() => (
              <>
                <Popover.Button
                  disabled={disabled}
                  className="group h-full relative py-2 px-3 border border-transparent text-sm font-medium rounded-md focus:outline-none bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:outline-white dark:focus:outline-gray-700 hover:brightness-110 disabled:opacity-50"
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
                  <Popover.Panel className="absolute shadow-md border dark:border-gray-900 rounded-md z-10 -translate-y-full top-0 left-0 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
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
          <div className="w-full">
            <TextArea
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
          <Button
            type="submit"
            disabled={!(props.isValid && props.dirty) || disabled}
          >
            <PaperAirplaneIcon
              className="h-6 w-6 rotate-90"
              aria-hidden="true"
            />
          </Button>
        </form>
      )}
    </Formik>
  );
}
