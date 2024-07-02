import React, { useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { Select } from 'rizzui';
import AgencySummary from './AgencySummary';

const radioOptions = [
  { label: 'Send to all agencies', value: 'all_agencies' },
  { label: 'Choose agencies to send', value: 'specific_agencies' },
  { label: 'Request agency member', value: 'request_for_agency_member' },
];

const publishOptions = [
  { label: 'Now', value: 'now' },
  { label: '24 hrs Before shift starts', value: '24hrs_before' },
  { label: '48 hrs Before shift starts', value: '48hrs_before' },
  { label: '72 hrs Before shift starts', value: '72hrs_before' },
];

interface Organization {
  id: number;
  account_type_id: number;
  industry_type_id: number;
  organization_super_admin_id: string | null;
  company_name: string;
  country: string;
  postal_code: string;
  company_address_line_one: string;
  company_address_line_two: string;
  work_phone: string;
  work_email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface OrganizationBranch {
  id: number;
  branch_name: string;
  organization_id: number;
  location_name: string | null;
  location_address_line_one: string;
  location_address_line_two: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  organization: Organization;
}

interface Position {
  id: number;
  name: string;
  description: string;
  hourly_rate: string;
  position_category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ScheduleSettings {
  id: number;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  organization_id: number;
  default_unpaid_breaks: {
    default_unpaid_break_to: number;
    for_shifts_over_or_exact: number;
  }[];
  organization_branch_id: number;
  positionCustomSettings: any[];
  min_time_between_shifts: number;
  last_pay_period_start_date: string;
  def_over_time_threshold_per_day: number;
  over_time_calculation_period_length: number;
  def_over_time_threshold_per_over_time_period: number;
}

interface OrganizationData {
  id: number;
  shift_id: number;
  organization_branch_id: number;
  organization_id: number;
  is_owner: boolean;
  assigned_by: string;
  publishable_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  organization: Organization;
}

export interface shiftArrayType {
  id: number;
  organization_branch_id: number;
  position_id: number;
  assigned_date: string;
  start_time: string;
  end_time: string;
  unpaid_break: number;
  shift_notes: string;
  is_over_time_allowed: boolean;
  schedule_settings: ScheduleSettings;
  shift_status: string;
  shift_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  organizationBranch: OrganizationBranch;
  organizations: OrganizationData[];
  position: Position;
}

const SendAgencyDrawer = ({
  setDrawer,
  selectedAgency,
  fetchShifts,
}: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAgency: shiftArrayType;
  fetchShifts: any;
}) => {
  console.log(selectedAgency);

  const [selectedOption, setSelectedOption] = useState('all_agencies');
  const [selectedPublish, setSelectedPublish] = useState('now');
  const [summaryPage, setSummaryPage] = useState(false);

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    console.log(selectedOption, selectedPublish);
    setSummaryPage(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      {summaryPage ? (
        <AgencySummary
          setDrawer={setDrawer}
          selectedAgency={selectedAgency}
          setSummaryPage={setSummaryPage}
          selectedOption={selectedOption}
          selectedPublish={selectedPublish}
          fetchShifts={fetchShifts}
        />
      ) : (
        <>
          <div className="mb-5 mt-4 flex items-center justify-between ">
            <h6 className=" flex-1 text-center">Send to Agencies</h6>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setDrawer(false)}
            >
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <div className="space-y-5">
            <p className="text-2xl font-semibold">I want to</p>
            <div className="space-y-2">
              {radioOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={() => handleRadioChange(option.value)}
                    className="form-radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <hr className="my-3 border-t border-gray-300" />
            <div>
              <p className="text-sm font-medium">For when: </p>

              <Select
                size="sm"
                value={selectedPublish}
                onChange={(selected: string) => setSelectedPublish(selected)}
                options={publishOptions}
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  publishOptions.find((b) => b.value === selected)?.label
                }
              />
            </div>
          </div>

          <div className="absolute bottom-5 right-5 flex space-x-2">
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
              onClick={() => handleNext()}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SendAgencyDrawer;
