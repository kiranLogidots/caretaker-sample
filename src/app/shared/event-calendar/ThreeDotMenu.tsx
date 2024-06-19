import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useModal } from '../modal-views/use-modal';
import LegendView from './LegendView';

const ThreeDotMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useModal();

  const handleLegendOpen = () => {
    openModal({
      view: <LegendView />,
      customSize: '750px',
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <FaEllipsisV className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-xl">
          <button
            onClick={() => {
              setIsOpen(false);
              handleLegendOpen();
            }}
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
          >
            Legend
          </button>
          {/* <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
          >
            Option 2
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ThreeDotMenu;
