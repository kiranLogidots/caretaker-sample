import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { IoPersonSharp } from 'react-icons/io5';
import SendAgencyDrawer from './SendAgencyDrawer';
import Spinner from '@/components/ui/spinner';
import ShiftSelectStaffDrawer from './ShiftSelectStaffDrawer';
import { Pagination } from '@mui/material';
import { capitalizeWords } from '@/lib/helperFunctions';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const RecentShifts = ({
  shiftsDataArray,
  fetchShifts,
  loading,
  currentPage,
  onPageChange,
  paginationMeta,
}: {
  shiftsDataArray: any;
  fetchShifts: any;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  paginationMeta: any;
}) => {
  const [agencyDrawer, setAgencyDrawer] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>();
  const [cardDrawer, setCardDrawer] = useState(false);

  const formatDateTime = (start: any, end: any) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    const formattedDate = startTime.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const formattedTime = `${startTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${endTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;

    return `${formattedDate} at ${formattedTime}`;
  };
  return loading ? (
    <Spinner />
  ) : (
    <div className="space-y-5">
      {shiftsDataArray?.map((shifts: any) => (
        <div
          className={`flex w-full justify-between rounded-md border p-4 shadow-md ${
            shifts?.shift_status == 'open' && shifts?.agency_shift
              ? 'cursor-pointer'
              : ''
          }`}
          key={shifts?.id}
          onClick={() => {
            if (shifts?.shift_status == 'open' && shifts?.agency_shift) {
              setCardDrawer(true);
              setSelectedAgency(shifts);
            }
          }}
        >
          <div className="flex w-[50%] items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">Shift #{shifts?.id}</p>
              <div className="flex items-center justify-center rounded-2xl bg-orange-400 text-xs font-medium text-black">
                {capitalizeWords(shifts?.shift_status)}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full  bg-orange-300 text-white">
              <IoPersonSharp size={30} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <p className="text-sm font-bold">
                  {capitalizeWords(shifts?.shift_status)} shift
                </p>
                {shifts?.agency_shift && (
                  <div className="flex items-center justify-center bg-slate-600 px-1 text-center text-xs font-medium text-white">
                    Agency
                  </div>
                )}
                {shifts?.recurrenceGroup && (
                  <div className="flex items-center justify-center bg-slate-600 px-1 text-center text-xs font-medium text-white">
                    Recurring
                  </div>
                )}
              </div>
              <p className="text-sm font-medium">{shifts?.position?.name}</p>
            </div>
          </div>

          <div className="border-l border-gray-400 pr-6"></div>

          <div className="flex w-[50%] items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {formatDateTime(shifts?.start_time, shifts.end_time)}
              </p>
              <p className="text-sm font-medium">
                {shifts?.organizationBranch?.organization?.company_name}
              </p>
            </div>
            {shifts?.shift_status == 'open' && !shifts?.agency_shift && (
              <button
                onClick={() => {
                  setAgencyDrawer(true);
                  setSelectedAgency(shifts);
                }}
                className="rounded-md bg-[#6c5ce7] px-4 py-2 font-medium text-white"
              >
                Send to Agency
              </button>
            )}
          </div>
        </div>
      ))}

      {shiftsDataArray?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            count={paginationMeta.totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            variant="outlined"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      )}
      <Drawer
        size="md"
        isOpen={agencyDrawer ?? false}
        onClose={() => setAgencyDrawer(false)}
        className="z-[99]"
      >
        <SendAgencyDrawer
          setDrawer={setAgencyDrawer}
          selectedAgency={selectedAgency}
          fetchShifts={() => fetchShifts(currentPage)}
        />
      </Drawer>
      <Drawer
        size="md"
        isOpen={cardDrawer ?? false}
        onClose={() => setCardDrawer(false)}
        className="z-[99]"
      >
        <ShiftSelectStaffDrawer
          setDrawer={setCardDrawer}
          selectedAgency={selectedAgency}
          fetchShifts={() => fetchShifts(currentPage)}
        />
      </Drawer>
    </div>
  );
};

export default RecentShifts;
