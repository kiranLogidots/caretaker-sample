import React from 'react';
import { useModal } from '../modal-views/use-modal';
import { ActionIcon, Button, Title } from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import { GoDotFill } from 'react-icons/go';

const LegendView = () => {
  const { closeModal } = useModal();
  return (
    <div className="m-auto flex flex-col gap-2 p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex-grow text-center">
          <Title as="h3" className="text-lg">
            Legend
          </Title>
        </div>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>
      <div className="ml-4 flex flex-col gap-2">
        <p className="text-xs font-medium text-black">Draft Shifts</p>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <div className="relative rounded-sm border border-orange-400 p-1 pr-10">
              <p className="text-xs">9:00a - 5:00p</p>
              <p className="text-xs">Open</p>
              <div className="absolute bottom-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-orange-400 text-xs text-white">
                1
              </div>
            </div>
            <p className="mt-1 text-xs font-medium">Open Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-green-400 p-1 pr-10">
              <p className="text-xs">9:00a - 5:00p</p>
              <p className="text-xs">Assigned</p>
            </div>
            <p className="mt-1 text-xs font-medium">Assigned Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-gray-300 p-1 pr-10">
              <p className="text-xs">9:00a - 5:00p</p>
              <p className="text-xs">Position</p>
            </div>
            <span className="mt-1 text-xs font-medium">Assigned Shift for</span>
            <span className="text-xs font-medium">another position</span>
          </div>
        </div>
      </div>

      <hr className="my-3 border-t border-gray-300" />

      <div className="ml-4 flex flex-col gap-2">
        <p className="text-xs font-medium text-black">Published Shifts</p>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <div className="relative rounded-sm border border-orange-300 bg-orange-300 p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Open</p>
              <GoDotFill className="absolute right-0 top-1" />
            </div>
            <p className="mt-1 text-xs font-medium">Open Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-[#63d4b4] bg-[#63d4b4] p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Assigned</p>
            </div>
            <p className="mt-1 text-xs font-medium">Assigned Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="relative rounded-sm border border-[#63d4b4] bg-[#63d4b4] p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Accepted</p>
              <GoDotFill className="absolute right-0 top-1" />
            </div>
            <span className="mt-1 text-xs font-medium">Accepted</span>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-[#c8b3f2] bg-[#c8b3f2] p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Position</p>
            </div>
            <span className="mt-1 text-xs font-medium">Assigned Shift for</span>
            <span className="text-xs font-medium">another position</span>
          </div>
        </div>
      </div>

      <hr className="my-3 border-t border-gray-300" />

      <div className="ml-4 flex flex-col gap-2">
        <p className="text-xs font-medium text-black">Past Shifts</p>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <div className="rounded-sm border border-sky-300 bg-sky-300 p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">In Progress</p>
            </div>
            <p className="mt-1 text-xs font-medium">In Progress Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-[#676867] bg-[#676867] p-1 pr-10">
              <p className="text-xs text-white">7:00a - 3:00p</p>
              <p className="text-xs text-white">Completed</p>
            </div>
            <p className="mt-1 text-xs font-medium">Completed Shift</p>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-[#e2e5e4] bg-[#e2e5e4] p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Cancelled</p>
            </div>
            <span className="mt-1 text-xs font-medium">Cancelled Shift</span>
          </div>
          <div className="flex flex-col">
            <div className="rounded-sm border border-[#a3323b] p-1 pr-10">
              <p className="text-xs">7:00a - 3:00p</p>
              <p className="text-xs">Unfulfilled</p>
            </div>
            <span className="mt-1 text-xs font-medium">Unfulfilled Shift</span>
          </div>
        </div>
      </div>

      <hr className="my-3 border-t border-gray-300" />

      <div className="ml-4 flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-black">Time off</p>
          <div className="rounded-sm border border-[#eaedf0] bg-diagonal-lines p-1 pr-10">
            <p className="text-xs font-medium">7:00a - 3:00p</p>
            <p className="text-xs font-medium">Time off</p>
          </div>
          <p className="text-sm font-medium">Time Off</p>
        </div>

        <div className="pr-6 text-xs">
          <p className="text-xs font-medium text-black">Note:</p>
          <p className="mt-2 font-medium">
            Shifts marked with &quot;
            <GoDotFill className="inline-block" />
            &quot; indicate shifts that are unassigned or were
          </p>
          <p className="font-medium">
            previously unassigned and have been accepted, in progress or
          </p>
          <p className="font-medium">completed.</p>
        </div>
      </div>

      <div className="mt-3 flex w-full items-center justify-center">
        <button
          onClick={() => closeModal()}
          className="rounded-md bg-green-500 px-24 py-2 text-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default LegendView;
