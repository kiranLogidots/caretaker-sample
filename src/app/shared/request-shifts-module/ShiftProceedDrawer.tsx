import React, { useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import AcceptShift from './AcceptShift';
import { TiArrowLeft } from 'react-icons/ti';

const ShiftProceedDrawer = ({
  setDrawer,
}: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [proceedPage, setProceedPage] = useState(false);
  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      {proceedPage ? (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setProceedPage(false);
              }}
            >
              <TiArrowLeft className="h-auto w-5" />
            </ActionIcon>
            <h6 className=" flex-1 text-center">Send to Agencies</h6>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setDrawer(false)}
            >
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <AcceptShift />
        </>
      ) : (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            <h6 className=" flex-1 text-center">Proceed Agencies</h6>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setDrawer(false)}
            >
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <hr className="my-3 border-t border-gray-300" />
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Organization name</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Position name</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Date</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Date</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Time</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Paid Duration</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Break Time</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Notes</p>
              <p className="text-sm font-medium">Organization sample name</p>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 flex space-x-2">
            <button
              className="rounded-md bg-gray-300 px-6 py-2 text-black"
              onClick={() => setDrawer(false)}
              type="button"
            >
              Exit
            </button>
            <button
              className="rounded-md bg-[#6c5ce7] px-4 py-2 text-white"
              onClick={() => setProceedPage(true)}
              type="button"
            >
              Proceed
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShiftProceedDrawer;
