import React from 'react';

const AgencySpecific = ({
  handleSpecificAgencyNext,
}: {
  handleSpecificAgencyNext: any;
}) => {
  return (
    <div>
      {' '}
      <div>AgencySpecific</div>
      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleSpecificAgencyNext()}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgencySpecific;
