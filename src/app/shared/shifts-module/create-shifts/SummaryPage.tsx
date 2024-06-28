import React from 'react';
import { Button } from 'rizzui';

const SummaryPage = ({
  summaryData,
  setOpenSummary,
}: {
  summaryData: any;
  setOpenSummary: any;
}) => {
  console.log(summaryData, 'summaryData');
  return (
    <div>
      <Button onClick={() => setOpenSummary(false)}>Back</Button>
    </div>
  );
};

export default SummaryPage;
