import Spinner from '@/components/ui/spinner';
import { getOpenShiftApplyUsers } from '@/service/page';
import { Pagination } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const AcceptStaff = ({
  setSelectedStaffData,
  selectedStaffData,
  // setSelectStaff,
  handleSubmit,
  setDrawer,
  selectedAgency,
  totalHours,
}: {
  setSelectedStaffData: any;
  selectedStaffData: any;
  // setSelectStaff: any;
  handleSubmit: any;
  setDrawer: any;
  selectedAgency: any;
  totalHours: any;
}) => {
  console.log(selectedAgency, 'selectedGebcydata');
  const [loading, setLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(
    !selectedStaffData ?? true
  );
  const [usersArr, setUsersArr] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<any>();

  const handleSelect = (data: any) => {
    setSelectedStaffData(data);
    setButtonDisable(false);
  };

  const calculateEstimate = () => {
    return totalHours * selectedStaffData?.user?.position?.hourly_rate;
  };

  const fetchAppliedUsers = async (page: number = 1) => {
    setLoading(true);
    const params = {
      page: page,
      limit: 12,
      'filter.shift_id': selectedAgency?.id,
      'filter.status': 'pending',
      'filter.position_id': selectedAgency?.position?.id,
    };
    try {
      const resp = await getOpenShiftApplyUsers(params);
      setUsersArr(resp?.data);
      setPaginationMeta(resp?.meta);
      console.log(resp, 'selectedAgency');
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgency.id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAppliedUsers(page);
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-white px-4">
        <p className="text-lg font-bold">Agency Members</p>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {usersArr?.length == 0 && <div>No Staff found</div>}
            <div className="grid grid-cols-3 gap-2">
              {usersArr?.map((appliedUser) => (
                <div
                  className={`flex cursor-pointer flex-col rounded-md border  shadow-md`}
                  key={appliedUser?.id}
                  onClick={() => handleSelect(appliedUser)}
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={
                        appliedUser?.user?.profile_pic
                          ? appliedUser?.user?.profile_pic
                          : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                      }
                      alt="memberImage"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-md"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <p className="text-xs font-bold text-black">
                      {appliedUser?.user?.first_name}{' '}
                      {appliedUser?.user?.last_name}
                    </p>
                    <p className="text-xs font-medium">
                      {
                        appliedUser?.user?.organizationUser?.organization
                          ?.company_name
                      }
                    </p>
                    <p className="text-xs">
                      {appliedUser?.user?.position?.hourly_rate}/hr
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2">
                    <input
                      type="radio"
                      name="requestMember"
                      value={appliedUser?.id}
                      checked={selectedStaffData?.id === appliedUser?.id}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(appliedUser);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {usersArr?.length > 12 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  count={paginationMeta?.totalPages}
                  page={currentPage}
                  onChange={(event, page) => handlePageChange(page)}
                  variant="outlined"
                  shape="rounded"
                  siblingCount={1}
                  boundaryCount={1}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="sticky bottom-0 z-10 flex w-full justify-end gap-5 bg-white p-4">
        <div className="flex w-full items-center justify-between">
          <div className="font-medium">
            {selectedStaffData && 'Estimated payout: $ ' + calculateEstimate()}
          </div>
          <div>
            {/* <button
              className="rounded-md bg-gray-500 px-6 py-2 text-white "
              onClick={() => setDrawer(false)}
              type="button"
            >
              Exit
            </button> */}
            <button
              className="rounded-md bg-[#6c5ce7] px-4 py-2 text-white disabled:bg-gray-100"
              onClick={() => handleSubmit()}
              // onClick={() => setSelectStaff(true)}
              type="button"
              disabled={buttonDisable}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptStaff;
