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

  {
    title: <HeaderCell title="Position Name" />,
    onHeaderCell: () => onHeaderCellClick('position.name'),
    dataIndex: 'position',
    key: 'position.name',
    width: 50,
    render: (position: { name: string }) => position.name,
  },
  {
    title: <HeaderCell title="Position Name" />,
    onHeaderCell: () => onHeaderCellClick('position.description'),
    dataIndex: 'position',
    key: 'position.description',
    width: 50,
    render: (position: { description: string }) => position.description,
  },
  {
    title: <HeaderCell title="Hourly Rate" />,
    onHeaderCell: () => onHeaderCellClick('hourly_rate'),
    dataIndex: 'hourly_rate',
    key: 'hourly_rate',
    width: 50,
    render: (hourly_rate: string) => hourly_rate,
  },
  {
    title: <HeaderCell title="Organization Name" />,
    onHeaderCell: () => onHeaderCellClick('organization.company_name'),
    dataIndex: 'organization',
    key: 'organization.company_name',
    width: 50,
    render: (organization: { company_name: string }) => organization.company_name,
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
  //       {/* <Tooltip size="sm" content={'View Position'} placement="top" color="invert">
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
  //       </Tooltip> */}
  //       <DeletePopover
  //         title={`Delete`}
  //         description={`Are you sure you want to delete this position ?`}
  //         onDelete={() => onDeleteItem(event.id)}
  //       />
  //     </div>
  //   ),
  // },
];
