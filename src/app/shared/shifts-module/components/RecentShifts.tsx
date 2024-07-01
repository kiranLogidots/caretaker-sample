import React from 'react';
import { IoPersonSharp } from 'react-icons/io5';

const RecentShifts = ({ shiftsDataArray }: { shiftsDataArray: any }) => {
  const formatDateTime = (start: any, end: any) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    const formattedDate = startTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const formattedTime = `${startTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${endTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;

    return `${formattedDate} at ${formattedTime}`;
  };
  return (
    <div className="space-y-5">
      {shiftsDataArray?.map((shifts: any) => (
        <div
          className="flex w-full justify-between rounded-md border p-4 shadow-md"
          key={shifts?.id}
        >
          <div className="flex w-[50%] items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Shift #{shifts?.id}</p>
              <div className="flex items-center justify-center rounded-2xl bg-orange-400 text-xs font-medium text-black">
                {shifts?.shift_status}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full  bg-orange-300 text-white">
              <IoPersonSharp size={30} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">{shifts?.shift_status} shift</p>
              <p className="text-sm font-medium">{shifts?.position?.name}</p>
            </div>
          </div>

          <div className="border-l border-gray-400 pr-6"></div>

          <div className="flex w-[50%] items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {formatDateTime(shifts?.start_time, shifts.end_time)}
              </p>
              <p className="text-sm font-medium">BookJane Training</p>
            </div>
            <button className="rounded-md bg-[#6c5ce7] px-4 py-2 font-medium text-white">
              Send to Agency
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentShifts;
