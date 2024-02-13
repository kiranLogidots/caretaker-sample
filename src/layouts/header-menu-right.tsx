import { Badge } from '@/components/ui/badge';
import { ActionIcon } from '@/components/ui/action-icon';
import MessagesDropdown from '@/layouts/messages-dropdown';
import NotificationDropdown from '@/layouts/notification-dropdown';
import ProfileMenu from '@/layouts/profile-menu';
import SettingsButton from '@/components/settings/settings-button';
import RingBellSolidIcon from '@/components/icons/ring-bell-solid';
import ChatSolidIcon from '@/components/icons/chat-solid';
import { Engagespot } from '@engagespot/react-component';

export default function HeaderMenuRight() {
  const theme = {
    colors: {
      colorPrimary: 'black',
    },
    notificationButton: {
      background: '',
      hoverBackground:'teal',
      iconFill:'black'
    },
    
  };

  return (
    <div className="mr-0 flex items-end justify-end gap-8">
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
      <Engagespot
        apiKey="b1vxvkz6m5txxwsas37nr"
        userId="unique-id-of-your-user"
        userToken="Required if secure auth is enabled on your Engagespot app"
        theme={theme}
      />
      {/* <SettingsButton /> */}
      <ProfileMenu />
    </div>
  );
}
