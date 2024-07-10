'use client';

import { listOrgPositions } from '@/service/page';
import { selectedBranchAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCirclePlus } from 'react-icons/fa6';
import CreateShiftCard2 from './CreateShiftCard2';

const CreateShifts = ({
  setOpenSummary,
  setSummaryData,
  summaryData,
  scheduleSettings,
}: {
  setOpenSummary: any;
  setSummaryData: any;
  summaryData: any;
  scheduleSettings: any;
}) => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;

  const [positions, setPositions]: any = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

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

  const methods = useForm({
    defaultValues: {
      shifts: summaryData
        ? summaryData.shifts.map((shift: any) => ({
            ...shift,
            start_time: new Date(shift.start_time),
            end_time: new Date(shift.end_time),
            date: new Date(shift.date),
          }))
        : [
            {
              position: '',
              date: null,
              start_time: setDefaultStartTime(),
              end_time: setDefaultEndTime(),
              unpaid_break: 0,
              quantity: 1,
              shift_notes: '',
              interval_count: 1,
              interval_type: 'week',
              starting_day: null,
              end_date: null,
            },
          ],
    },
  });

  const { control, handleSubmit, reset, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shifts',
  });

  const onSubmit = (data: any) => {
    const allShiftsValid = data.shifts.every(
      (shift: any) => shift.position && shift.date
    );

    if (allShiftsValid) {
      setSummaryData(data);
      setOpenSummary(true);
    } else {
      toast.error('Option or date field missing');
    }
  };

  const handleAddShift = () => {
    append({
      position: '',
      date: null,
      start_time: setDefaultStartTime(),
      end_time: setDefaultEndTime(),
      unpaid_break: 0,
      quantity: 1,
      shift_notes: '',
      interval_count: 1,
      interval_type: 'day',
      starting_day: null,
      end_date: null,
    });
  };

  const fetchPositions = async () => {
    setPositions([]);

    let response = await listOrgPositions(Number(branchId));

    const transformedArray = response?.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    setPositions(transformedArray);
  };

  useEffect(() => {
    fetchPositions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateSelect = (date: Date | null) => {
    append({
      position: '',
      //@ts-ignore
      date: date,
      start_time: setDefaultStartTime(),
      end_time: setDefaultEndTime(),
      unpaid_break: 0,
      quantity: 1,
      shift_notes: '',
      interval_count: 1,
      interval_type: 'week',
      starting_day: null,
      end_date: null,
    });
    setSelectedDate(date);
  };
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) {
      console.log('Branch ID changed:', branchId);
      reset({
        shifts: [
          {
            position: '',
            date: null,
            start_time: setDefaultStartTime(),
            end_time: setDefaultEndTime(),
            unpaid_break: 0,
            quantity: 1,
            shift_notes: '',
            interval_count: 1,
            interval_type: 'week',
            starting_day: null,
            end_date: null,
          },
        ],
      });
    } else {
      isInitialMount.current = false;
    }
  }, [branchId, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div ref={datePickerRef}>
          <button
            type="button"
            onClick={openDatePicker}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-[#4f41b8] px-7 py-2 font-medium text-white"
          >
            Select dates
          </button>
          {showDatePicker && (
            <div className="absolute z-10 bg-white p-4 shadow-md">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                dateFormat="yyyy-MM-dd"
                inline
                placeholderText="Select a date"
              />
            </div>
          )}
        </div>
        {fields.map((field, index) => (
          <CreateShiftCard2
            key={field.id}
            index={index}
            remove={remove}
            watch={watch}
            positions={positions}
            scheduleSettings={scheduleSettings}
          />
        ))}
        <button
          type="button"
          onClick={handleAddShift}
          className="flex cursor-pointer items-center gap-2 pt-4 text-gray-600"
        >
          <FaCirclePlus />
          Add another shift
        </button>
        <div className=" flex w-full justify-end">
          <button
            type="submit"
            className="rounded-md bg-[#6c5ce7] px-4 py-2 font-medium text-white"
          >
            Confirm booking
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateShifts;
