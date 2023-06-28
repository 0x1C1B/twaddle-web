import React from 'react';
import ExternalLink from '../atoms/ExternalLink';

/**
 * The application's footer component.
 *
 * @return {JSX.Element} The application's footer component
 */
export default function Footer() {
  return (
    <div className="bg-slate-800 text-white">
      <div className="text-center p-2">
        &copy;{' '}
        <ExternalLink href="https://www.github.com/0x1c1b" className="!text-white text-xs">
          0x1C1B
        </ExternalLink>
      </div>
    </div>
  );
}
