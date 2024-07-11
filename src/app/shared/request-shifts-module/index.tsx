'use client';

import React, { useEffect, useState } from 'react';
import { Text, Title } from '@/components/ui/text';
import { Select } from 'rizzui';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { listOrgPositions } from '@/service/page';
import dynamic from 'next/dynamic';
import ShiftProceedDrawer from './ShiftProceedDrawer';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const RequestShiftsModule = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [positions, setPositions]: any = useState([]);
  const [selectedPositionArr, setSelectedPositionArr] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState(null);
  const [proceedDrawer, setProceedDrawer] = useState(false);

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
      <div className="space-y-5">
        <div
          onClick={() => setProceedDrawer(true)}
          className="flex w-full cursor-pointer justify-between rounded-md border p-4 shadow-md"
        >
          <div className="flex w-[50%] items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Flutter</p>
              {/* <p className="text-sm font-medium">{shifts?.position?.name}</p> */}
            </div>
          </div>

          <div className="border-l border-gray-400 pr-6"></div>

          <div className="flex w-[50%] items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {/* {formatDateTime(shifts?.start_time, shifts.end_time)} */}
                Fri, Jul 26 at 8:00 AM - 5:00 PM
              </p>
              <p className="text-sm font-medium">Logidots technology</p>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        size="md"
        isOpen={proceedDrawer ?? false}
        onClose={() => setProceedDrawer(false)}
        className="z-[99]"
      >
        <ShiftProceedDrawer setDrawer={setProceedDrawer} />
      </Drawer>
    </div>
  );
};

export default RequestShiftsModule;
