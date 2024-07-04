import Spinner from '@/components/ui/spinner';
import { getRequestAgencyMember } from '@/service/page';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const RequestAgencyMember = ({
  handleAgencyMemberNext,
  setSelectedRequestMember,
  selectedRequestMember,
  positionId,
  totalHours,
}: {
  handleAgencyMemberNext: any;
  setSelectedRequestMember: React.Dispatch<React.SetStateAction<any>>;
  selectedRequestMember: any;
  positionId: number;
  totalHours: any;
}) => {
  // const [enabled, setEnabled] = useState(false);
  const [agencyMemberArray, setAgencyMemberArray] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(
    !selectedRequestMember?.id ?? true
  );

  const [loading, setLoading] = useState(false);

  const calculateEstimate = () => {
    const estimateAmount = selectedRequestMember?.userPositions.map(
      (position: any) =>
        position?.position_id == positionId
          ? parseFloat(position.hourly_rate)
          : ''
    );

    return totalHours * estimateAmount[0];
  };

  useEffect(() => {
    const fetchRequestAgency = async () => {
      setLoading(true);
      try {
        const resp = await getRequestAgencyMember({ position_id: positionId });
        setAgencyMemberArray(resp?.data);
        console.log(resp);
      } catch (error: any) {
        console.log(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAgency();
  }, [positionId]);

  return (
    <div className="relative flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-white p-4">
        <p className="text-lg font-bold">Request Agency Member</p>
      </div>
      {/* <div className="flex items-center justify-between bg-gray-50 p-3">
        <p className="text-xs">
          <span className="font-medium">Send to:</span> Only dedicated team
          member
        </p>
        <Switch
          checked={enabled}
          onChange={(value: boolean) => setEnabled(value)}
          className={`${
            enabled ? 'bg-gray-600' : 'bg-gray-200'
          } group inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
          />
        </Switch>
      </div> */}
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {agencyMemberArray.length > 0 ? (
              agencyMemberArray.map((member: any) => (
                <div
                  className="flex cursor-pointer flex-col rounded-md border border-gray-100 shadow-md"
                  key={member?.id}
                  onClick={() => {
                    setSelectedRequestMember(member);
                    setButtonDisable(false);
                  }}
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={
                        member.profile_pic
                          ? member.profile_pic
                          : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                      }
                      alt="memberImage"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-md"
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-2 pb-6 pt-3">
                    <p className="text-xs font-bold text-black">
                      {member?.first_name?.charAt(0).toUpperCase() +
                        member?.first_name.slice(1).toLowerCase()}{' '}
                      {member?.last_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {member?.organizationUsers[0]?.branch?.branch_name}
                    </p>

                    {member?.userPositions.map((position: any) =>
                      position?.position_id == positionId ? (
                        <p
                          key={position?.id}
                          className="text-xs font-medium text-black "
                        >
                          ${position.hourly_rate}/hr
                        </p>
                      ) : (
                        ''
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2">
                    <input
                      type="radio"
                      name="requestMember"
                      value={selectedRequestMember?.id}
                      checked={selectedRequestMember?.id === member?.id}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedRequestMember(member);
                        setButtonDisable(false);
                      }}
                    />
                    <p className="text-sm font-semibold">Request</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No agency member found
              </div>
            )}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 z-10 w-full bg-white p-4">
        <div className="flex w-full items-center justify-between">
          <div className="font-medium">
            {selectedRequestMember &&
              'Estimated payout: $ ' + calculateEstimate()}
          </div>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-100"
            onClick={() => handleAgencyMemberNext()}
            type="button"
            disabled={buttonDisable}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAgencyMember;
