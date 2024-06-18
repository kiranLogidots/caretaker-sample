/* eslint-disable */
'use client';

import { useCallback, useEffect, useState } from 'react';
import ControlledTable from '@/components/controlled-table';
// import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import EventForm from '@/app/shared/event-calendar/event-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import moment from 'moment';

import {
  getUsersWithShifts,
  listOrgPositions,
  viewBranch,
} from '@/service/page';
import {
  MemberProfile,
  ShiftDataCell,
  TableHeaderCell,
} from './event-table-components';
import { PiArrowLineLeft, PiArrowLineRight } from 'react-icons/pi';
import DrawerButton from '../drawer-button';
import EventCalendarSettings from './settings/event-calendar-settings';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import FilterDrawer from './FilterDrawer';
import { TbFilter } from 'react-icons/tb';
import { IoSettingsOutline } from 'react-icons/io5';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { Select } from 'rizzui';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

export default function EventCalendarView() {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const { openModal } = useModal();
  const [tabvalue, setTabValue] = useState(1);

  const [refreshKey, setRefreshKey] = useState(1);
  const [positions, setPositions]: any = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState([]);

  const [selectedPositionId, setSelectedPositionId] = useState(null);

  const [selectedDates, setSelectedDates]: any = useState([]);
  const [columns, setColumns]: any = useState([]);
  const [shiftTemplate, setShiftTemplate]: any = useState(null);
  const [eventsData, setEventsData]: any = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [settingsdrawer, setSettingsDrawer] = useState(false);

  //Filter state value
  const [shiftStatus, setShiftStatus] = useState<string[]>([]);
  const [employStatus, setEmployStatus] = useState<string[]>([]);
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
    generateDates();
  }, [tabvalue]);

  useEffect(() => {
    if (
      selectedDates.length &&
      selectedPositionId &&
      shiftTemplate &&
      refreshKey
    ) {
      generateTableData();
    }
  }, [selectedDates, selectedPositionId, shiftTemplate, refreshKey]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectSlot = useCallback(
    ({
      id,
      shift_id,
      assignedDate,
      start,
      end,
      user,
      unpaid_break,
      shift_notes,
      eventTemplate,
    }: {
      id: number | null;
      shift_id: number | null;
      assignedDate: string;
      start: Date;
      end: Date;
      user: any;
      unpaid_break?: number;
      shift_notes?: string;
      eventTemplate: any;
    }) => {
      openModal({
        view: (
          <EventForm
            id={id}
            shift_id={shift_id}
            assignedDate={assignedDate}
            startDate={start}
            endDate={end}
            eventTemplate={eventTemplate}
            unpaid_break={unpaid_break}
            shift_notes={shift_notes}
            user={user}
            refresh={() => setRefreshKey((v) => v + 1)}
          />
        ),
        customSize: '650px',
      });
    },
    [openModal]
  );

  const fetchPositions = async () => {
    setPositions([]);
    setSelectedPositionId(null);

    let response = await listOrgPositions(Number(branchId));
    console.log(response, 'responseposition');

    const transformedArray = response.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    console.log(transformedArray, 'transformedArray');
    setPositions(transformedArray);

    if (response.length > 0) {
      setSelectedPositionArr(transformedArray[0]);
      setSelectedPositionId(response[0].position.id);
    }
  };

  const fetchCurrentBranch = async () => {
    let response = await viewBranch(Number(branchId));
    if (response.scheduleSettings) {
      let settings = response.scheduleSettings;

      // overrideSettings can be used to override branch settings for initializing a shift
      let overrideSettings =
        response.scheduleSettings?.positionCustomSettings.find(
          (p: any) => p.position_id === selectedPositionId
        ) || {};

      setShiftTemplate({
        user_id: '',
        position_id: '',
        assigned_date: '',
        start_time: '',
        end_time: '',
        unpaid_break: '',
        is_over_time_allowed: false,
        shift_notes: 'No notes available',
        shift_status: 'assigned',
        shift_type: 'published',
        schedule_settings: {
          last_pay_period_start_date: settings.last_pay_period_start_date,
          over_time_calculation_period_length:
            settings.over_time_calculation_period_length,
          def_over_time_threshold_per_day:
            settings.def_over_time_threshold_per_day,
          def_over_time_threshold_per_over_time_period:
            settings.def_over_time_threshold_per_over_time_period,
          min_time_between_shifts: settings.min_time_between_shifts,
          default_unpaid_breaks: settings.default_unpaid_breaks,
        },
      });
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchCurrentBranch();
    setSelectedPositionId(null);
    setSelectedPositionArr([]);
  }, [branchId]);

  const generateDates = (type = '') => {
    let startDate, endDate;
    let dates = [];
    switch (type) {
      case 'previous':
        endDate = moment(selectedDates[0], 'YYYY-MM-DD').subtract(1, 'days');
        startDate = endDate.clone().subtract(7 * tabvalue - 1, 'days');
        break;
      case 'next':
        startDate = moment(
          selectedDates[selectedDates.length - 1],
          'YYYY-MM-DD'
        ).add(1, 'days');
        endDate = startDate.clone().add(7 * tabvalue - 1, 'days');
        break;
      default:
        startDate = moment().clone().weekday(1);
        endDate = startDate.clone().add(7 * tabvalue - 1, 'days');
    }

    for (
      let m = moment(startDate);
      m.isSameOrBefore(endDate);
      m.add(1, 'days')
    ) {
      dates.push(m.format('YYYY-MM-DD'));
    }
    setSelectedDates(dates);
  };

  const generateTableData = async () => {
    const response = await getUsersWithShifts({
      branchId: branchId,
      positionId: selectedPositionId,
      dateRange: [selectedDates[0], selectedDates[selectedDates.length - 1]],
      shiftStatus: shiftStatus.join(','),
      employStatus: employStatus.join(','),
      memberName,
    });

    setColumns([
      {
        key: 'userId',
        dataIndex: 'teamMember',
        title: 'Team Members',
        render: (data: any) =>
          data?.userId ? <MemberProfile data={data} /> : data,
        width: 180,
      },
      ...selectedDates.map((d: string) => ({
        key: d,
        dataIndex: d,
        title: <TableHeaderCell date={d} />,
        width: 150,
        render: (data: any) => (
          <ShiftDataCell
            data={data}
            createShift={() => {
              let date = new Date(moment(d, 'YYYY-MM-DD').format());
              handleSelectSlot({
                id: null,
                shift_id: null,
                assignedDate: d,
                start: date,
                end: date,
                user: response.data.find((u: any) => u.user_id === data.userId),
                eventTemplate: {
                  ...shiftTemplate,
                  position_id: selectedPositionId,
                  position_name: positions.find(
                    (p: any) => p.value === selectedPositionId
                  )?.label,
                },
              });
            }}
            editShift={(shiftData: any) => {
              handleSelectSlot({
                id: shiftData.id,
                shift_id: shiftData?.shift_id,
                assignedDate: shiftData.assigned_date,
                start: new Date(moment(shiftData.shift.start_time).format()),
                end: new Date(moment(shiftData.shift.end_time).format()),
                user: response.data.find((u: any) => u.user_id === data.userId),
                unpaid_break: shiftData.shift.unpaid_break,
                shift_notes: shiftData.shift.shift_notes,
                eventTemplate: {
                  ...shiftTemplate,
                  position_id: selectedPositionId,
                },
              });
            }}
          />
        ),
      })),
    ]);

    let tableCellData = response.data.map((r: any) => {
      return {
        userId: r.user_id,
        teamMember: {
          userId: r.user_id,
          name: [r.user.first_name, r.user.last_name].join(' '),
          totalHours: r.totalHours,
          employment_status: r?.user?.employment_status,
        },
        ...selectedDates.reduce(
          (prev: { [key: string]: any }, current: string) => {
            prev[current] = {
              shifts: r.assignedShifts.filter((assignedShift: any) => {
                return (
                  moment(assignedShift.shift.start_time).format(
                    'YYYY-MM-DD'
                  ) === current
                );
              }),
              userId: r.user_id,
              summary: null,
            };
            return prev;
          },
          {}
        ),
      };
    });

    setEventsData([
      {
        teamMember: (
          <div className="px-3 py-4 font-bold">Total Position Hours</div>
        ),
        ...selectedDates.reduce(
          (prev: { [key: string]: any }, current: string) => {
            prev[current] = {
              user_id: null,
              summary: '',

              // Total position hours calculation operation for summary
              // Returns an array of assignedShifts for the particular date for all users

              // summary:
              //   tableCellData.filter((tc: any) => tc[current].shifts.length > 0)
              //                 .map((data: any) => data[current].shifts)
              //                 .reduce((acc: any, cur: any) => {
              //                   acc = [
              //                     ...acc,
              //                     ...cur
              //                   ]
              //                   return acc;
              //                 },[])
            };
            return prev;
          },
          {}
        ),
      },
      {
        teamMember: <div className="px-3 py-4 font-bold">Open Shift</div>,
        ...selectedDates.reduce(
          (prev: { [key: string]: any }, current: string) => {
            prev[current] = {
              user_id: null,
            };
            return prev;
          },
          {}
        ),
      },
      ...tableCellData,
    ]);
  };

  useEffect(() => {
    if (
      selectedDates.length &&
      selectedPositionId &&
      shiftTemplate &&
      refreshKey
    ) {
      generateTableData();
    }
  }, [
    selectedDates,
    selectedPositionId,
    shiftTemplate,
    refreshKey,
    branchId,
    shiftStatus,
    employStatus,
    memberName,
  ]);

  return (
    <div className="mt-5 @container">
      <div className="mb-2 flex w-full items-center justify-between rounded-md border">
        <div className="flex items-center">
          <div>
            {selectedDates.length && (
              <div className=" flex items-center">
                <button
                  className="mr-2 "
                  onClick={() => generateDates('previous')}
                >
                  <IoMdArrowDropleft
                    onClick={() => generateDates('previous')}
                    size={30}
                  />
                </button>
                <span className=" text-xl font-semibold">
                  {moment(selectedDates[0], 'YYYY-MM-DD').format('MMM DD')} -
                  {moment(
                    selectedDates[selectedDates.length - 1],
                    'YYYY-MM-DD'
                  ).format('MMM DD')}
                </span>
                <button className="ml-2 " onClick={() => generateDates('next')}>
                  <IoMdArrowDropright size={30} />
                </button>
              </div>
            )}
          </div>
          <div>
            <Tabs
              value={tabvalue}
              onChange={handleTabChange}
              textColor="inherit"
            >
              <Tab label="Week 1" value={1} key={'week-1'} />
              <Tab label="Week 2" value={2} key={'week-2'} />
            </Tabs>
          </div>
        </div>
        <div className="flex ">
          {/* <DrawerButton
            className=''
            label="Settings"
            view={<EventCalendarSettings />}
            customSize="500px"
            placement="right"
            icon={<IoSettingsOutline className='mr-1' />}
          /> */}
          <div
            onClick={() => setSettingsDrawer(true)}
            className="flex cursor-pointer items-center gap-1 border border-y-0 border-r-0 px-2"
          >
            <IoSettingsOutline />
            <span>Settings</span>
          </div>
          <div
            onClick={() => setDrawer(true)}
            className="flex cursor-pointer items-center gap-1 border border-y-0 border-r-0 px-2"
          >
            <TbFilter />
            <span>Filter</span>
          </div>
          <div className="ml-auto flex items-center">
            {' '}
            <input
              type="text"
              onChange={(e) => setMemberName(e.target.value)}
              value={memberName}
              className=" w-60 rounded-r-md border-y-0 border-r-0 border-l-gray-200 focus:border-l-gray-200 focus:outline-none focus:ring-0"
              placeholder="Search member"
            />
            <button className="p-2 focus:outline-none focus:ring-0">
              <FiSearch className="text-slate-500" size={25} />
            </button>
          </div>
          {/* <div className="flex justify-between">
            <input
              type="text"
              className="rounded-r-md border-y-0 border-r-0 border-l-gray-200 focus:border-l-gray-200  focus:outline-none focus:ring-0"
              placeholder="Search member"
            />
            <button className="p-2 focus:outline-none focus:ring-0">
              <FiSearch className="text-slate-500" size={25} />
            </button>
          </div> */}
        </div>
      </div>
      <div className="mb-2 flex w-full justify-between">
        <div className="w-72">
          {/* <Select
            placeholder="Select a Position"
            options={(positions || []).map((p: any) => {
              return {
                label: p?.departmentPositions?.positions?.name,
                value: p?.departmentPositions?.positions?.id,
              };
            })}
            value={selectedPositionId}
            onChange={(e: any) => setSelectedPositionId(e.value)}
            // displayValue={(e: any) => {
            //   return positions.find((p: any) => p?.position?.id === e).position
            //     .name;
            // }}
          /> */}
          <Select
            value={selectedPositionArr}
            // onChange={setSelectedUserBranch}
            onChange={(selected: any) => {
              setSelectedPositionArr(selected);
              setSelectedPositionId(selected?.value);
            }}
            options={positions || []}
            placeholder="Select Position"
            style={{ width: '100%' }}
          />
        </div>

        <Drawer
          size="md"
          isOpen={drawer ?? false}
          onClose={() => {
            setDrawer(false);
          }}
          overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
          containerClassName="dark:bg-gray-100"
          className="z-[9999]"
        >
          <FilterDrawer
            setDrawer={setDrawer}
            setShiftStatus={setShiftStatus}
            setEmployStatus={setEmployStatus}
          />
        </Drawer>

        <Drawer
          size="md"
          isOpen={settingsdrawer ?? false}
          onClose={() => {
            setSettingsDrawer(false);
          }}
          overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
          containerClassName="dark:bg-gray-100"
          className="z-[9999]"
        >
          <EventCalendarSettings setDrawer={setSettingsDrawer} />
        </Drawer>

        {/* <DrawerButton
          label="Settings"
          view={<EventCalendarSettings />}
          customSize="500px"
          placement="right"
        /> */}
      </div>
      <ControlledTable
        columns={columns}
        data={eventsData}
        variant="classic_v2"
      />
    </div>
  );
}
