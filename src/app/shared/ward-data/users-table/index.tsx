'use client';
import { Text } from '@/components/ui/text';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { Button } from '@/components/ui/button';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/ward-data/users-table/columns';
import { deleteEvent, listEventsHKS, listHKS } from '@/service/page';
import { HKSEvents, HKSEventsResponse } from '@/types';
import toast from 'react-hot-toast';
const FilterElement = dynamic(
  () => import('@/app/shared/ward-data/users-table/filter-element'),
  { ssr: false }
);
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

const filterState = {
  role: '',
  status: '',
};

export default function UsersTable({ data = [] }: { data: any[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [tableData, setTableData] = useState<HKSEvents[]>([]);
  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = useCallback(
    async (id: number) => {
      try {
        await deleteEvent(id.toString());

        // Update the table data after successful deletion
        const updatedTableData = tableData.filter((event) => event.id !== id);
        setTableData(updatedTableData);
        // toast.success(<Text>Event deleted succesfully</Text>);
        toast.success('Event deleted succesfully', {
          position: 'top-right',
        });
      } catch (error) {
        toast.error('Failed to delete the event', {
          position: 'top-right',
        });
        console.error('Delete event failed:', error);
      }
      // handleDelete(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [tableData]
  );

  const {
    isLoading,
    isFiltered,
    // tableData,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleDelete,
    handleReset,
  } = useTable(data, pageSize, filterState);
  console.log('TABLE DATA', tableData);
  const columns = useMemo(
    () =>
      getColumns({
        data,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
    ]
  );

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultData = (await listEventsHKS()) as HKSEventsResponse;
        console.log('result data', resultData); // Fetch data from the listHKS API
        setTableData(resultData.data); // Update the table data state with the fetched data
      } catch (err: any) {
        console.log('Error response for listing users', err.response);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  return (
    <div className="mt-14">
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />
      <ControlledTable
        variant="modern"
        data={tableData}
        isLoading={isLoading}
        showLoadingText={true}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        tableFooter={
          <TableFooter
            checkedItems={selectedRowKeys}
            handleDelete={(ids: string[]) => {
              setSelectedRowKeys([]);
              handleDelete(ids);
            }}
          />
        }
        className="overflow-hidden rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
      />
    </div>
  );
}
