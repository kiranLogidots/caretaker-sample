'use client';

import type { CalendarEvent } from '@/types';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import ControlledTable from '@/components/controlled-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventForm from '@/app/shared/event-calendar/event-form';
import DetailsEvents from '@/app/shared/event-calendar/details-event';
import { useModal } from '@/app/shared/modal-views/use-modal';
import useEventCalendar from '@/hooks/use-event-calendar';
import cn from '@/utils/class-names';
import moment from 'moment';
import { getUsersWithShifts } from '@/service/page';

const localizer = dayjsLocalizer(dayjs);

// rbc-active -> black button active
const calendarToolbarClassName =
  '[&_.rbc-toolbar_.rbc-toolbar-label]:whitespace-nowrap [&_.rbc-toolbar_.rbc-toolbar-label]:my-2 [&_.rbc-toolbar]:flex [&_.rbc-toolbar]:flex-col [&_.rbc-toolbar]:items-center @[56rem]:[&_.rbc-toolbar]:flex-row [&_.rbc-btn-group_button:hover]:bg-gray-300 [&_.rbc-btn-group_button]:duration-200 [&_.rbc-btn-group_button.rbc-active:hover]:bg-gray-600 dark:[&_.rbc-btn-group_button.rbc-active:hover]:bg-gray-300 [&_.rbc-btn-group_button.rbc-active:hover]:text-gray-50 dark:[&_.rbc-btn-group_button.rbc-active:hover]:text-gray-900';

export default function EventCalendarView() {
  const { events } = useEventCalendar();
  const { openModal } = useModal();

  const handleSelectSlot = useCallback(
    ({ start, end, user }: { start: Date; end: Date, user: any }) => {
      openModal({
        view: <EventForm startDate={start} endDate={end} user={user} />,
        customSize: '650px',
      });
    },
    [openModal]
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      openModal({
        view: <DetailsEvents event={event} />,
        customSize: '500px',
      });
    },
    [openModal]
  );

  const { views, scrollToTime, formats } = useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: false,
      },
      scrollToTime: new Date(2023, 10, 27, 6),
      formats: {
        dateFormat: 'D',
        weekdayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'ddd', culture),
        dayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'ddd M/D', culture),
        timeGutterFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, 'hh A', culture),
      },
    }),
    []
  );

  const [selectedDates, setSelectedDates]: any = useState([]);
  const [columns, setColumns]: any = useState([]);
  const [eventsData, setEventsData]: any = useState([]);

  useEffect(() => {
    generateDates();
  },[]);

  useEffect(() => {
    if(selectedDates.length) {
      generateTableData();
    }
  }, [selectedDates]);

  const generateDates = (type = '') => {
    let startDate, endDate;
    let dates = [];
    switch(type) {
      case 'previous':
        endDate = moment(selectedDates[0], 'YYYY-MM-DD').subtract(1, 'days');
        startDate = endDate.clone().subtract(6, 'days');
        break;
      case 'next': 
        startDate = moment(selectedDates[selectedDates.length - 1], 'YYYY-MM-DD').add(1, 'days')
        endDate = startDate.clone().add(6, 'days');
        break;
      default: 
        startDate = moment().clone().weekday(1);
        endDate = startDate.clone().add(6, 'days');
    }

    for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
        dates.push(m.format('YYYY-MM-DD'));
    }
    setSelectedDates(dates);
  }

  const generateTableData = async () => {
    const response = await getUsersWithShifts();

    setColumns([
      {
        key: 'userId',
        dataIndex: 'teamMember',
        title: 'Team Members',
        render: (data: string) => <div className='capitalize px-3 py-4'>{data}</div>,
        width: 200
      },
      ...selectedDates.map((d: string) => ({
        key: d,
        dataIndex: d,
        title: moment(d, 'YYYY-MM-DD').format('ddd DD'),
        render: (data: any) => 
          <div 
            className='cursor-pointer px-3 py-4' 
            onClick={() => {
              if(data.userId) {
                handleSelectSlot({ 
                  start: new Date(moment(d ,'YYYY-MM-DD').format()), 
                  end: new Date(d),
                  user: response.data.find((u: any) => u.user_id === data.userId)
                })
              }
            }}
          >
            { 
              data.userId && data.shifts.length > 0 && 
              data.shifts.map((s: any) => (
                <Badge
                  variant="flat"
                  rounded="pill"
                  className="w-[90px] font-medium"
                  color="primary"
                >
                  { moment(s.shift.start_time).format('HH:mm') } -
                  { moment(s.shift.end_time).format('HH:mm') }
                </Badge>
              ))
            }
            { 
              data.summary && 
              <>{data.summary}</>
            }
            <span className='hidden'>No data</span>
          </div>
      }))
    ]);

    setEventsData([
      {
        teamMember: <span className='font-bold'>Total Position Hours</span>,
        ...selectedDates.reduce((prev: {[key: string]: any}, current: string) => {
          prev[current] = {
            user_id: null,
            summary: <span className='font-bold'>0 hrs 0 mins</span>
          };
          return prev;
        },{})
      },
      {
        teamMember: <span className='font-bold'>Open Shift</span>,
        ...selectedDates.reduce((prev: {[key: string]: any}, current: string) => {
          prev[current] = {
            user_id: null,
            summary: ""
          };
          return prev;
        },{})
      },
      ...response.data.map((r: any) => {
        return {
          userId: r.user_id,
          teamMember: r.user.first_name + " " + r.user.last_name,
          ...selectedDates.reduce((prev: {[key: string]: any}, current: string) => {
            prev[current] = {
              shifts: r.assignedShifts.filter((assignedShift: any) => {
                return moment(assignedShift.shift.start_time).format('YYYY-MM-DD') === current
              }),
              userId: r.user_id, 
              summary: null
            };
            return prev;
          },{})
        }
      })
    ]);
  }

  return (
    <div className="@container">
      {
        selectedDates.length &&
        <div className="mb-2">
          <Button className="!w-[unset] mr-2" onClick={() => generateDates('previous')}>
            Previous
          </Button>
            { moment(selectedDates[0],'YYYY-MM-DD').format('MMM DD, YYYY') } - 
            { moment(selectedDates[selectedDates.length - 1],'YYYY-MM-DD').format('MMM DD, YYYY') }
          <Button className="!w-[unset] ml-2" onClick={() => generateDates('next')}>
            Next
          </Button>
        </div>
      }
      <ControlledTable
        columns={columns}
        data={eventsData}
        variant='classic_v2'
      />
      {/* <Calendar
        localizer={localizer}
        events={events}
        views={views}
        formats={formats}
        startAccessor="start"
        endAccessor="end"
        dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        scrollToTime={scrollToTime}
        className={cn('h-[650px] md:h-[1000px]', calendarToolbarClassName)}
        defaultView="week" 
      /> */}

    </div>
  );
}
