import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Popover} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import {usePopper} from 'react-popper';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

/**
 * Emoji picker component.
 *
 * @return {JSX.Element} The emoji picker component
 */
export default function EmojiPicker({onSelect, disabled}) {
  const [popupButtonElement, setPopupButtonElement] = useState();
  const [popupDialogElement, setPopupDialogElement] = useState();
  const {styles, attributes} = usePopper(popupButtonElement, popupDialogElement, {
    placement: 'top-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end', 'left', 'right'],
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
            disabled={disabled}
            className={
              'py-2 px-3 rounded-md bg-slate-100 hover:brightness-95 focus:outline-none flex ' +
              'items-center justify-center disabled:cursor-not-allowed disabled:hover:brightness-100'
            }
          >
            <FontAwesomeIcon icon={faFaceSmile} className="w-4 h-4 lg:h-5 lg:w-5 text-slate-800" />
          </Popover.Button>
          <Popover.Panel
            ref={setPopupDialogElement}
            className="shadow-md border rounded-lg z-50 w-fit bg-white text-gray-800 mt-1"
            style={styles.popper}
            {...attributes.popper}
          >
            <Picker data={data} onEmojiSelect={onSelect} />
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}

EmojiPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
