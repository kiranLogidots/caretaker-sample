'use client';

import React from 'react';
import CreateShiftCard from './CreateShiftCard';
import { FaCirclePlus } from 'react-icons/fa6';

const CreateShifts = () => {
  return (
    <div className="mt-2 h-full w-full space-y-5">
      <div className="">Select Date</div>
      <CreateShiftCard />
      {/* <button className="flex items-center gap-2 pt-4">
        <FaCirclePlus />
        Add another shift
      </button> */}
      {/* <div className=" flex w-full justify-end">
        <button className="rounded-md bg-green-700 px-4 py-2 text-white">
          Confirm booking
        </button>
      </div> */}
    </div>
  );
};

export default CreateShifts;
