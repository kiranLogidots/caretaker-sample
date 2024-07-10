'use client';

import React, { useEffect, useState } from 'react';
import CreateShifts from './CreateShifts';
import SummaryPage from './SummaryPage';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { getSchedulingSettings } from '@/service/page';

const CreateShiftsIndex = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [openSummary, setOpenSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [scheduleSettings, setScheduleSettings] = useState({});

  useEffect(() => {
    const fetchScheduleSettings = async () => {
      try {
        const response = await getSchedulingSettings(Number(branchId));
        setScheduleSettings(response);
      } catch (error) {
        console.error('Failed to fetch scheduling settings:', error);
      }
    };

    fetchScheduleSettings();
  }, [branchId]);

  return (
    <div className="mt-8 h-full w-full space-y-5">
      {openSummary ? (
        <SummaryPage
          summaryData={summaryData}
          setOpenSummary={setOpenSummary}
          scheduleSettings={scheduleSettings}
        />
      ) : (
        <CreateShifts
          setOpenSummary={setOpenSummary}
          setSummaryData={setSummaryData}
          summaryData={summaryData}
          scheduleSettings={scheduleSettings}
        />
      )}
    </div>
  );
};

export default CreateShiftsIndex;
