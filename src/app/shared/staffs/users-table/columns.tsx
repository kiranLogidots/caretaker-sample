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
    onHeaderCell: () => onHeaderCellClick('user_data.first_name'),
    dataIndex: 'user_data',
    key: 'user_data.first_name',
    width: 250,
    render: (user_data: { first_name: string }) =>  user_data.first_name,

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
    onHeaderCell: () => onHeaderCellClick('inviter.employment_status'),
    dataIndex: 'inviter',
    key: 'inviter.employment_status',
    width: 250,
    render: (inviter: { employment_status: string }) =>  inviter.employment_status,

  },
  {
    title: <HeaderCell title="Phone" />,
    onHeaderCell: () => onHeaderCellClick('user_data.phone'),
    dataIndex: 'user_data',
    key: 'user_data.phone',
    width: 250,
    render: (user_data: { phone: string }) =>  user_data.phone,

  },
  {
    title: <HeaderCell title="Email" />,
    onHeaderCell: () => onHeaderCellClick('user_data.email'),
    dataIndex: 'user_data',
    key: 'user_data.email',
    width: 250,
    render: (user_data: { email: string }) =>  user_data.email,

  },
  {
    title: <HeaderCell title="Status" />,
    onHeaderCell: () => onHeaderCellClick('inviter.status'),
    dataIndex: 'inviter',
    key: 'inviter.status',
    width: 250,
    render: (inviter: { status: string }) =>  inviter.status,

  },



  
  // {
  //   title: <HeaderCell title="Actions" />,
  //   dataIndex: 'action',
  //   key: 'action',
  //   width: 140,
  //   render: (_: string, event: HKSEvents) => (
  //     <div className="justify-en flex items-center gap-3 pe-3">
  //       {/* <Tooltip size="sm" content={'Edit Event'} placement="top" color="invert">
  //         <ActionIcon
  //           as="span"
  //           size="sm"
  //           variant="outline"
  //           className="hover:!border-gray-900 hover:text-gray-700"
  //         >
  //           <PencilIcon className="h-4 w-4" />
  //         </ActionIcon>
  //       </Tooltip> */}
  //       <Tooltip size="sm" content={'View Staff Details'} placement="top" color="invert">
  //         <Link href={routes.eventsHKS.eventDetails(event.id)}>
  //         <ActionIcon
  //           as="span"
  //           size="sm"
  //           variant="outline"
  //           className="hover:!border-gray-900 hover:text-gray-700"
  //         >
  //           <EyeIcon className="h-4 w-4" />
  //         </ActionIcon>
  //         </Link>
  //       </Tooltip>
  //       <DeletePopover
  //         title={`Delete`}
  //         description={`Are you sure you want to delete this staff ?`}
  //         onDelete={() => onDeleteItem(event.id)}
  //       />
  //     </div>
  //   ),
  // },
];
