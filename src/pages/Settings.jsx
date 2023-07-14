import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Tab} from '@headlessui/react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import Avatar from '../components/atoms/Avatar';
import Link from '../components/atoms/Link';
import StackTemplate from '../components/templates/StackTemplate';
import VerifyCurrentUserForm from '../components/organisms/settings/VerifyCurrentUserForm';
import DeleteCurrentUserForm from '../components/organisms/settings/DeleteCurrentUserForm';

/**
 * The settings page of the application.
 *
 * @return {JSX.Element} Application's settings page component
 */
export default function Settings() {
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  useEffect(() => {
    document.title = 'Twaddle Web | Settings';
  }, []);

  return (
    <StackTemplate>
      <div className="h-full">
        <div className="max-w-[100rem] mx-auto px-4 py-8 space-y-8">
          <div className="text-2xl font-semibold">Settings</div>
          <Tab.Group as="div" className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col space-y-6">
              <div className="w-full flex space-x-4 items-center max-w-full text-gray-800">
                <div className="bg-gray-200 text-gray-800 p-2 rounded-full">
                  <div className="h-10 aspect-square rounded-md">
                    <Avatar value={principal.displayName} />
                  </div>
                </div>
                <div className="space-y-1 max-w-full overflow-hidden">
                  <span className="block truncate">{principal.displayName}</span>
                  <span className="block text-xs truncate">{principal.email}</span>
                </div>
              </div>
              <Tab.List className="rounded-xl w-full text-gray-700 space-y-3">
                <Tab
                  className={({selected}) =>
                    `w-full flex items-center space-x-2 text-sm leading-5 font-medium outline-none pl-1 border-l-4
                      ${selected ? 'border-l-sky-500' : 'border-transparent'}`
                  }
                >
                  {({selected}) => (
                    <div
                      className={`truncate w-full h-full flex items-center rounded-lg p-2 text-gray-800 ${
                        selected ? 'bg-gray-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={faUser} className="block h-4 w-4" aria-hidden="true" />
                      <div className="ml-2 truncate">Account</div>
                    </div>
                  )}
                </Tab>
                <hr />
                <Link to="/logout" type="button">
                  <div>Logout</div>
                </Link>
              </Tab.List>
            </div>
            <Tab.Panels as="div" className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5">
              <Tab.Panel>
                <div className="space-y-8">
                  {principal && !principal.verified && <VerifyCurrentUserForm />}
                  <DeleteCurrentUserForm onChange={() => navigate('/logout')} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </StackTemplate>
  );
}
