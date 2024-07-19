import React, { useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import AcceptShift from './AcceptShift';
import { TiArrowLeft } from 'react-icons/ti';
import { formatDuration, intervalToDuration, parseISO, format } from 'date-fns';

const ShiftProceedDrawer = ({
  setDrawer,
  selectedShifts,
  fetchShifts,
}: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  selectedShifts: any;
  fetchShifts: any;
}) => {
  const [proceedPage, setProceedPage] = useState(
    selectedShifts?.organizations[0]?.user_count > 0 ? true : false
  );

  const durationCalculator = (
    startTime: string,
    endTime: string,
    unpaidBreak: number
  ) => {
    const start: any = parseISO(startTime);
    const end: any = parseISO(endTime);

    // Calculate the duration in minutes
    const durationInMinutes = (end - start) / (1000 * 60) - unpaidBreak;

    // Convert the duration to hours and minutes
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours} hrs ${minutes} min`;
  };

  const timeFormat = (date: string) => {
    const start = new Date(date);
    const formattedStartTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return formattedStartTime;
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      {proceedPage ? (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            {!(selectedShifts?.organizations[0]?.user_count > 0) && (
              <ActionIcon
                size="sm"
                variant="text"
                onClick={() => {
                  setProceedPage(false);
                }}
              >
                <TiArrowLeft className="h-auto w-5" />
              </ActionIcon>
            )}
            <h6 className=" flex-1 text-center">Assign staff to shift</h6>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setDrawer(false)}
            >
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <AcceptShift
            selectedShifts={selectedShifts}
            setDrawer={setDrawer}
            fetchShifts={fetchShifts}
          />
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
              <p className="text-sm font-medium">
                {selectedShifts?.organizationBranch?.organization?.company_name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Position name</p>
              <p className="text-sm font-medium">
                {selectedShifts?.position?.name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Date</p>
              <p className="text-sm font-medium">
                {selectedShifts?.assigned_date}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Start Time</p>
              <p className="text-sm font-medium">
                {timeFormat(selectedShifts?.start_time)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">End Time</p>
              <p className="text-sm font-medium">
                {timeFormat(selectedShifts?.end_time)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Paid Duration</p>
              <p className="text-sm font-medium">
                {durationCalculator(
                  selectedShifts?.start_time,
                  selectedShifts?.end_time,
                  selectedShifts?.unpaid_break
                )}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Break Time</p>
              <p className="text-sm font-medium">
                {selectedShifts?.unpaid_break}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Notes</p>
              <p className="text-sm font-medium">
                {selectedShifts?.shift_notes}
              </p>
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
