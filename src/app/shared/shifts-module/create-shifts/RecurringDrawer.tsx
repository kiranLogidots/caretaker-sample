import React, { useEffect, useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { CiClock2 } from 'react-icons/ci';
import { LuDot } from 'react-icons/lu';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { Select } from 'rizzui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const intervals = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

const intervalTypes = [
  { label: 'day', value: 'day' },
  { label: 'week', value: 'week' },
  { label: 'month', value: 'month' },
];

const repeatOn = [
  { label: 'Su', value: 'sunday' },
  { label: 'M', value: 'monday' },
  { label: 'T', value: 'tuesday' },
  { label: 'W', value: 'wednesday' },
  { label: 'Th', value: 'thursday' },
  { label: 'F', value: 'friday' },
  { label: 'S', value: 'saturday' },
];

interface RecurringDrawerProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  shiftQuantity: number;
  startTime: Date;
  endTime: Date;
  date: Date | null;
  positionName: string;
  index: number;
  intervalCount: number;
  intervalType: string;
  watch: any;
}

const RecurringDrawer: React.FC<RecurringDrawerProps> = ({
  setDrawer,
  shiftQuantity,
  startTime,
  endTime,
  date,
  positionName,
  index,
  intervalCount,
  intervalType,
  watch,
}) => {
  const { setValue } = useFormContext();
  const shiftValues = watch(`shifts[${index}]`);

  const [selectedIntervalCount, setSelectedIntervalCount] = useState(
    shiftValues.interval_count
  );
  const [selectedIntervalType, setSelectedIntervalType] = useState(
    shiftValues.interval_type
  );
  const [selectedDay, setSelectedDay] = useState(shiftValues.starting_day);
  const [endDate, setEndDate] = useState(shiftValues.end_date);
  const [error, setError] = useState('');

  useEffect(() => {
    if (date && !shiftValues.starting_day) {
      const dayName = date
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      setSelectedDay(dayName);
    }
  }, [date, shiftValues.starting_day]);

  const handleDayClick = (dayValue: string) => {
    setSelectedDay(dayValue);
  };

  const handleSave = () => {
    if (!endDate) {
      setError('End date is missing');
      return;
    }
    setValue(`shifts[${index}].interval_count`, selectedIntervalCount);
    setValue(`shifts[${index}].interval_type`, selectedIntervalType);
    setValue(`shifts[${index}].starting_day`, selectedDay);
    setValue(`shifts[${index}].end_date`, endDate);
    setDrawer(false);
  };
  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      <div className="mb-5 mt-4 flex items-center justify-between ">
        <h6 className=" flex-1 text-center">New Shift x{shiftQuantity}</h6>
        <ActionIcon size="sm" variant="text" onClick={() => setDrawer(false)}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <div className="">
        <h3>Set Repeat Options</h3>
        <div className="flex items-center gap-1 pt-3 text-xs font-medium">
          <CiClock2 />
          <span>{moment(date).format('ddd, MMM D')}</span>
          <LuDot />
          <span>{moment(startTime).format('h a')}</span>
          <span>-</span>
          <span>{moment(endTime).format('h a')}</span>
        </div>
        <div className="pt-3 text-xs font-medium text-black">
          {positionName}
        </div>
      </div>
      <hr />
      <div className="w-full">
        <p>Repeat every:</p>
        <div className="flex w-full gap-2 pt-3">
          <Select
            className="z-[9999] w-[30%] "
            size="sm"
            value={selectedIntervalCount}
            options={intervals}
            onChange={(selected: any) => setSelectedIntervalCount(selected)}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              intervals.find((b) => b.value === selected)?.label
            }
          />
          <Select
            className="z-[9999] w-[60%]"
            size="sm"
            value={selectedIntervalType}
            options={intervalTypes}
            onChange={(selected: any) => setSelectedIntervalType(selected)}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              intervalTypes.find((b) => b.value === selected)?.label
            }
          />
        </div>
      </div>
      <div className="w-full space-y-2">
        <p className="">Repeat on:</p>
        <div className="flex space-x-2 pl-3">
          {repeatOn.map((day) => (
            <div
              key={day.value}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-medium hover:bg-blue-300 ${
                selectedDay === day.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => handleDayClick(day.value)}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full space-y-2">
        <p>Ends:</p>
        <DatePicker
          className="h-[32px] w-full rounded-md border-gray-200 text-sm placeholder:text-sm"
          selected={endDate}
          onChange={(date: any) => {
            setEndDate(date);
            setError('');
          }}
          dateFormat="eee, MMM d"
          placeholderText="Select date"
          wrapperClassName="w-full"
          minDate={shiftValues.date}
        />
      </div>
      {error && <p className="pt-2 text-xs text-red-400">{error}</p>}

      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-gray-200 px-4 py-2 text-black"
          onClick={() => setDrawer(false)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleSave()}
          type="button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RecurringDrawer;
