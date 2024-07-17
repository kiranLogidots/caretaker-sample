import React from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { TiArrowLeft } from 'react-icons/ti';
import { CiClock2 } from 'react-icons/ci';
import { LuDot } from 'react-icons/lu';
import moment from 'moment';
import { shiftArrayType } from './SendAgencyDrawer';
import { sendToAgencies } from '@/service/page';
import toast from 'react-hot-toast';
import { Avatar } from '@/components/ui/avatar';

const AgencySummary = ({
  setDrawer,
  selectedAgency,
  setSummaryPage,
  selectedOption,
  selectedPublish,
  fetchShifts,
  selectedRequestMember,
  selectedSpecificAgency,
}: {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setSummaryPage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAgency: shiftArrayType;
  selectedOption: string;
  selectedPublish: string;
  fetchShifts: any;
  selectedRequestMember: any;
  selectedSpecificAgency: any;
}) => {
  const handleSend = async () => {
    let params;

    if (selectedOption === 'all_agencies') {
      params = {
        agency_send_options: selectedOption,
        shift_id: selectedAgency?.id,
        publishable_option: selectedPublish,
      };
    } else if (selectedOption === 'request_for_agency_member') {
      params = {
        agency_send_options: selectedOption,
        shift_id: selectedAgency?.id,
        publishable_option: 'now',
        agency_member_id: selectedRequestMember?.id,
      };
    } else if (selectedOption === 'specific_agencies') {
      params = {
        agency_send_options: selectedOption,
        shift_id: selectedAgency?.id,
        publishable_option: selectedPublish,
        selected_agencies: [{ organization_id: selectedSpecificAgency?.id }],
        // selected_agencies: selectedSpecificAgency?.organizationBranches?.map(
        //   (agency: any) => ({
        //     organization_branch_id: agency.id,
        //     organization_id: agency.organization_id,
        //   })
        // ),
      };
    }

    try {
      await sendToAgencies(params);
      fetchShifts();
      setDrawer(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-2">
      <div className="mb-5 mt-4 flex items-center justify-between ">
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => setSummaryPage(false)}
        >
          <TiArrowLeft className="h-auto w-5" />
        </ActionIcon>
        <h6 className="">Send to Agencies</h6>
        <ActionIcon size="sm" variant="text" onClick={() => setDrawer(false)}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>

      <div className="">
        <h3>Summary</h3>
        <div className="flex items-center gap-1 pt-3 text-xs font-medium">
          <CiClock2 />
          <span>
            {moment(selectedAgency?.assigned_date).format('ddd, MMM D')}
          </span>
          <LuDot />
          <span>{moment(selectedAgency?.start_time).format('h a')}</span>
          <span>-</span>
          <span>{moment(selectedAgency?.end_time).format('h a')}</span>
        </div>
        <div className="pt-3 text-xs font-medium text-black">
          {selectedAgency?.position?.name}
        </div>
      </div>

      <hr className="my-3 border-t border-gray-300" />
      {(selectedOption === 'all_agencies' ||
        selectedOption === 'specific_agencies') && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Open shift</p>
          <div className="w-full space-y-1 rounded-md bg-sky-50 p-3">
            <div className="flex items-center space-x-2">
              <p className="text-xs font-semibold">Send to:</p>
              {selectedOption === 'all_agencies' && (
                <p className="text-xs">Only Dedicated team members</p>
              )}
              {selectedOption === 'specific_agencies' && (
                <p className="text-xs">
                  {selectedSpecificAgency?.company_name}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <p className="text-xs font-semibold">Send out:</p>
              <p className="pl-1 text-xs">
                {selectedPublish === 'now'
                  ? 'Immediately'
                  : selectedPublish === '24hrs_before'
                    ? 'Shift will be sent to agencies 24 hrs before shift time'
                    : selectedPublish === '48hrs_before'
                      ? 'Shift will be sent to agencies 48 hrs before shift time'
                      : 'Shift will be sent to agencies 72 hrs before shift time'}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedOption === 'request_for_agency_member' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Direct Request (1)</p>
          <div className="flex w-full gap-4 rounded-md bg-sky-50 p-3">
            <div className="flex h-16 w-16 items-center rounded-full ">
              <Avatar
                src={
                  selectedRequestMember?.profile_pic
                    ? selectedRequestMember?.profile_pic
                    : `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp`
                }
                name={selectedRequestMember?.first_name}
                className=""
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold">
                {' '}
                {selectedRequestMember?.first_name?.charAt(0).toUpperCase() +
                  selectedRequestMember?.first_name.slice(1).toLowerCase()}{' '}
                {selectedRequestMember?.last_name}
              </p>
              <p className="text-xs font-medium">
                Requests have a 4 hr acceptance window. If not accepted, sent
                to: All available agency members
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleSend()}
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AgencySummary;
