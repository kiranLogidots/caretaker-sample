import React from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';

const FilterDrawer = ({ setDrawer }: { setDrawer: any }) => {
  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-y-auto">
      <div className="mb-5 mt-4 flex items-center justify-between px-5">
        <h3 className=" text-center ">Add Filter</h3>
        <ActionIcon size="sm" variant="text" onClick={() => setDrawer(false)}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <hr />
    </div>
  );
};

export default FilterDrawer;
