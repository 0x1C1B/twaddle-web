import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { DotsVerticalIcon, UserIcon } from "@heroicons/react/solid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authSlice from "../../store/slices/auth";

import Logo from "../../assets/images/logo.svg";
import LogoTextLight from "../../assets/images/logo-text-light.svg";
import LogoTextDark from "../../assets/images/logo-text-dark.svg";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subject = useSelector((state) => state.auth.subject);

  const onLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="container-xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block lg:hidden h-8 w-auto"
                src={Logo}
                alt="Logo"
              />
              <img
                className="hidden lg:block lg:dark:hidden h-8 w-auto"
                src={LogoTextDark}
                alt="Logo"
              />
              <img
                className="hidden lg:dark:block h-8 w-auto"
                src={LogoTextLight}
                alt="Logo"
              />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Popover className="relative">
              {() => (
                <>
                  <Popover.Button className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
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
                    <Popover.Panel className="absolute shadow-md border dark:border-gray-900 rounded-md z-10 mt-3 w-screen max-w-xs sm:max-w-sm right-0 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 flex space-x-4 items-center">
                        <div className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white p-2 rounded-full">
                          <UserIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                          <div>{subject}</div>
                          <button
                            onClick={onLogout}
                            className="text-xs text-amber-500 hover:text-amber-400 p-0"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
