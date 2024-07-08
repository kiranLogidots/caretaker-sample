'use client';

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from 'date-fns';
import ControlledTable from '@/components/controlled-table';
import { getTimeSheetData, listOrgPositions } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { Select } from 'rizzui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

interface MappedShiftAttendence {
  [key: string]: {
    total_working_hours: number;
    on_leave: boolean;
    date: string;
  };
}

interface OrganizationUser {
  id: number;
  role: string;
  organization_id: number;
  organization_branch_id: number;
  role_id: number;
  user_id: string;
  primary_location: string;
  onboarded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface UserPosition {
  id: number;
  user_id: string;
  position_id: number;
  organization_branch_id: number;
  is_primary: boolean;
  organization_user_id: number;
  hourly_rate: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface DataItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  status: string | null;
  forgot_password_token: string | null;
  forgot_password_expires_at: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  employee_id: string | null;
  dob: string | null;
  profile_pic: string | null;
  employee_start_date: string | null;
  employment_status: string | null;
  shiftAttendences: [];
  organizationUsers: OrganizationUser[];
  userPositions: UserPosition[];
  mappedShiftAttendence: MappedShiftAttendence;
}

const TimeSheetsModule: React.FC = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [positions, setPositions]: any = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState(null);

  const fetchPositions = async () => {
    setPositions([]);
    setSelectedPositionId(null);

    let response = await listOrgPositions(Number(branchId));

    const transformedArray = response?.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    console.log(transformedArray, 'transformedArray');
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
    };
    try {
      const response = await getTimeSheetData(params);
      setData(response.data);
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

  const columns = [
    {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      width: 300,
      render: (_: any, record: DataItem) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Total Working Hours',
      dataIndex: 'total_working_hours',
      key: 'total_working_hours',
      width: 150,
      render: (_: any, record: DataItem) =>
        record.mappedShiftAttendence.total_working_hours || 0,
    },
    ...Object.keys(data[0]?.mappedShiftAttendence || {})
      .filter((date) => date !== 'total_working_hours')
      .map((date) => ({
        title: date,
        dataIndex: date,
        key: date,
        width: 200,
        render: (_: any, record: DataItem) =>
          record.mappedShiftAttendence[date]?.total_working_hours || 0,
      })),
  ];

  const tableData = data.map((item) => ({
    ...item,
    total_working_hours: item.mappedShiftAttendence.total_working_hours,
    ...item.mappedShiftAttendence,
  }));

  return (
    <div className=" space-y-5">
      <style>
        {`
          .react-datepicker__month .react-datepicker__month-text, .react-datepicker__month .react-datepicker__quarter-text {
            width: 6rem;
          }
          .react-datepicker__month {
            width: 300px;
          }
        `}
      </style>
      <h3>Time Sheet</h3>
      <div className="mb-2 flex w-full items-center justify-between rounded-md border p-1">
        <div className="flex items-center">
          <div className=" flex items-center gap-3">
            <button className="mr-2 " onClick={() => handlePrevMonth()}>
              <IoMdArrowDropleft size={30} />
            </button>
            <DatePicker
              selected={currentMonth}
              onChange={handleDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              customInput={
                <button className="font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </button>
              }
            />
            <button className="ml-2 " onClick={() => handleNextMonth()}>
              <IoMdArrowDropright size={30} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-72">
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
      <ControlledTable
        isLoading={isLoading}
        data={tableData}
        columns={columns as any}
        rowKey="id"
        scroll={4000}
      />
    </div>
  );
};

export default TimeSheetsModule;
