'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from 'date-fns';
import {
  downloadTimeSheet,
  getTimeSheetData,
  listOrgPositions,
} from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { Select } from 'rizzui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdCloudDownload,
} from 'react-icons/io';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { PiArrowLeftBold } from 'react-icons/pi';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const TimeSheetCalender = () => {
  const router = useRouter();
  const params = useParams();
  const queryParams = useSearchParams();
  const selectedPositionId = queryParams.get('positionId');
  const { id } = params;

  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [downloadStartDate, setDownloadStartDate] = useState<string>();
  const [downloadEndDate, setDownloadEndDate] = useState<string>();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [sheetData, setSheetData] = useState();
  const [leaveNumber, setLeaveNumber] = useState(0);

  function countLeaveDays(data: any) {
    let count = 0;
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key].on_leave === true) {
        count++;
      }
    }
    return count;
  }

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
      setSheetData(dataValue);
      const leaveCount = countLeaveDays(dataValue?.mappedShiftAttendence);
      setLeaveNumber(leaveCount);

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
    setDownloadStartDate(startDate);
    setDownloadEndDate(endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, branchId]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    const params = {
      startDate: downloadStartDate,
      endDate: downloadEndDate,
      branchId,
      position_id: selectedPositionId,
      userId: id,
    };
    try {
      const resp = await downloadTimeSheet(params);
      window.open(resp, '_self');
      toast.success('Successfully downloaded');
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setDownloadLoading(false);
    }
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
      <div>
        <button
          onClick={handleDownload}
          disabled={downloadLoading}
          className="flex items-center gap-2 rounded-md bg-[#6c5ce7] px-3 py-2 text-white "
        >
          <IoMdCloudDownload />
          <p className="font-medium text-white">Download</p>
        </button>
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
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <FaArrowLeft size={20} />
        </Button>
        <h3>
          Time Sheet - {name}{' '}
          <span className="text-xs">
            (Total hours:{' '}
            {
              //@ts-ignore
              sheetData?.mappedShiftAttendence?.total_working_hours
            }
            , Total leave: {leaveNumber})
          </span>
        </h3>
      </div>
      <CustomToolbar label={format(currentMonth, 'MMM yyyy')} />

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
