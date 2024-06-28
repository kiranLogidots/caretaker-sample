'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import CreateShiftCard from './CreateShiftCard';
import { FaCirclePlus } from 'react-icons/fa6';
import CreateShiftCard2 from './CreateShiftCard2';
import { AnyNode } from 'postcss';
import { getSchedulingSettings, listOrgPositions } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const CreateShifts = ({
  setOpenSummary,
  setSummaryData,
  summaryData,
}: {
  setOpenSummary: any;
  setSummaryData: any;
  summaryData: any;
}) => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;

  const [positions, setPositions]: any = useState([]);
  const [scheduleSettings, setScheduleSettings] = useState({});
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

  // const methods = useForm({
  //   defaultValues: {
  //     shifts: [
  //       {
  //         position: '',
  //         date: null,
  //         start_time: setDefaultStartTime(),
  //         end_time: setDefaultEndTime(),
  //         unpaid_break: 0,
  //         quantity: 1,
  //         shift_notes: '',
  //       },
  //     ],
  //   },
  // });
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
    // const updatedShifts = data.shifts.map((shift: any) => ({
    //   ...shift,
    //   assigned_date: moment(shift.date).format('YYYY-MM-DD'),
    //   position_id: shift.position.value,
    //   schedule_settings: scheduleSettings,
    // }));

    // const shiftsData = { shifts: updatedShifts };

    // console.log(shiftsData);
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

  const fetchScheduleSettings = async () => {
    try {
      const response = await getSchedulingSettings(Number(branchId));
      setScheduleSettings(response);
    } catch (error) {
      console.error('Failed to fetch scheduling settings:', error);
    }
  };

  useEffect(() => {
    console.log('hello', branchId);
    fetchPositions();
    fetchScheduleSettings();
    // reset({
    //   shifts: [
    //     {
    //       position: '',
    //       date: null,
    //       start_time: setDefaultStartTime(),
    //       end_time: setDefaultEndTime(),
    //       unpaid_break: 0,
    //       quantity: 1,
    //       shift_notes: '',
    //     },
    //   ],
    // });
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
            className="rounded-md bg-green-700 px-4 py-2 font-medium text-white"
          >
            Confirm booking
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateShifts;
