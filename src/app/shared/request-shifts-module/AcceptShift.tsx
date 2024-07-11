import Spinner from '@/components/ui/spinner';
import Image from 'next/image';
import React, { useState } from 'react';

const AcceptShift: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleCardClick = (number: number) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(number)
        ? prevSelected.filter((id) => id !== number)
        : [...prevSelected, number]
    );
  };

  const handleSubmit = () => {
    console.log('Selected Members:', selectedMembers);
    // Your submit logic here
  };

  return (
    <div>
      <p className="text-lg font-medium">Request Member</p>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5].map((number) => (
              <div
                className={`flex cursor-pointer flex-col rounded-md border  shadow-md`}
                key={number}
                onClick={() => handleCardClick(number)}
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
                    type="checkbox"
                    checked={selectedMembers.includes(number)}
                    readOnly
                  />
                  <p className="text-sm font-semibold">Request</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={handleSubmit}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AcceptShift;
