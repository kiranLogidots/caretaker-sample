'use client';

import React, { useState } from 'react';
import CreateShifts from './CreateShifts';
import SummaryPage from './SummaryPage';

const CreateShiftsIndex = () => {
  const [openSummary, setOpenSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  return (
    <div className="mt-8 h-full w-full space-y-5">
      {openSummary ? (
        <div>
          <SummaryPage
            summaryData={summaryData}
            setOpenSummary={setOpenSummary}
          />
        </div>
      ) : (
        <CreateShifts
          setOpenSummary={setOpenSummary}
          setSummaryData={setSummaryData}
          summaryData={summaryData}
        />
      )}
    </div>
  );
};

export default CreateShiftsIndex;
