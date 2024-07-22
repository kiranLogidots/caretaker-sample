'use client';

import { STATUSES, type User } from '@/data/users-data';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { HeaderCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionIcon } from '@/components/ui/action-icon';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import AvatarCard from '@/components/ui/avatar-card';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { HKSEvents } from '@/types';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';

function getStatusBadge(status: User['status']) {
  switch (status) {
    case STATUSES.Deactivated:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />

          <Text className="ms-2 font-medium text-red-dark">{status}</Text>
        </div>
      );
    case STATUSES.Active:
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">{status}</Text>
        </div>
      );
    case STATUSES.Pending:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">{status}</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">{status}</Text>
        </div>
      );
  }
}

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  handleActiveDisable: any;
  checkedItems: string[];
  onDeleteItem: (id: number) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
  handleActiveDisable,
}: Columns) => [
  // {
  //   title: (
  //     <div className="flex items-center gap-3 whitespace-nowrap ps-3">
  //       <Checkbox
  //         title={'Select All'}
  //         onChange={handleSelectAll}
  //         checked={checkedItems.length === data.length}
  //         className="cursor-pointer"
  //       />
  //       User ID
  //     </div>
  //   ),
  //   dataIndex: 'checked',
  //   key: 'checked',
  //   width: 30,
  //   render: (_: any, row: User) => (
  //     <div className="inline-flex ps-3">
  //       <Checkbox
  //         className="cursor-pointer"
  //         checked={checkedItems.includes(row.id)}
  //         {...(onChecked && { onChange: () => onChecked(row.id) })}
  //         label={`#${row.id}`}
  //       />
  //     </div>
  //   ),
  // },
  {
    title: <HeaderCell title="Team member" />,
    onHeaderCell: () => onHeaderCellClick('user.first_name'),
    dataIndex: 'user',
    key: 'user.first_name',
    width: 150,
    render: (user: { first_name: string; last_name: string }) =>
      user.first_name + ' ' + user?.last_name,
  },
  // {
  //   title: <HeaderCell title="Position" />,
  //   onHeaderCell: () => onHeaderCellClick('user.first_name'),
  //   dataIndex: 'user',
  //   key: 'user.first_name',
  //   width: 250,
  //   render: (user: { first_name: string }) =>  user.first_name,

  // },
  {
    title: <HeaderCell title="Employment Status" />,
    onHeaderCell: () => onHeaderCellClick('user.employment_status'),
    dataIndex: 'user',
    key: 'user.employment_status',
    width: 200,
    render: (user: { employment_status: string }) => {
      const statusMap: { [key: string]: string } = {
        part_time: 'Part Time',
        full_time: 'Full Time',
        casual: 'Casual',
        flex: 'Flex',
      };
      return statusMap[user.employment_status] || user.employment_status;
    },
  },
  {
    title: <HeaderCell title="Phone" />,
    onHeaderCell: () => onHeaderCellClick('user.phone'),
    dataIndex: 'user',
    key: 'user.phone',
    width: 200,
    render: (user: { phone: string }) => user.phone,
  },
  {
    title: <HeaderCell title="Email" />,
    onHeaderCell: () => onHeaderCellClick('user.email'),
    dataIndex: 'user',
    key: 'user.email',
    width: 200,
    render: (user: { email: string }) => user.email,
  },
  // {
  //   title: <HeaderCell title="Status" />,
  //   onHeaderCell: () => onHeaderCellClick('inviter.status'),
  //   dataIndex: 'inviter',
  //   key: 'inviter.status',
  //   width: 250,
  //   render: (inviter: { status: string }) =>  inviter.status,

  // },

  {
    title: <HeaderCell title="Actions" />,
    dataIndex: 'action',
    key: 'action',
    width: 140,
    render: (_: string, user: any) => {
      const active = user?.user?.is_active;
      return (
        <div className="justify-en flex items-center gap-3 pe-3">
          {active ? (
            <Tooltip
              size="sm"
              content={'Deactivate user'}
              placement="top"
              color="invert"
            >
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                className="cursor-pointer border-none text-red  hover:text-red-500"
                onClick={() => handleActiveDisable(user)}
              >
                <IoClose className="h-6 w-6" />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip
              size="sm"
              content={'Activate user'}
              placement="top"
              color="invert"
            >
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                className="cursor-pointer border-none text-green  hover:text-green-700"
                onClick={() => handleActiveDisable(user)}
              >
                <TiTick className="h-6 w-6" />
              </ActionIcon>
            </Tooltip>
          )}

          {/* <Tooltip size="sm" content={'Edit Event'} placement="top" color="invert">
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
          >
            <PencilIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip> */}
          {/* <Tooltip size="sm" content={'View Staff Details'} placement="top" color="invert">
          <Link href={routes.eventsHKS.eventDetails(event.id)}>
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
          </Link>
        </Tooltip> */}
          {/* <DeletePopover
          title={`Delete`}
          description={`Are you sure you want to delete this staff ?`}
          onDelete={() => onDeleteItem(event.id)}
        /> */}
        </div>
      );
    },
  },
];
