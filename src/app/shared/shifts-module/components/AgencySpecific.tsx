import Spinner from '@/components/ui/spinner';
import { getSpecificAgency } from '@/service/page';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AgencySpecific = ({
  handleSpecificAgencyNext,
  selectedSpecificAgency,
  setSelectedSpecificAgency,
}: {
  handleSpecificAgencyNext: any;
  selectedSpecificAgency: any;
  setSelectedSpecificAgency: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [agencyArray, setAgencyArray] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(
    !selectedSpecificAgency?.id ?? true
  );

  useEffect(() => {
    const fetchAgency = async () => {
      setLoading(true);
      try {
        const resp = await getSpecificAgency();
        setAgencyArray(resp?.data);
        console.log(resp);
      } catch (error: any) {
        console.log(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, []);

  return (
    <div className="relative flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-white p-4">
        <p className="text-lg font-bold">Choose Agency</p>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {agencyArray.length > 0 ? (
              agencyArray.map((agency: any) => (
                <div
                  className="flex cursor-pointer flex-col rounded-md border border-gray-100 shadow-md"
                  key={agency?.id}
                  onClick={() => {
                    setSelectedSpecificAgency(agency);
                    setButtonDisable(false);
                  }}
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={
                        agency.profile_pic
                          ? agency.profile_pic
                          : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                      }
                      alt="memberImage"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-md"
                    />
                  </div>
                  <div className="flex flex-grow flex-col gap-2 px-1 py-3">
                    <p className="text-xs font-bold text-black">
                      {agency?.company_name}
                    </p>
                  </div>
                  <div className="flex items-center bg-gray-50 p-2">
                    <input
                      type="radio"
                      name="agencyName"
                      value={selectedSpecificAgency?.id}
                      checked={selectedSpecificAgency?.id === agency?.id}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedSpecificAgency(agency);
                        setButtonDisable(false);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No agency found
              </div>
            )}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 z-10 flex w-full justify-end bg-white p-4">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-100"
          onClick={() => handleSpecificAgencyNext()}
          type="button"
          disabled={buttonDisable}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgencySpecific;
