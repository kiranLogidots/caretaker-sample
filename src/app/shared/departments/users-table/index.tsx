'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/departments/users-table/columns';
import { deletePositions, listPositions } from '@/service/page';
import { ListPositionsInterface } from '@/types';
import toast from 'react-hot-toast';
const FilterElement = dynamic(
  () => import('@/app/shared/departments/users-table/filter-element'),
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
  const [tableData, setTableData] = useState<ListPositionsInterface[]>([]);
  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const onDeleteItem = useCallback(
    async (id: number) => {
      try {
        await deletePositions(id.toString());

        const updatedTableData = tableData.filter((event) => event.id !== id);
        setTableData(updatedTableData);
        toast.success('Position deleted succesfully', {
          position: 'top-right',
        });
      } catch (error) {
        toast.error('Failed to delete the position', {
          position: 'top-right',
        });
        console.error('Delete position failed:', error);
      }
    },
    [tableData]
  );

  const {
    isLoading,
    isFiltered,
    // tableData,
    // currentPage,
    // totalItems,
    // handlePaginate,
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
        const resultData = (await listPositions()) as ListPositionsInterface[];
        console.log('result data', resultData); // Fetch data from the listHKS API
        setTableData(resultData);
        // setTotalItems(resultData.pagination.totalCount);
      } catch (err: any) {
        console.log('Error response for listing users', err.response);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [currentPage, pageSize]);
  function handlePaginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

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
          onChange: handlePaginate,
          // onChange: (page: number) => handlePaginate(page),
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
