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
    title: <HeaderCell title="PickUp Date" />,
    dataIndex: 'name',
    key: 'fullName',
    width: 250,
    hidden: 'fullName',
    // render: (_: string, user: User) => (
    //   <AvatarCard
    //     src={user.avatar}
    //     name={user.fullName}
    //     description={user.email}
    //   />
    // ),
  },
  {
    title: <HeaderCell title="PickUp Point" />,
    onHeaderCell: () => onHeaderCellClick('expense'),
    dataIndex: 'expense',
    key: 'expense',
    width: 250,
    render: (expense: number) => expense,
  },
  {
    title: <HeaderCell title="Driver Name" />,
    onHeaderCell: () => onHeaderCellClick('driver_data.name'),
    dataIndex: 'driver_data.name',
    key: 'driver_data.name',
    width: 250,
    render: (expense: number) => expense,
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
  {
    title: <HeaderCell title="Status" />,
    onHeaderCell: () => onHeaderCellClick('expense'),
    dataIndex: 'no_of_participants',
    key: 'no_of_participants',
    width: 250,
    render: (no_of_participants: number) => no_of_participants,
  },
 
  {
    title: <HeaderCell title="Actions" />,
    dataIndex: 'action',
    key: 'action',
    width: 140,
    render: (_: string, event: HKSEvents) => (
      <div className="justify-en flex items-center gap-3 pe-3">
        <Tooltip size="sm" content={'Edit User'} placement="top" color="invert">
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
          >
            <PencilIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
        {/* <Tooltip size="sm" content={'View User'} placement="top" color="invert">
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip> */}
        <DeletePopover
          title={`Delete this user`}
          description={`Are you sure you want to delete this event ?`}
          onDelete={() => onDeleteItem(event.id)}
        />
      </div>
    ),
  },
];
