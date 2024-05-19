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
    title: <HeaderCell title="Name" />,
    dataIndex: 'name',
    key: 'name',
    width: 250,
    // hidden: 'name',
    // render: (_: string, user: User) => (
    //   <AvatarCard
    //     src={user.avatar}
    //     name={user.fullName}
    //     description={user.email}
    //   />
    // ),
  },
  {
    title: <HeaderCell title="Description" />,
    onHeaderCell: () => onHeaderCellClick('description'),
    dataIndex: 'description',
    key: 'description',
    width: 250,
    render: (description: string) => description,
  },

  // {
  //   title: (
  //     <HeaderCell
  //       title="Date"
  //       sortable
  //       ascending={
  //         sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
  //       }
  //     />
  //   ),
  //   onHeaderCell: () => onHeaderCellClick('date'),
  //   dataIndex: 'date',
  //   key: 'date',
  //   width: 200,
  //   render: (value: Date) => <DateCell date={value} />,
  // },
  // {
  //   title: <HeaderCell title="No of Participants" />,
  //   onHeaderCell: () => onHeaderCellClick('expense'),
  //   dataIndex: 'no_of_participants',
  //   key: 'no_of_participants',
  //   width: 250,
  //   render: (no_of_participants: number) => no_of_participants,
  // },
  // {
  //   title: <HeaderCell title="Organised By" />,
  //   dataIndex: 'organised_by',
  //   key: 'organised_by',
  //   width: 250,
  //   hidden: 'organised_by',
  // },
  // {
  //   title: <HeaderCell title="Permissions" />,
  //   dataIndex: 'permissions',
  //   key: 'permissions',
  //   width: 200,
  //   render: (permissions: User['permissions'][]) => (
  //     <div className="flex items-center gap-2">
  //       {permissions.map((permission) => (
  //         <Badge
  //           key={permission}
  //           rounded="lg"
  //           variant="outline"
  //           className="border-muted font-normal text-gray-500"
  //         >
  //           {permission}
  //         </Badge>
  //       ))}
  //     </div>
  //   ),
  // },
  // {
  //   title: <HeaderCell title="Status" />,
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 120,
  //   render: (status: User['status']) => getStatusBadge(status),
  // },
  {
    title: <HeaderCell title="Actions" />,
    dataIndex: 'action',
    key: 'action',
    width: 140,
    render: (_: string, event: HKSEvents) => (
      <div className="justify-en flex items-center gap-3 pe-3">
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
        <Tooltip size="sm" content={'View Position Category'} placement="top" color="invert">
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
        </Tooltip>
        <DeletePopover
          title={`Delete`}
          description={`Are you sure you want to delete this position category ?`}
          onDelete={() => onDeleteItem(event.id)}
        />
      </div>
    ),
  },
];
