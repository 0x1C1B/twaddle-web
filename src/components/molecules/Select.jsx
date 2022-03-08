import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

/**
 * @typedef {object} SelectProperties
 * @property {[string]} items
 * @property {any} onChange
 * @property {string} value
 * @property {boolean} touched
 * @property {string} error
 */

/**
 * Constructs a select component.
 *
 * @param {SelectProperties} properties The select properties
 * @returns Returns the select component
 */
export default function Select({ items, onChange, value, error, touched }) {
  return (
    <>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-lime-500 disabled:opacity-50 border-gray-300 dark:border-gray-500">
            <span className="block truncate text-left">{value}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white text-gray-800 dark:bg-gray-600 dark:text-white border dark:border-gray-900 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item) => (
                <Listbox.Option
                  key={item}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lime-500">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}
