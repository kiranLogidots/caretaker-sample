'use client';

import React, { useEffect, useState } from 'react';
import { Text, Title } from '@/components/ui/text';
import { Select } from 'rizzui';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { getOpenShifts, listOrgPositions } from '@/service/page';
import dynamic from 'next/dynamic';
import ShiftProceedDrawer from './ShiftProceedDrawer';
import { Pagination } from '@mui/material';
import Spinner from '@/components/ui/spinner';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const RequestShiftsModule = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [positions, setPositions]: any = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState<any>({
    label: 'All',
    value: 0,
  });

  const [selectedPositionId, setSelectedPositionId] = useState(0);
  const [proceedDrawer, setProceedDrawer] = useState(false);
  const [shiftsDataArray, setShiftsDataArray] = useState<any>([]);
  const [selectedShifts, setSelectedShifts] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<any>();
  const perPage = 10;

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

  const fetchPositions = async () => {
    setPositions([]);
    setSelectedPositionId(0);

    let response = await listOrgPositions(Number(branchId));

    if (response == undefined) return;

    const transformedArray = response?.map((item: any) => ({
      label: item?.position?.name,
      value: item?.position?.id,
    }));

    // Add "All" option at the beginning
    const positionsWithAll = [{ label: 'All', value: 0 }, ...transformedArray];

    setPositions(positionsWithAll);

    if (positionsWithAll.length > 0) {
      setSelectedPositionArr(positionsWithAll[0]);
      setSelectedPositionId(positionsWithAll[0].value);
    }
  };

  const fetchShifts = async (page: number = 1) => {
    setLoading(true);
    const params = {
      branchId: branchId,
      is_owner: true,
      page: page,
      perPage: perPage,
      positionId: selectedPositionId,
      // status: 'open',
    };

    try {
      const resp = await getOpenShifts(params);
      setShiftsDataArray(resp?.data);
      setPaginationMeta(resp?.meta);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchShifts(page);
  };

  useEffect(() => {
    fetchShifts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, currentPage, selectedPositionId]);

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 @container">
        <Title as="h2" className="-order-6 basis-2/5 @xl:basis-auto">
          Request Shifts
        </Title>
      </div>
      <div className="mb-4 w-72">
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
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="space-y-4">
            {shiftsDataArray?.map((shifts: any) => (
              <div
                key={shifts?.id}
                onClick={() => {
                  setProceedDrawer(true);
                  setSelectedShifts(shifts);
                }}
                className="flex w-full cursor-pointer justify-between rounded-md border p-4 shadow-md"
              >
                <div className="flex w-[50%] items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {shifts?.position?.name}
                    </p>
                  </div>
                </div>

                <div className="border-l border-gray-400 pr-6"></div>

                <div className="flex w-[50%] items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {formatDateTime(shifts?.start_time, shifts?.end_time)}
                    </p>
                    <p className="text-sm font-medium">
                      {shifts?.organizationBranch?.organization?.company_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shiftsDataArray?.length > 0 && (
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
      <Drawer
        size="md"
        isOpen={proceedDrawer ?? false}
        onClose={() => setProceedDrawer(false)}
        className="z-[99]"
      >
        <ShiftProceedDrawer
          setDrawer={setProceedDrawer}
          selectedShifts={selectedShifts}
        />
      </Drawer>
    </div>
  );
};

export default RequestShiftsModule;
