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
export default function EmojiPicker({onSelect}) {
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
            className={
              'p-1 rounded-full text-slate-800 hover:brightness-95 focus:outline-none flex ' +
              'items-center justify-center'
            }
          >
            <FontAwesomeIcon icon={faFaceSmile} className="w-5 h-5" />
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
};
