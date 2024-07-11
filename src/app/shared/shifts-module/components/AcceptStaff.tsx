import Spinner from '@/components/ui/spinner';
import Image from 'next/image';
import React, { useState } from 'react';

const AcceptStaff = ({
  setSelectedStaffData,
  selectedStaffData,
  setSelectStaff,
  setDrawer,
}: {
  setSelectedStaffData: any;
  selectedStaffData: any;
  setSelectStaff: any;
  setDrawer: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(
    !selectedStaffData ?? true
  );

  const handleSelect = (data: any) => {
    setSelectedStaffData(data);
    setButtonDisable(false);
  };
  return (
    <div>
      <p className="text-lg font-medium">Select Staff</p>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5].map((number) => (
              <div
                className={`flex cursor-pointer flex-col rounded-md border  shadow-md`}
                key={number}
                onClick={() => handleSelect(number)}
              >
                <div className="relative h-24 w-full">
                  <Image
                    src={
                      'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                    }
                    // src={
                    //   member.profile_pic
                    //     ? member.profile_pic
                    //     : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                    // }
                    alt="memberImage"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-md"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 pb-6 pt-3">
                  <p className="text-xs font-bold text-black">Tom James</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-2">
                  <input
                    type="radio"
                    name="requestMember"
                    value={number}
                    checked={selectedStaffData === number}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelect(number);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-gray-500 px-4 py-2 text-white "
          onClick={() => setDrawer(false)}
          type="button"
        >
          Exit
        </button>
        <button
          className="rounded-md bg-[#6c5ce7] px-4 py-2 text-white disabled:bg-gray-100"
          onClick={() => setSelectStaff(true)}
          type="button"
          disabled={buttonDisable}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AcceptStaff;
