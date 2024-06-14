'use client';

import { HeaderCell } from '@/components/ui/table';

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
    title: <HeaderCell title="Name" />,
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (_: any, positions: any) => {
      console.log(positions, 'positiondata');

      return <div>{positions?.position?.name}</div>;
    },
  },
  // {
  //   title: <HeaderCell title="Description" />,
  //   dataIndex: 'description',
  //   key: 'description',
  //   width: 150,
  //   // render: (_: any, positions: any) => <p>{positions?.description?.name}</p>,
  //   render: (position_id: string) => position_id,
  // },

  {
    title: <HeaderCell title="Hourly Rate" />,
    dataIndex: 'hourly_rate',
    key: 'hourly_rate',
    width: 150,
    render: (hourly_rate: string) => hourly_rate,
  },
];
