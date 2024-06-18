import React, { useEffect, useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { scheduleShiftStatus } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedEmployStatusAtom, selectedShiftAtom } from '@/store/checkout';

const EmployStatus = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'casual', label: 'Casual' },
  { value: 'flex', label: 'Flex' },
];

interface FilterDrawerProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEmployStatus: React.Dispatch<React.SetStateAction<string[]>>;
  setShiftStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  setDrawer,
  setEmployStatus,
  setShiftStatus,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useAtom(selectedShiftAtom);
  const [selectedEmployStatus, setSelectedEmployStatus] = useAtom(
    selectedEmployStatusAtom
  );
  const [shiftArray, setShiftArray] = useState([]);

  const [componentSelectedShift, setComponentSelectedShift] = useState(
    selectedShift ?? []
  );
  const [componentSelectedEmployStatus, setComponentSelectedEmployStatus] =
    useState(selectedEmployStatus ?? []);

  const fetchShiftData = async () => {
    try {
      setIsLoading(true);
      const response = await scheduleShiftStatus();
      const transformedData = response?.map((item: any) => ({
        value: item.id,
        label: item.name,
      }));

      setShiftArray(transformedData);
    } catch (error: any) {
      console.log(error, 'shift issue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftData();
  }, []);

  const onSubmit = async (data: any) => {
    setSelectedShift(componentSelectedShift);
    setSelectedEmployStatus(componentSelectedEmployStatus);
    const shiftStatus = componentSelectedShift?.map(
      (shift: any) => shift?.label
    );
    const employStatus = componentSelectedEmployStatus?.map(
      (employ: any) => employ?.value
    );
    setEmployStatus(employStatus);
    setShiftStatus(shiftStatus);

    console.log(data, shiftStatus, employStatus);

    setDrawer(false);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-y-auto">
      <div className="mb-5 mt-4 flex items-center justify-between px-5">
        <h3 className=" text-center ">Add Filter</h3>
        <ActionIcon size="sm" variant="text" onClick={() => setDrawer(false)}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <hr />
      <Form
        // resetValues={reset}
        onSubmit={onSubmit}
        className="flex h-[100vh] flex-col gap-3  overflow-scroll p-6 "
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <Controller
                name="shift_status"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Shift status
                    </label>
                    <Select
                      options={shiftArray}
                      name={field.name}
                      isMulti
                      isClearable
                      value={componentSelectedShift}
                      isLoading={isLoading}
                      onChange={(selected: any) => {
                        setComponentSelectedShift(selected);
                      }}
                    />
                  </div>
                )}
              />

              <Controller
                name="employment_status"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Employment Status
                    </label>
                    <Select
                      options={EmployStatus}
                      name={field.name}
                      isMulti
                      isClearable
                      value={componentSelectedEmployStatus}
                      onChange={(selected: any) => {
                        setComponentSelectedEmployStatus(selected);
                      }}
                    />
                  </div>
                )}
              />

              {/* {errorMessage && (
                <div className="col-span-full text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )} */}
              <div className="col-span-full flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setDrawer(false)}
                  className="w-full @xl:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full text-white @xl:w-auto">
                  Filter
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
};

export default FilterDrawer;
