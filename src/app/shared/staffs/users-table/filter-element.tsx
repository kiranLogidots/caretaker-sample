'use client';

import {
  PiTrashDuotone,
  PiMagnifyingGlassBold,
  PiArrowLineDownBold,
  PiArrowLineUpBold,
} from 'react-icons/pi';
import StatusField from '@/components/controlled-table/status-field';
import { Text, Title } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STATUSES } from '@/data/users-data';
import { rolesList } from '@/data/roles-permissions';
import { Input } from '@/components/ui/input';
import ModalButton from '@/app/shared/modal-button';
import CreateUser from '@/app/shared/staffs/create-user';
import DrawerButton from '../../drawer-button';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import FileUploadDrawer from './FileUploadDrawer';
import { LuUpload } from 'react-icons/lu';

const Drawer = dynamic(
  () => import('@/components/ui/drawer').then((module) => module.Drawer),
  { ssr: false }
);

const statusOptions = [
  {
    value: STATUSES.Active,
    label: STATUSES.Active,
  },
  {
    value: STATUSES.Deactivated,
    label: STATUSES.Deactivated,
  },
  {
    value: STATUSES.Pending,
    label: STATUSES.Pending,
  },
];

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  fetchData?: any;
};

const roles = rolesList.map((role) => ({
  label: role.name,
  value: role.name,
}));

export default function FilterElement({
  isFiltered,
  handleReset,
  filters,
  updateFilter,
  onSearch,
  searchTerm,
  fetchData,
}: FilterElementProps) {
  const [importDrawer, setImportDrawer] = useState(false);
  return (
    <>
      <div className="relative z-50 mb-4 flex flex-wrap items-center justify-between gap-2.5 @container ">
        <Title as="h5" className="-order-6 basis-2/5 @xl:basis-auto">
          Invited Staffs
        </Title>

        {/* <StatusField
          className=" -order-3 w-full @[25rem]:w-[calc(calc(100%_-_10px)_/_2)] @4xl:-order-5 @4xl:w-auto"
          options={statusOptions}
          value={filters['status']}
          onChange={(value: string) => {
            updateFilter('status', value);
          }}
          placeholder="Filter by Status"
          getOptionValue={(option) => option.value}
          getOptionDisplayValue={(option) =>
            renderOptionDisplayValue(option.value as string)
          }
          displayValue={(selected: string) =>
            renderOptionDisplayValue(selected)
          }
        /> */}

        {/* <StatusField
          options={roles}
          value={filters['role']}
          placeholder="Filter by Role"
          className=" @4xl:-auto -order-2 w-full @[25rem]:w-[calc(calc(100%_-_10px)_/_2)] @4xl:-order-4 @4xl:w-auto"
          dropdownClassName="w-48"
          getOptionValue={(option) => option.value}
          onChange={(value: string) => {
            updateFilter('role', value);
          }}
          displayValue={(selected: string) =>
            roles.find((option) => option.value === selected)?.value ?? selected
          }
        /> */}

        {isFiltered && (
          <Button
            size="sm"
            onClick={handleReset}
            className="-order-1 h-8 w-full bg-gray-200/70 @4xl:-order-4 @4xl:w-auto"
            variant="flat"
          >
            <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear
          </Button>
        )}

        {/* <Input
          type="search"
          placeholder="Search for staffs..."
          value={searchTerm}
          onClear={() => onSearch('')}
          onChange={(event) => onSearch(event.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          rounded="lg"
          clearable
          className="-order-4 w-full @xl:-order-5 @xl:ms-auto @xl:w-auto @4xl:-order-2 @4xl:w-[230px] @5xl:w-auto"
        /> */}

        <div className="-order-5 flex basis-auto justify-end gap-2 @xl:-order-4 @4xl:-order-1">
          {/* <ModalButton
            label="Add New Staff"
            view={<CreateUser />}
            customSize="600px"
            className="mt-0"
          /> */}
          <DrawerButton
            label="Invite New Staff"
            view={<CreateUser />}
            customSize="500px"
            placement="right"
          />
          <Button
            className="mt-4 w-full bg-[#6c5ce7] @lg:mt-0 @lg:w-auto"
            onClick={() => setImportDrawer(true)}
          >
            <LuUpload className="me-1.5 h-[17px] w-[17px]" />
            Upload CSV
          </Button>
        </div>
      </div>
      <Drawer
        size="md"
        isOpen={importDrawer ?? false}
        onClose={() => {
          setImportDrawer(false);
        }}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
        containerClassName="dark:bg-gray-100"
        className="z-[9999]"
      >
        <FileUploadDrawer
          setOpenDrawer={setImportDrawer}
          fetchData={fetchData}
        />
      </Drawer>
    </>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case STATUSES.Active:
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case STATUSES.Deactivated:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
