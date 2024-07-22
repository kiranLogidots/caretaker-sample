import { Badge } from '@/components/ui/badge';
import { ActionIcon } from '@/components/ui/action-icon';
import MessagesDropdown from '@/layouts/messages-dropdown';
import NotificationDropdown from '@/layouts/notification-dropdown';
import ProfileMenu from '@/layouts/profile-menu';
import SettingsButton from '@/components/settings/settings-button';
import RingBellSolidIcon from '@/components/icons/ring-bell-solid';
import ChatSolidIcon from '@/components/icons/chat-solid';
import { Engagespot } from '@engagespot/react-component';
import Image from 'next/image';
import NotiEmptyImage from '../../public/noti.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select } from 'rizzui';
import { useEffect, useState } from 'react';
import { listUserBranches } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { getUserRoles } from '@/lib/helperFunctions';

export default function HeaderMenuRight() {
  const [selectedUserBranch, setSelectedUserBranch] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useAtom(selectedBranchAtom);
  const userRoles = getUserRoles();
  const userRole = userRoles.length ? userRoles[0].name : null;

  const theme = {
    colors: {
      colorPrimary: 'black',
    },
    notificationButton: {
      background: '',
      hoverBackground: '',
      iconFill: 'black',
    },
  };

  const fetchUserBranches = async () => {
    try {
      const response = await listUserBranches();
      const resultData = response?.data;

      const transformedArray = resultData.map((item: any) => ({
        label: item.branch.branch_name,
        value: item.branch.id,
      }));
      // Check if there's a saved branch in local storage
      const savedBranch: any = JSON.parse(
        localStorage.getItem('selectedBranch') || '{}'
      );

      setUserBranches(transformedArray);
      const initialBranch =
        transformedArray.find(
          (branch: any) => branch.value === savedBranch.value
        ) || transformedArray[0];
      setSelectedUserBranch(initialBranch);
      setSelectedBranch(initialBranch);
      // setUserBranches(transformedArray);
      // setSelectedUserBranch(transformedArray[0]);
      // setSelectedBranch(transformedArray[0]);
    } catch (err: any) {
      console.log('Error message ', err.response.data.message);
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));
  }, [selectedBranch]);

  useEffect(() => {
    fetchUserBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mr-0 flex w-1/2 items-end justify-end gap-4">
      {/* "ms-auto grid shrink-0 grid-cols-4 items-end justify-end right-0 gap-2 text-gray-700 xs:gap-3 xl:gap-4" */}
      {/* <MessagesDropdown>
        <ActionIcon
          aria-label="Messages"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
        >
          <ChatSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="success"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon>
      </MessagesDropdown> */}
      {/* <NotificationDropdown>
        <ActionIcon
          aria-label="Notification"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
        >
          <RingBellSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon>
      </NotificationDropdown> */}
      <div
        className={`flex  gap-3 ${
          userRole === 'agency_admin' ? 'w-[50%]' : 'w-full'
        }`}
      >
        <Select
          value={selectedUserBranch}
          // onChange={setSelectedUserBranch}
          onChange={(selected: any) => {
            setSelectedUserBranch(selected);
            setSelectedBranch(selected);
          }}
          options={userBranches}
          placeholder="Select Department"
          optionClassName="z-[100]"
          style={{ width: '50%', zIndex: 100 }}
        />
        {!(userRole === 'agency_admin') && (
          <Link href={`/event-calendar`} className="flex w-[50%]">
            <Button
              as="span"
              className="w-full bg-[#6c5ce7] text-xs text-white"
            >
              Create shift
            </Button>
          </Link>
        )}
      </div>
      <Engagespot
        apiKey="b1vxvkz6m5txxwsas37nr"
        userId="admin@caretaker.com"
        // userToken="Required if secure auth is enabled on your Engagespot app"
        theme={theme}
        renderEmptyPlaceholderImage={() => {
          return (
            <div className="flex flex-col items-center justify-center gap-3">
              <Image
                src={NotiEmptyImage}
                alt="Noti Image"
                width={200}
                height={200}
              />
              <h1 className="text-3xl font-bold ">You are all up to date</h1>
              <p className="text-sm">
                New notification will appear here whenever there is activity
              </p>
            </div>
          );
        }}
      />
      {/* <SettingsButton /> */}
      <ProfileMenu />
    </div>
  );
}
