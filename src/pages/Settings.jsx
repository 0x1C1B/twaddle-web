import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Tab } from "@headlessui/react";
import { CogIcon, BanIcon } from "@heroicons/react/solid";
import AccountSettingsTab from "../components/organisms/AccountSettingsTab";
import BlockedUsersSettingsTab from "../components/organisms/BlockedUsersSettingsTab";
import Avatar from "../components/atoms/Avatar";
import StackTemplate from "../components/templates/StackTemplate";

export default function Settings() {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    document.title = "Twaddle Web | Settings";
  }, []);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="w-full flex space-x-4 items-center max-w-full text-gray-800 dark:text-white">
              <div className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white p-2 rounded-full">
                <div className="h-10 aspect-square rounded-md">
                  <Avatar value={user.username} />
                </div>
              </div>
              <div className="space-y-1 max-w-full overflow-hidden">
                <span className="block text-lg truncate">{user.username}</span>
                <span className="block text-xs">Your personal account</span>
              </div>
            </div>
            <Tab.Group
              as="div"
              className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8"
            >
              <div className="w-full md:w-1/3 lg:1/6 space-y-4">
                <Tab.List className="rounded-xl w-full text-gray-700 dark:text-gray-200">
                  <Tab
                    className={({ selected }) =>
                      `w-full flex items-center space-x-2 p-2 text-sm leading-5 font-medium rounded-lg
                      ${
                        selected
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                          : "hover:bg-gray-100 hover:dark:bg-gray-700"
                      }`
                    }
                  >
                    <CogIcon className="h-6 w-6" aria-hidden="true" />
                    <div>Account</div>
                  </Tab>
                  {(user.role === "ADMINISTRATOR" ||
                    user.role === "MODERATOR") && (
                    <>
                      <hr className="border-gray-300 dark:border-gray-400 mt-2 mb-4" />
                      <h3 className="px-2 text-xs mb-2">Moderation</h3>
                      <Tab
                        className={({ selected }) =>
                          `w-full flex items-center space-x-2 p-2 text-sm leading-5 font-medium rounded-lg
                      ${
                        selected
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                          : "hover:bg-gray-100 hover:dark:bg-gray-700"
                      }`
                        }
                      >
                        <BanIcon className="h-6 w-6" aria-hidden="true" />
                        <div>Manage blocked accounts</div>
                      </Tab>
                    </>
                  )}
                </Tab.List>
              </div>
              <Tab.Panels as="div" className="w-full md:w-2/3 lg:5/6">
                <Tab.Panel>
                  <AccountSettingsTab />
                </Tab.Panel>
                <Tab.Panel>
                  <BlockedUsersSettingsTab />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
