'use client';

import { PiTrashDuotone, PiMagnifyingGlassBold } from 'react-icons/pi';
import StatusField from '@/components/controlled-table/status-field';
import { Text, Title } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STATUSES } from '@/data/users-data';
import { rolesList } from '@/data/roles-permissions';
import { Input } from '@/components/ui/input';
import ModalButton from '@/app/shared/modal-button';
import CreateUser from '@/app/shared/pickup-request/create-user';
import DownloadButton from '../../download-button';
import { downloadJobReport, downloadWardDataReport } from '@/service/page';
import { useState } from 'react';

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
}: FilterElementProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    console.log('DOWNLOAD BTN CLICKED!');
    try {
      const resultData = await downloadJobReport();
      console.log('report response data', resultData);
      const blob = new Blob([resultData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = 'jobRequestReport.xlsx';
      // Append the link to the body and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      // Remove the link from the body
      document.body.removeChild(downloadLink);
      alert('Report downloaded successfully!');
      setDownloading(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      setDownloading(false);
    }
  };
  return (
    <>
      <div className="relative z-50 mb-4 flex flex-wrap items-center justify-between gap-2.5 @container ">
        <Title as="h5" className="-order-6 basis-2/5 @xl:basis-auto">
          Jobs List
        </Title>

        <Input
          type="search"
          placeholder="Search for jobs..."
          value={searchTerm}
          onClear={() => onSearch('')}
          onChange={(event) => onSearch(event.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          rounded="lg"
          clearable
          className="-order-4 w-full @xl:-order-5 @xl:ms-auto @xl:w-auto @4xl:-order-2 @4xl:w-[230px] @5xl:w-auto"
        />

        <div className="-order-5 flex basis-auto justify-end @xl:-order-4 @4xl:-order-1">
          <ModalButton
            label="Add New Job"
            view={<CreateUser />}
            customSize="600px"
            className="mt-0"
          />
        </div>
        <div className="-order-5 flex basis-auto justify-end @xl:-order-4 @4xl:-order-1">
          <DownloadButton
            label={downloading ? 'Downloading...' : 'Download Report'}
            onClickFunction={handleDownload}
            customSize="600px"
            className="mt-0"
          />
        </div>
      </div>
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
