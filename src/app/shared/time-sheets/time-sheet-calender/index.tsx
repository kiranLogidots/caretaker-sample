'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from 'date-fns';
import { getTimeSheetData, listOrgPositions } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { Select } from 'rizzui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Spinner from '@/components/ui/spinner';

const localizer = momentLocalizer(moment);

const TimeSheetCalender = () => {
  const router = useParams();
  const { id } = router;

  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [positions, setPositions] = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState(null);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');

  const fetchPositions = async () => {
    setPositions([]);
    setSelectedPositionId(null);

    let response = await listOrgPositions(Number(branchId));

    const transformedArray = response?.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    setPositions(transformedArray);

    if (response?.length > 0) {
      setSelectedPositionArr(transformedArray[0]);
      setSelectedPositionId(response[0].position.id);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  const fetchData = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    const params = {
      startDate,
      endDate,
      branchId,
      position_id: selectedPositionId,
      userId: id,
    };
    try {
      const response = await getTimeSheetData(params);
      const dataValue = response.data[0];
      const useName = dataValue?.first_name + ' ' + dataValue?.last_name;
      setName(useName);

      const eventsValue =
        dataValue &&
        Object?.keys(dataValue?.mappedShiftAttendence)
          .filter((date) => date !== 'total_working_hours')
          .map((date) => ({
            start: new Date(date),
            end: new Date(date),
            title: `${
              dataValue?.mappedShiftAttendence[date]?.on_leave
                ? 'Leave'
                : `Working Hours: ${dataValue?.mappedShiftAttendence[date]?.total_working_hours}`
            }`,
            onLeave: dataValue?.mappedShiftAttendence[date]?.on_leave,
          }));

      setEvents(eventsValue || []);
      console.log(eventsValue, 'eventsValue');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
    fetchData(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, selectedPositionId, branchId]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const CustomToolbar = ({ label }: { label: any }) => (
    <div className="mb-2 flex w-full items-center justify-between rounded-md border p-1">
      <div className="flex items-center">
        <div className="flex items-center justify-between">
          <button className="mr-2" onClick={handlePrevMonth}>
            <IoMdArrowDropleft size={30} />
          </button>
          <DatePicker
            selected={currentMonth}
            onChange={handleDateChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            customInput={<button className="font-medium">{label}</button>}
            popperClassName="datepicker-popper"
          />
          <button className="ml-2" onClick={handleNextMonth}>
            <IoMdArrowDropright size={30} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <style>
        {`
          .react-datepicker__month .react-datepicker__month-text,
          .react-datepicker__month .react-datepicker__quarter-text {
            width: 6rem;
          }
          .react-datepicker__month {
            width: 300px;
          }
          .datepicker-popper {
            z-index: 1000;
          }
            .rbc-row-segment {
            padding: 0 7px 0 7px;
            }
            .rbc-event, .rbc-day-slot .rbc-background-event {
            text-align: center;
            }
        `}
      </style>
      <h3>Time Sheet - {name}</h3>
      <CustomToolbar label={format(currentMonth, 'MMM yyyy')} />
      <div className="w-72">
        <Select
          value={selectedPositionArr}
          onChange={(selected: any) => {
            setSelectedPositionArr(selected);
            setSelectedPositionId(selected?.value);
          }}
          options={positions}
          placeholder="Select Position"
          style={{ width: '100%' }}
        />
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          date={currentMonth}
          onNavigate={() => {}}
          components={{
            toolbar: () => null,
          }}
          style={{ height: 600 }}
        />
      )}
    </div>
  );
};

export default TimeSheetCalender;
