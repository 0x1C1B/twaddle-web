import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

/**
 * Default application template that arranges the components in a stacked layout.
 *
 * @return {JSX.Element} The stacked template
 */
export default function StackTemplate({children}) {
  return (
    <div className="h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="grow bg-slate-50">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

StackTemplate.propTypes = {
  children: PropTypes.node,
};
