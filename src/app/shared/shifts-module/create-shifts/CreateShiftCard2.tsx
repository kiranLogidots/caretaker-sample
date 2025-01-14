'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Select } from 'rizzui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import { SiGoogledocs } from 'react-icons/si';
import dynamic from 'next/dynamic';
import moment from 'moment';
import NotesDrawer from './NotesDrawer';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import RecurringDrawer from './RecurringDrawer';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const unpaidBreakOptions = [
  { label: 'No Unpaid Break', value: 0 },
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

const CreateShiftCard2 = ({
  index,
  remove,
  watch,
  positions,
  scheduleSettings,
}: {
  index: any;
  remove: any;
  watch: any;
  positions: any;
  scheduleSettings: any;
}) => {
  const { control, register, setValue } = useFormContext();
  const [notesDrawer, setNotesDrawer] = React.useState(false);
  const [recurringDrawer, setRecurringDrawer] = useState(false);
  const [duration, setDuration] = useState('');

  const shiftValues = watch(`shifts[${index}]`);

  const calculateTotalTime = (start: any, end: any, breakMinutes: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60);
    const totalTimeMins = diffMins - breakMinutes;

    const hours = Math.floor(totalTimeMins / 60);
    const minutes = Math.floor(totalTimeMins % 60);
    return `${hours}hrs ${minutes}min`;
  };

  const findUnpaidBreak = (start: any, end: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60);

    scheduleSettings?.default_unpaid_breaks?.sort(
      (a: any, b: any) =>
        a.for_shifts_over_or_exact - b.for_shifts_over_or_exact
    );

    for (
      let i = scheduleSettings?.default_unpaid_breaks?.length - 1;
      i >= 0;
      i--
    ) {
      if (
        diffMins >=
        scheduleSettings?.default_unpaid_breaks[i]?.for_shifts_over_or_exact
      ) {
        return scheduleSettings?.default_unpaid_breaks[i]
          ?.default_unpaid_break_to;
      }
    }
    return 0; // or any default value if no match is found
  };

  useEffect(() => {
    setDuration(
      calculateTotalTime(
        shiftValues.start_time,
        shiftValues.end_time,
        shiftValues?.unpaid_break
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shiftValues.start_time,
    shiftValues.end_time,
    shiftValues?.unpaid_break,
    scheduleSettings?.default_unpaid_breaks,
  ]);

  useEffect(() => {
    const unpaidBreak = findUnpaidBreak(
      shiftValues.start_time,
      shiftValues.end_time
    );
    console.log(unpaidBreak, 'unpaidBreak');
    setValue(`shifts[${index}].unpaid_break`, unpaidBreak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shiftValues.start_time,
    shiftValues.end_time,
    scheduleSettings?.default_unpaid_breaks,
  ]);

  return (
    <div className="space-y-3">
      <div className="relative w-full rounded-md border bg-white p-3 shadow-md">
        <div className="flex w-full flex-wrap gap-1 lg:flex-nowrap">
          <div className="w-[30%]">
            <div className="w-full">
              <p>Position</p>
              <Controller
                name={`shifts[${index}].position`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    options={positions}
                    placeholder="Select Position"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex w-[70%] gap-1">
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Date</p>
              <Controller
                name={`shifts[${index}].date`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="eee, MMM d"
                    placeholderText="Select date"
                    minDate={new Date()}
                  />
                )}
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Start time</p>
              <Controller
                name={`shifts[${index}].start_time`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                    selected={field.value}
                    onChange={(time) => field.onChange(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select start time"
                  />
                )}
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>End time</p>
              <Controller
                name={`shifts[${index}].end_time`}
                control={control}
                render={({ field }) => (
                  //@ts-ignore
                  <DatePicker
                    {...field}
                    className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
                    selected={field.value}
                    onChange={(time) => field.onChange(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select end time"
                    minTime={
                      shiftValues.start_time
                        ? new Date(shiftValues.start_time.getTime() + 60000)
                        : new Date().setHours(0, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(23, 59, 59, 999)}
                  />
                )}
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Unpaid break</p>
              <Controller
                name={`shifts[${index}].unpaid_break`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    options={unpaidBreakOptions}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      unpaidBreakOptions.find((b) => b.value === selected)
                        ?.label
                    }
                  />
                )}
              />
            </div>
            <div className="flex min-w-[150px] flex-1 flex-col">
              <p>Shift quantity</p>
              <Controller
                name={`shifts[${index}].quantity`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    options={shiftQuantity}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      shiftQuantity.find((b) => b.value === selected)?.label
                    }
                  />
                )}
              />
            </div>
            {index !== 0 && (
              <div className="absolute right-0 top-0 mr-1 mt-1">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600"
                >
                  <AiOutlineCloseCircle className="cursor-pointer text-xl" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 flex w-full items-center justify-center gap-1.5">
          <p className="text-xs font-medium">Duration: </p>
          <p className="text-xs font-medium">{duration}</p>
        </div>
        <hr className="my-3 border-t border-gray-300" />
        <div className="flex w-full gap-3">
          <button
            type="button"
            className={`flex cursor-pointer items-center gap-2 ${
              shiftValues.date &&
              shiftValues.start_time &&
              shiftValues.end_time &&
              shiftValues.position
                ? 'text-gray-600'
                : 'text-gray-100'
            }`}
            onClick={() => setRecurringDrawer(true)}
            disabled={
              !shiftValues.date ||
              !shiftValues.start_time ||
              !shiftValues.end_time ||
              !shiftValues.position
            }
          >
            <HiOutlineArrowPathRoundedSquare />
            {shiftValues.end_date &&
              (shiftValues.interval_type === 'week' ? (
                <p className="text-xs">
                  Repeat{' '}
                  {shiftValues?.interval_count === 1
                    ? 'every'
                    : shiftValues?.interval_count === 2
                      ? 'two'
                      : shiftValues?.interval_count === 3
                        ? 'three'
                        : shiftValues?.interval_count === 4
                          ? 'four'
                          : ''}{' '}
                  week on {shiftValues.starting_day}
                </p>
              ) : shiftValues.interval_type === 'day' ? (
                <p className="text-xs">
                  Repeat{' '}
                  {shiftValues?.interval_count === 1
                    ? 'every'
                    : shiftValues?.interval_count === 2
                      ? 'two'
                      : shiftValues?.interval_count === 3
                        ? 'three'
                        : shiftValues?.interval_count === 4
                          ? 'four'
                          : ''}{' '}
                  day from{' '}
                  <span className="font-medium">
                    {moment(shiftValues.date).format('ddd MMMM, DD')}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {moment(shiftValues.end_date).format('ddd MMMM, DD')}
                  </span>
                </p>
              ) : (
                <p className="text-xs">
                  Repeat{' '}
                  {shiftValues?.interval_count === 1
                    ? 'every'
                    : shiftValues?.interval_count === 2
                      ? 'two'
                      : shiftValues?.interval_count === 3
                        ? 'three'
                        : shiftValues?.interval_count === 4
                          ? 'four'
                          : ''}{' '}
                  month until{' '}
                  <span className="font-medium">
                    {moment(shiftValues.end_date).format('ddd MMMM, DD')}
                  </span>
                </p>
              ))}

            {!shiftValues.end_date && (
              <p className="text-xs">Recurring Shift</p>
            )}
          </button>
          <button
            type="button"
            className={`flex cursor-pointer items-center gap-2 ${
              shiftValues.date &&
              shiftValues.start_time &&
              shiftValues.end_time &&
              shiftValues.position
                ? 'text-gray-600'
                : 'text-gray-100'
            }`}
            onClick={() => setNotesDrawer(true)}
            disabled={
              !shiftValues.date ||
              !shiftValues.start_time ||
              !shiftValues.end_time ||
              !shiftValues.position
            }
          >
            <SiGoogledocs />
            <p className="text-xs">Edit Details</p>
          </button>
        </div>
        <Drawer
          size="md"
          isOpen={notesDrawer ?? false}
          onClose={() => setNotesDrawer(false)}
          overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
          containerClassName="dark:bg-gray-100"
          className="z-[9999]"
        >
          <NotesDrawer
            setDrawer={setNotesDrawer}
            shiftQuantity={shiftValues.quantity}
            startTime={shiftValues.start_time}
            endTime={shiftValues.end_time}
            date={shiftValues.date}
            // setShiftNote={(note) =>
            //   control.setValue(`shifts[${index}].note`, note)
            // }
            shiftNote={shiftValues.shift_notes}
            positionName={shiftValues.position?.label}
            index={index}
          />
        </Drawer>
        <Drawer
          size="md"
          isOpen={recurringDrawer ?? false}
          onClose={() => setRecurringDrawer(false)}
          overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
          containerClassName="dark:bg-gray-100"
          className="z-[999]"
        >
          <RecurringDrawer
            setDrawer={setRecurringDrawer}
            shiftQuantity={shiftValues.quantity}
            intervalCount={shiftValues.interval_count}
            intervalType={shiftValues.interval_type}
            startTime={shiftValues.start_time}
            endTime={shiftValues.end_time}
            date={shiftValues.date}
            positionName={shiftValues.position?.label}
            index={index}
            watch={watch}
          />
        </Drawer>
      </div>
    </div>
  );
};

export default CreateShiftCard2;
