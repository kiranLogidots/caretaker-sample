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
import TrashIcon from '@/components/icons/trash';
import AvatarCard from '@/components/ui/avatar-card';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';

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
  onDeleteItem: (id: string) => void;
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
    title: (
      <HeaderCell
        title="Company Name"
        // sortable
        // ascending={
        //   sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
        // }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('address'),
    dataIndex: 'company_name',
    key: 'company_name',
    width: 50,
    render: (company_name: string) => company_name,
  },

  // {
  //   title: <HeaderCell title="Name" />,
  //   dataIndex: 'name',
  //   key: 'first_name',
  //   width: 250,
  //   hidden: 'first_name',
  //   // render: (_: string, user: User) => (
  //   //   <AvatarCard
  //   //     src={user.avatar}
  //   //     name={user.fullName}
  //   //     description={user.email}
  //   //   />
  //   // ),
  // },
  // {
  //   title: <HeaderCell title="Company Email" />,
  //   onHeaderCell: () => onHeaderCellClick('email'),
  //   dataIndex: 'email',
  //   key: 'email',
  //   width: 250,
  //   render: (email: string) => email,
  // },

  {
    title: <HeaderCell title="Work Email" />,
    onHeaderCell: () => onHeaderCellClick('work_email'),
    dataIndex: 'work_email',
    key: 'work_email',
    width: 30,
    render: (work_email: string) => work_email,
  },

  {
    title: <HeaderCell title="Phone" />,
    onHeaderCell: () => onHeaderCellClick('phone'),
    dataIndex: 'work_phone',
    key: 'work_phone',
    width: 30,
    render: (work_phone: string) => work_phone,
  },
  {
    title: <HeaderCell title="Industry Type" />,
    onHeaderCell: () => onHeaderCellClick('industryType.name'),
    dataIndex: 'industryType',
    key: 'industryType.name',
    width: 50,
    render: (industryType: { name: string }) => industryType.name,
  },

  // {
  //   title: (
  //     <HeaderCell
  //       title="Created"
  //       sortable
  //       ascending={
  //         sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
  //       }
  //     />
  //   ),
  //   onHeaderCell: () => onHeaderCellClick('created_at'),
  //   dataIndex: 'created_at',
  //   key: 'created_at',
  //   width: 10,
  //   render: (value: Date) => <DateCell date={value} />,
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
  // {
  //   title: <HeaderCell title="Actions" />,
  //   dataIndex: 'action',
  //   key: 'action',
  //   width: 50,
  //   render: (_: string, user: User) => (
  //     <div className="justify-en flex items-center gap-3 pe-3">
  //       <Tooltip size="sm" content={'Edit User'} placement="top" color="invert">
  //         <ActionIcon
  //           as="span"
  //           size="sm"
  //           variant="outline"
  //           className="hover:!border-gray-900 hover:text-gray-700"
  //         >
  //           <PencilIcon className="h-4 w-4" />
  //         </ActionIcon>
  //       </Tooltip>

  //       {/* When View user is clicked, open a drawyer which will display all the form field with the data in it , but users cant edit it, only view it like this - <DrawerButton
  //           label="Add New Organization"
  //           view={<CreateUser />}
  //           customSize="500px"
  //           placement="right"
  //         /> */}

  //       <Tooltip size="sm" content={'View User'} placement="top" color="invert">
  //         <ActionIcon
  //           as="span"
  //           size="sm"
  //           variant="outline"
  //           className="hover:!border-gray-900 hover:text-gray-700"
  //         >
  //           <EyeIcon className="h-4 w-4" />
  //         </ActionIcon>
  //       </Tooltip>

       
  //       {/* <DeletePopover
  //         title={`Delete this user`}
  //         description={`Are you sure you want to delete this #${user.id} user?`}
  //         onDelete={() => onDeleteItem(user.id)}
  //       /> */}
  //     </div>
  //   ),
  // },
];
