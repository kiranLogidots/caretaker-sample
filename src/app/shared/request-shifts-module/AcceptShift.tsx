import Spinner from '@/components/ui/spinner';
import { availableAgencyMembers, selectedAgencyMembers } from '@/service/page';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const AcceptShift = ({ selectedShifts }: { selectedShifts: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const handleCardClick = (user: any) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(user?.id)
        ? prevSelected.filter((id) => id !== user?.id)
        : [...prevSelected, user?.id]
    );
  };

  const handleSubmit = () => {
    console.log('Selected Members:', selectedMembers);
    //  submit logic here
  };

  const fetchSelectedUsers = async () => {
    setLoading(true);

    try {
      const resp = await selectedAgencyMembers(selectedShifts?.id);
      setSelectedUsers(resp?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    setAvailableLoading(true);

    try {
      const resp = await availableAgencyMembers(selectedShifts?.id);
      setAvailableUsers(resp?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setAvailableLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedUsers();
    fetchAvailableUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShifts.id]);

  return (
    <div>
      {selectedUsers.length > 0 && (
        <div>
          <p className="text-lg font-medium">Selected Users</p>
          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            {loading ? (
              <Spinner />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {selectedUsers.map((user) => (
                  <div
                    className={`flex cursor-pointer flex-col rounded-md border  shadow-md`}
                    key={user?.id}
                  >
                    <div className="relative h-24 w-full">
                      <Image
                        src={
                          user?.profile_pic
                            ? user?.profile_pic
                            : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                        }
                        alt="memberImage"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 pb-6 pt-3">
                      <p className="text-xs font-bold text-black">
                        {user?.first_name?.charAt(0).toUpperCase() +
                          user?.first_name.slice(1).toLowerCase()}{' '}
                        {user?.last_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div>
        <p className="text-lg font-medium">Available Users</p>
        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          {availableLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableUsers.length > 0 &&
                availableUsers.map((user) => (
                  <div
                    className={`flex cursor-pointer flex-col rounded-md border  shadow-md`}
                    key={user?.id}
                    onClick={() => handleCardClick(user)}
                  >
                    <div className="relative h-24 w-full">
                      <Image
                        src={
                          user?.profile_pic
                            ? user?.profile_pic
                            : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
                        }
                        alt="memberImage"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 pb-6 pt-3">
                      <p className="text-xs font-bold text-black">
                        {user?.first_name?.charAt(0).toUpperCase() +
                          user?.first_name.slice(1).toLowerCase()}{' '}
                        {user?.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedMembers.includes(user?.id)}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex space-x-2">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
          onClick={handleSubmit}
          type="button"
          disabled={selectedMembers.length === 0}
        >
          Submit
        </button>
      </div>
      <style>{`
        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox {
          position: relative;
          width: 20px;
          height: 20px;
          -webkit-appearance: none;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }

        .checkbox:checked {
          background-color: #007bff;
          border: none;
        }

        .checkbox:checked::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AcceptShift;
