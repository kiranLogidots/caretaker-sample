'use client';

import StorageReport from '@/app/shared/file/dashboard/storage-report';
import FileStats from '@/app/shared/file/dashboard/file-stats';
import StorageSummary from '@/app/shared/file/dashboard/storage-summary';
import RecentFiles from '@/app/shared/file/dashboard/recent-files';
import QuickAccess from '@/app/shared/file/dashboard/quick-access';
import ActivityReport from '@/app/shared/file/dashboard/activity-report';
import Members from '@/app/shared/file/dashboard/members';
import FileListTable from '@/app/shared/file/dashboard/file-list/table';
import UpgradeStorage from '@/app/shared/file/dashboard/upgrade-storage';
import RecentActivities from '@/app/shared/file/dashboard/recent-activities';
import { allFilesData } from '@/data/all-files';
import ComingSoonImg from '@public/coming-soon.png';
import ComingSoonTwoImg from '@public/come.png';
import Image from 'next/image';

export default function FileDashboard() {
  return (
    <div className="mt-2 @container">
      <div className="flex items-center justify-center">
      <Image
        src={ComingSoonTwoImg}
        alt="coming soon"
        className="w-[10%] top-80"
      />
      </div>
      {/* <div className="end-10 top-1/2 lg:absolute lg:-translate-y-1/2 xl:end-[10%] 3xl:end-[15%]">
        <Image
          src={ComingSoonImg}
          alt="coming-soon"
          className="aspect-[531/721] max-w-[194px] md:max-w-[256px] lg:max-w-sm xl:max-w-[400px] 3xl:max-w-[531px]"
        />
      </div> */}
      {/* <FileStats className="mb-5 2xl:mb-8" />
      <div className="mb-6 grid grid-cols-1 gap-6 @4xl:grid-cols-12 2xl:mb-8 2xl:gap-8">
        <StorageReport className="@container @4xl:col-span-8 @[96.937rem]:col-span-9" />
        <StorageSummary className="@4xl:col-span-4 @[96.937rem]:col-span-3" />
      </div> */}

      {/* <div className="grid grid-cols-1 gap-6 @container lg:grid-cols-12 2xl:gap-8 ">
        <div className="col-span-full flex flex-col gap-6 @5xl:col-span-8 2xl:gap-8 3xl:col-span-9">
          <QuickAccess />
          <RecentFiles />
          <ActivityReport />
          <FileListTable data={allFilesData} />
        </div>

        <div className="col-span-full flex flex-col gap-6 @5xl:col-span-4 2xl:gap-8 3xl:col-span-3">
          <RecentActivities />
          <Members />
          <UpgradeStorage />
        </div>
      </div> */}
    </div>
  );
}
