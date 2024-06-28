'use client';

import {
  createOpenShift,
  getSchedulingSettings,
  listOrgPositions,
} from '@/service/page';
import React, { useEffect, useState } from 'react';
import { Select } from 'rizzui';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import { SiGoogledocs } from 'react-icons/si';
import { Switch } from '@headlessui/react';
import dynamic from 'next/dynamic';
import NotesDrawer from './NotesDrawer';
import moment from 'moment';
import toast from 'react-hot-toast';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const unpaidBreakOptions = [
  {
    label: 'No Unpaid Break',
    value: 0,
  },
  { label: '10 mins', value: 10 },
  { label: '20 mins', value: 20 },
  { label: '30 mins', value: 30 },
  { label: '40 mins', value: 40 },
  { label: '50 mins', value: 50 },
  { label: '60 mins', value: 60 },
];

const shiftQuantity = [
  { label: 'x1', value: 1 },
  { label: 'x2', value: 2 },
  { label: 'x3', value: 3 },
  { label: 'x4', value: 4 },
  { label: 'x5', value: 5 },
  { label: 'x6', value: 6 },
  { label: 'x7', value: 7 },
  { label: 'x8', value: 8 },
  { label: 'x9', value: 9 },
  { label: 'x10', value: 10 },
];

const CreateShiftCard = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [positions, setPositions]: any = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState({});

  const [scheduleSettings, setScheduleSettings] = useState({});

  const setDefaultStartTime = () => {
    const defaultStartTime = new Date();
    defaultStartTime.setHours(8, 0, 0, 0);
    return defaultStartTime;
  };
  const setDefaultEndTime = () => {
    const defaultEndTime = new Date();
    defaultEndTime.setHours(17, 0, 0, 0);
    return defaultEndTime;
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(
    setDefaultStartTime()
  );
  const [selectedEndTime, setSelectedEndTime] = useState(setDefaultEndTime());
  const [selectedUnpaidBreak, setSelectedUnpaidBreak] = useState(0);
  const [selectedShiftQuantity, setSelectedShiftQuantity] = useState(1);
  // const [enabled, setEnabled] = useState(false);

  const [notesDrawer, setNotesDrawer] = useState(false);
  const [shiftNote, setShiftNote] = useState('');

  const handleConfirm = async () => {
    const requestDate = {
      shifts: [
        {
          schedule_settings: scheduleSettings,
          organization_branch_id: branchId,
          //@ts-ignore
          position_id: selectedPositionArr?.value,
          start_time: selectedStartTime,
          end_time: selectedEndTime,
          unpaid_break: selectedUnpaidBreak,
          shift_notes: shiftNote,
          is_over_time_allowed: false,
          assigned_date: moment(selectedDate).format('YYYY-MM-DD'),
          quantity: selectedShiftQuantity,
        },
      ],
    };

    console.log(requestDate);
    try {
      await createOpenShift(requestDate);
      toast.success('Open shift added');
    } catch (error: any) {
      console.error('Failed to create open shift', error);
      toast.error(error.response.data.message);
    }
  };

  const fetchPositions = async () => {
    setPositions([]);

    let response = await listOrgPositions(Number(branchId));

    const transformedArray = response?.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    console.log(transformedArray, 'transformedArray');
    setPositions(transformedArray);

    if (response?.length > 0) {
      setSelectedPositionArr(transformedArray[0]);
    }
  };

  const fetchScheduleSettings = async () => {
    try {
      const response = await getSchedulingSettings(Number(branchId));
      setScheduleSettings(response);
    } catch (error) {
      console.error('Failed to fetch scheduling settings:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchScheduleSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  return (
    <div className="space-y-3">
      <div className="w-full rounded-md border bg-white p-3 shadow-md">
        <div className="flex w-full flex-wrap gap-1 lg:flex-nowrap">
          <div className="w-[30%]">
            <div className="w-full">
              <p>Position</p>
              <Select
                size="sm"
                value={selectedPositionArr}
                onChange={(selected: any) => {
                  setSelectedPositionArr(selected);
                }}
                options={positions || []}
                placeholder="Select Position"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div className="flex w-[70%] gap-1">
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Date</p>
              <DatePicker
                className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                selected={selectedDate}
                onChange={(date: any) => setSelectedDate(date)}
                dateFormat="eee, MMM d"
                placeholderText="Select date"
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Start time</p>
              <DatePicker
                className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                selected={selectedStartTime}
                onChange={(time: any) => setSelectedStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select start time"
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>End time</p>
              <DatePicker
                className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                selected={selectedEndTime}
                onChange={(time: any) => setSelectedEndTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select end time"
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Unpaid break</p>
              <Select
                size="sm"
                options={unpaidBreakOptions}
                onChange={(selected: any) => setSelectedUnpaidBreak(selected)}
                value={selectedUnpaidBreak}
                getOptionValue={(option) => option.value}
                displayValue={(selected: any) =>
                  unpaidBreakOptions.find((b) => b.value === selected)?.label
                }
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Shift quantity</p>
              <Select
                size="sm"
                options={shiftQuantity}
                onChange={(selectedQuantity: any) =>
                  setSelectedShiftQuantity(selectedQuantity)
                }
                value={selectedShiftQuantity}
                getOptionValue={(option) => option.value}
                displayValue={(selected: any) =>
                  shiftQuantity.find((b) => b.value === selected)?.label
                }
              />
            </div>
          </div>
        </div>
        <hr className="my-3 border-t border-gray-300" />
        <div className="flex w-full gap-3">
          <button
            className="flex cursor-pointer items-center gap-2 disabled:text-gray-200"
            disabled
          >
            <HiOutlineArrowPathRoundedSquare />
            <p className="text-xs">Recurring Shift</p>
          </button>
          <button
            className={`flex cursor-pointer items-center gap-2 ${
              selectedDate ? 'text-gray-600' : 'text-gray-200'
            }`}
            disabled={!selectedDate}
            onClick={() => setNotesDrawer(true)}
          >
            <SiGoogledocs />
            <p className="text-xs">Edit Details</p>
          </button>
          {/* <div className="flex items-center gap-2 ">
          <p className="font-medium text-black">Allow Overtime?</p>
          <Switch
            checked={enabled}
            onChange={(value: boolean) => setEnabled(value)}
            className={`${
              enabled ? 'bg-gray-600' : 'bg-gray-200'
            } group inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
            />
          </Switch>
        </div> */}
        </div>
        <Drawer
          size="md"
          isOpen={notesDrawer ?? false}
          onClose={() => {
            setNotesDrawer(false);
          }}
          overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
          containerClassName="dark:bg-gray-100"
          className="z-[9999]"
        >
          <NotesDrawer
            setDrawer={setNotesDrawer}
            shiftQuantity={selectedShiftQuantity}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            date={selectedDate}
            setShiftNote={setShiftNote}
            shiftNote={shiftNote}
            //@ts-ignore
            positionName={selectedPositionArr?.label}
          />
        </Drawer>
      </div>

      <div className=" flex w-full justify-end">
        <button
          className="rounded-md bg-green-700 px-4 py-2 text-white"
          onClick={() => handleConfirm()}
        >
          Confirm booking
        </button>
      </div>
    </div>
  );
};

export default CreateShiftCard;
