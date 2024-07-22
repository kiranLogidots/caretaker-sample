'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/staffsApproved/users-table/columns';
import {
  deletePositionCat,
  deletePositions,
  listApprovedStaffs,
  listPositionCat,
  listPositions,
  listStaffs,
  staffStatusChange,
} from '@/service/page';
import {
  CreatePositionCatResponse,
  HKSEvents,
  ListPositionCategoryInterface,
  ListPositionsInterface,
} from '@/types';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';

const FilterElement = dynamic(
  () => import('@/app/shared/staffsApproved/users-table/filter-element'),
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
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
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
        toast.success('Staff deleted succesfully', {
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

  const handleActiveDisable = async (user: any) => {
    try {
      await staffStatusChange({
        user_id: user?.user_id,
        organization_id: user?.organization_id,
      });

      toast.success('Staff status changed', {
        duration: 3000,
      });
      fetchData();
    } catch (error: any) {
      console.log(error);
      toast.success(error.response.data.message, {
        duration: 3000,
      });
    }
  };

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
        handleActiveDisable,
      }),
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      handleActiveDisable,
    ]
  );

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  const fetchData = async () => {
    try {
      const resultData = (await listApprovedStaffs(
        Number(branchId)
      )) as ListPositionsInterface[];
      console.log('result data', resultData);
      setTableData(resultData);
      // setTotalItems(resultData.pagination.totalCount);
    } catch (err: any) {
      console.log('Error response for listing users', err.response);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, [currentPage, pageSize, branchId]);

  function handlePaginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="mt-4">
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
