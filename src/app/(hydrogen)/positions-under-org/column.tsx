import { ColumnType } from 'antd/lib/table';

interface PositionData {
  name: string;
  hourly_rate: string;
}

export const getColumns = (positions: string[]): ColumnType<PositionData>[] => [
  {
    title: 'Position',
    key: 'position',
    width: 50,
    render: (name?: string) => name,
  },
  {
    title: 'Hourly Rate',
    key: 'hourlyRate',
    dataIndex: 'hourly_rate',
    width: 50,
    render: (hourlyRate?: string) => hourlyRate ? hourlyRate : 'N/A',
  },
];
