import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {Disclosure} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faX} from '@fortawesome/free-solid-svg-icons';
import NavbarMenu from './NavbarMenu';

import Logo from '../../assets/images/logo.png';
import LogoTextLight from '../../assets/images/logo-text-light.png';

/**
 * Utility function to join class names.
 *
 * @param  {...string} classes The classes to join
 * @return {string} The joined classes
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * The application's navbar component.
 *
 * @return {JSX.Element} The application's navbar component
 */
export default function Navbar() {
  const location = useLocation();

  const navigation = [{name: 'Home', path: '/home'}];

  return (
    <Disclosure as="nav" className="bg-slate-800">
      {({open}) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className={
                    'inline-flex items-center justify-center rounded-md p-2 text-slate-200 ' +
                    'hover:text-white focus:outline-none'
                  }
                >
                  <span className="sr-only">Open Menu</span>
                  {open ? (
                    <FontAwesomeIcon icon={faX} className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FontAwesomeIcon icon={faBars} className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <NavLink to="/home">
                    <img className="block h-6 w-auto lg:hidden" src={Logo} alt="Attoly Logo" />
                    <img className="hidden lg:block h-6 w-auto" src={LogoTextLight} alt="Attoly Logo" />
                  </NavLink>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({isActive}) =>
                          classNames(
                            isActive ? 'text-white bg-slate-700' : 'text-gray-200 hover:text-white hover:bg-slate-700',
                            'px-3 py-2 font-bold rounded-md',
                          )
                        }
                        aria-current={location.pathname === item.path ? 'page' : undefined}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className={
                  'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 ' +
                  'sm:pr-0 space-x-2'
                }
              >
                <NavbarMenu />
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.path}
                  className={({isActive}) =>
                    classNames(
                      isActive ? 'text-white bg-slate-700' : 'text-gray-200 hover:text-white hover:bg-slate-700',
                      'block px-3 py-2 font-bold rounded-md',
                    )
                  }
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
