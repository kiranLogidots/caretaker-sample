import React from 'react';

const RequestAgencyMember = ({
  handleAgencyMemberNext,
}: {
  handleAgencyMemberNext: any;
}) => {
  return (
    <div>
      <div>RequestAgencyMember</div>
      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleAgencyMemberNext()}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestAgencyMember;
