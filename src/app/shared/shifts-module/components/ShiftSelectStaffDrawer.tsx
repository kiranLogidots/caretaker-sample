import React, { useState } from 'react';
import { shiftArrayType } from './SendAgencyDrawer';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { TiArrowLeft } from 'react-icons/ti';
import AcceptStaff from './AcceptStaff';

const ShiftSelectStaffDrawer = ({
  setDrawer,
  selectedAgency,
  fetchShifts,
}: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAgency: shiftArrayType;
  fetchShifts: any;
}) => {
  const [selectStaff, setSelectStaff] = useState(false);
  const [selectedStaffData, setSelectedStaffData] = useState();

  const handleSubmit = () => {
    console.log(selectedStaffData, 'selectedStaffData');
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      {!selectStaff ? (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            <h6 className=" flex-1 text-center">Select Staff</h6>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setDrawer(false)}
            >
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <AcceptStaff
            setSelectedStaffData={setSelectedStaffData}
            selectedStaffData={selectedStaffData}
            setSelectStaff={setSelectStaff}
            setDrawer={setDrawer}
          />
        </>
      ) : (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setSelectStaff(false);
              }}
            >
              <TiArrowLeft className="h-auto w-5" />
            </ActionIcon>
            <h6 className=" flex-1 text-center">Selected Staff Info</h6>
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
          </div>
          <div className="absolute bottom-5 right-5 flex space-x-2">
            <button
              className="rounded-md bg-gray-300 px-6 py-2 text-black"
              onClick={() => setSelectStaff(false)}
              type="button"
            >
              Back
            </button>
            <button
              className="rounded-md bg-[#6c5ce7] px-4 py-2 text-white"
              onClick={() => handleSubmit()}
              type="button"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShiftSelectStaffDrawer;
