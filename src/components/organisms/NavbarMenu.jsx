import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Popover} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faArrowRightFromBracket,
  faTriangleExclamation,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {usePopper} from 'react-popper';
import Avatar from '../atoms/Avatar';
import Link from '../atoms/Link';

/**
 * Navbar menu component.
 *
 * @return {JSX.Element} The navbar menu component
 */
export default function NavbarMenu() {
  const principal = useSelector((state) => state.auth.principal);

  const [popupButtonElement, setPopupButtonElement] = useState();
  const [popupDialogElement, setPopupDialogElement] = useState();
  const {styles, attributes} = usePopper(popupButtonElement, popupDialogElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start', 'top-end', 'top-start', 'left', 'right'],
        },
      },
    ],
  });

  return (
    <Popover className="relative">
      {() => (
        <>
          <Popover.Button
            ref={setPopupButtonElement}
            className="p-1 rounded-full text-gray-200 hover:text-white focus:outline-none"
          >
            {principal ? (
              <div className="bg-gray-200 text-gray-800 p-2 rounded-full">
                <div className="h-5 md:h-6 aspect-square rounded-md">
                  <Avatar value={principal.displayName} />
                </div>
              </div>
            ) : (
              <FontAwesomeIcon icon={faEllipsisVertical} className="block h-6 w-6" aria-hidden="true" />
            )}
          </Popover.Button>
          <Popover.Panel
            ref={setPopupDialogElement}
            className="shadow-md border rounded-md z-50 w-screen max-w-xs sm:max-w-sm bg-white text-gray-800"
            style={styles.popper}
            {...attributes.popper}
          >
            {principal ? (
              <div className="rounded-md bg-slate-50">
                <div className="p-4 rounded-t-md bg-white flex space-x-4 items-center justify-between">
                  <div className="flex space-x-4 items-center overflow-hidden">
                    <div className="bg-gray-200 text-gray-800 p-2 rounded-full">
                      <div className="h-10 aspect-square rounded-md">
                        <Avatar value={principal.displayName} />
                      </div>
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="truncate">{principal.displayName}</div>
                    </div>
                  </div>
                  <div>
                    <Link to="/logout" className="p-1 rounded-full !text-gray-800">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="block h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                {principal.verified === false && (
                  <div className="py-2 px-4 bg-amber-500 text-white flex space-x-2 items-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4 mr-2" aria-hidden="true" />
                    <p className="text-sm">
                      Your account is not verified. Verify it by clicking{' '}
                      <Link className="!text-white font-semibold" to="/settings">
                        here
                      </Link>
                      .
                    </p>
                  </div>
                )}
                <div className="p-4 rounded-b-md flex space-x-4 items-center justify-between">
                  <Link
                    to="/settings"
                    className={
                      'flex justify-left bg-slate-50 items-center p-2 hover:!no-underline !text-slate-800 ' +
                      'hover:bg-slate-200 hover:!brightness-100 !rounded w-full space-x-2'
                    }
                  >
                    <FontAwesomeIcon icon={faGear} className="block h-4 w-4" aria-hidden="true" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="p-4 bg-gray-100 flex space-x-4 items-center justify-between">
                  <Link to="/login" type="button" className="grow">
                    Login
                  </Link>
                  <Link to="/register" type="button" className="grow">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
