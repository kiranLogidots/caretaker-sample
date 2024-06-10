'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { Title, Text } from '@/components/ui/text';
import { routes } from '@/config/routes';
import cn from '@/utils/class-names';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const menuItems = [
  // {
  //   name: 'My Profile',
  //   href: routes.profile,
  // },
  {
    name: 'Account Settings',
    href: routes.forms.profileSettings,
  },
  // {
  //   name: 'Activity Log',
  //   href: '#',
  // },
];

function DropdownMenu({ user }: { user: any }) {
  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar
          src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp"
          name={`${user.first_name} ${user.last_name}`}
        />
        <div className="ms-3 flex flex-col flex-wrap text-wrap">
          <Title as="h6" className="font-semibold">
            {`${user.first_name} ${user.last_name}`}
          </Title>
          <Text className="text-gray-600">{`${user.email}`}</Text>
        </div>
      </div>
      <div className="grid px-3.5 py-3.5 font-medium text-gray-700">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-300 px-6 pb-6 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() =>
            signOut({
              callbackUrl: 'http://localhost:3000',
            })
          }
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
}: {
  buttonClassName?: string;
  avatarClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  type User = {
    first_name: string;
    last_name: string;
    email: string;
  };

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    console.log('fetching user');
    const token = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');
    const response = await axios.get(
      `https://api.nexsysi.alpha2.logidots.com/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      <Popover.Trigger>
        <button
          className={cn(
            'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10',
            buttonClassName
          )}
        >
          <Avatar
            src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp"
            name={`${user?.first_name} ${user?.last_name}`}
            className={cn('!h-9 w-9 sm:!h-10 sm:w-10', avatarClassName)}
          />
        </button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
        {user && <DropdownMenu user={user} />}
      </Popover.Content>
    </Popover>
  );
}
