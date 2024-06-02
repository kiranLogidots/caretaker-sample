/* eslint-disable */
'use client';

import { useCallback, useEffect, useState } from 'react';
import ControlledTable from '@/components/controlled-table';
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventForm from '@/app/shared/event-calendar/event-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import moment from 'moment';
import { getUsersWithShifts, listOrgPositions, viewBranch } from '@/service/page';

export default function EventCalendarView() {
  const { openModal } = useModal();

  const [refreshKey, setRefreshKey] = useState(1);
  const [positions, setPositions]: any = useState([]);

  const [selectedPositionId, setSelectedPositionId] = useState(null);

  const [selectedDates, setSelectedDates]: any = useState([]);
  const [columns, setColumns]: any = useState([]);
  const [shiftTemplate, setShiftTemplate]: any = useState(null);
  const [eventsData, setEventsData]: any = useState([]);

  useEffect(() => {
      generateDates();
      fetchPositions();
      fetchCurrentBranch();
  }, []);

  useEffect(() => {
    if (selectedDates.length && selectedPositionId && shiftTemplate && refreshKey) {
      generateTableData();
    }
  }, [selectedDates, selectedPositionId, shiftTemplate, refreshKey]);

  const handleSelectSlot = useCallback(
    ({ assignedDate, start, end, user, eventTemplate }: { assignedDate: string, start: Date; end: Date, user: any, eventTemplate: any }) => {
      openModal({
        view: 
        <EventForm 
          assignedDate={assignedDate} 
          startDate={start} 
          endDate={end} 
          eventTemplate={eventTemplate} 
          user={user}
          refresh={() => setRefreshKey(v => v + 1)}
        />,
        customSize: '650px',
      });
    },
    [openModal]
  );

  const fetchPositions = async () => {
    setPositions([]);
    setSelectedPositionId(null);

    let response = await listOrgPositions();
    setPositions(response);
    
    if(response.length > 0) {
      setSelectedPositionId(response[0].position.id);
    }
  }

  const fetchCurrentBranch = async () => {
    let response = await viewBranch();
    if(response.scheduleSettings) {
      let settings = response.scheduleSettings;
      let overrideSettings = response.scheduleSettings?.positionCustomSettings.find((p:any) => p.position_id === selectedPositionId) || {};
      setShiftTemplate({
        user_id: "",
        position_id: "",
        assigned_date: "",
        start_time: "",
        end_time: "",
        unpaid_break: "",
        is_over_time_allowed: false,
        shift_notes: "No notes available",
        shift_status: "assigned",
        shift_type: "published",
        schedule_settings: {
          last_pay_period_start_date: settings.last_pay_period_start_date,
          over_time_calculation_period_length: settings.over_time_calculation_period_length,
          def_over_time_threshold_per_day: settings.def_over_time_threshold_per_day,
          def_over_time_threshold_per_over_time_period: settings.def_over_time_threshold_per_over_time_period,
          min_time_between_shifts: settings.min_time_between_shifts,
          default_unpaid_breaks: settings.default_unpaid_breaks
        }
      });
    }
  }

  const generateDates = (type = '') => {
    let startDate, endDate;
    let dates = [];
    switch (type) {
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
    const response = await getUsersWithShifts({
      positionId: selectedPositionId,
      dateRange: [selectedDates[0], selectedDates[selectedDates.length - 1]]
    });

    setColumns([
      {
        key: 'userId',
        dataIndex: 'teamMember',
        title: 'Team Members',
        render: (data: string) => <div className='capitalize px-3 py-4'>{data}</div>,
        width: 180
      },
      ...selectedDates.map((d: string) => ({
        key: d,
        dataIndex: d,
        title: 
          <div className='flex flex-col items-center'>
            {
              moment(d, 'YYYY-MM-DD').format('ddd DD').split(' ').map(df => (
                <span>{df}</span>
              ))
            }
          </div>,
        render: (data: any) =>
          <div
            className='cursor-pointer px-2 py-2 flex flex-col items-center'
            onClick={() => {
              if (data.userId && data.shifts.length === 0) {
                let date = new Date(moment(d, 'YYYY-MM-DD').format());
                handleSelectSlot({
                  assignedDate: d,
                  start: date,
                  end: date,
                  user: response.data.find((u: any) => u.user_id === data.userId),
                  eventTemplate: {
                    ...shiftTemplate,
                    position_id: selectedPositionId
                  }
                })
              }
            }}
          >
            {
              data.userId && 
              (
                data.shifts.length > 0 ?
                data.shifts.map((s: any) => (
                  <Badge
                    variant="flat"
                    rounded="pill"
                    className="w-[90px] font-medium text-white whitespace-nowrap mb-1"
                    color="primary"
                  >
                    {moment(s.shift.start_time).format('HH:mm')} -
                    {moment(s.shift.end_time).format('HH:mm')}
                  </Badge>
                )) : 
                <Button  className="w-full" variant="outline">
                  +
                </Button>
              )
            } 
            {
              data.summary &&
              <>{data.summary}</>
            }
          </div>
      }))
     
    ]);

    setEventsData([
      {
        teamMember: <span className='font-bold'>Total Position Hours</span>,
        ...selectedDates.reduce((prev: { [key: string]: any }, current: string) => {
          prev[current] = {
            user_id: null,
            summary: <span className='font-bold'>0 hrs 0 mins</span>
          };
          return prev;
        }, {})
      },
      {
        teamMember: <span className='font-bold'>Open Shift</span>,
        ...selectedDates.reduce((prev: { [key: string]: any }, current: string) => {
          prev[current] = {
            user_id: null,
            summary: ""
          };
          return prev;
        }, {})
      },
      ...response.data.map((r: any) => {
        return {
          userId: r.user_id,
          teamMember: r.user.first_name + " " + r.user.last_name,
          ...selectedDates.reduce((prev: { [key: string]: any }, current: string) => {
            prev[current] = {
              shifts: r.assignedShifts.filter((assignedShift: any) => {
                return moment(assignedShift.shift.start_time).format('YYYY-MM-DD') === current
              }),
              userId: r.user_id,
              summary: null
            };
            return prev;
          }, {})
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
          {moment(selectedDates[0], 'YYYY-MM-DD').format('MMM DD, YYYY')} -
          {moment(selectedDates[selectedDates.length - 1], 'YYYY-MM-DD').format('MMM DD, YYYY')}
          <Button className="!w-[unset] ml-2" onClick={() => generateDates('next')}>
            Next
          </Button>
        </div>
      }
      <div className="mb-2">
        <Select
          placeholder="Select a Position"
          options={positions.map((p: any) => {
            return {
              label: p.position.name,
              value: p.position.id
            }
          })}
          value={selectedPositionId}
          onChange={(e: any) => setSelectedPositionId(e.value)}
          displayValue={(e: any) => {
            return positions.find((p: any) => p.position.id === e).position.name
          }}
          className="col-span-1/2"
        />
      </div>
      <ControlledTable
        columns={columns}
        data={eventsData}
        variant='classic_v2'
      />
    </div>
  );
}
