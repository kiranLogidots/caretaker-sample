'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { Title } from '@/components/ui/text';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  createPositions,
  createStaffs,
  inviteStaffs,
  listOrgPositions,
  listPositionCat,
  listPositions,
} from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  CreatePositionCatResponse,
  CreateStaffResponse,
  ListOrgPositionInterface,
  ListPositionCategoryInterface,
  ListPositionsInterface,
} from '@/types';
import { signOut } from 'next-auth/react';
import Select from 'react-select';
import { useDrawer } from '../drawer-views/use-drawer';
import {
  CreateStaffsInput,
  createStaffsSchema,
} from '@/utils/validators/create-staffs.schema';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { PhoneNumber } from '@/components/ui/phone-input';

export default function CreateUser() {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [positionsData, setPositionsData] = useState<
    { value: number; label: string; hourly_rate: string }[]
  >([]);
  // const onboardedByOptions = [
  //   { value: 'invitation', label: 'Invitation' },
  //   { value: 'super_admin', label: 'Super Admin' },
  //   { value: 'organization_super_admin', label: 'Organization Super Admin' },
  //   { value: 'branch_admin', label: 'Branch Admin' },
  //   { value: 'branch_staff', label: 'Branch Staff' },
  // ];
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    setMaxDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const fetchPositions = async () => {
    try {
      const result = (await listOrgPositions(
        Number(branchId)
      )) as ListOrgPositionInterface[];
      console.log('Positions:', result);
      setPositionsData(
        result.map((type) => ({
          value: type?.position?.id,
          label: type?.position?.name,
          hourly_rate: type.position.hourly_rate,
        }))
      );
      console.log('Mapped Positions Data:', positionsData);
    } catch (error) {
      console.error('Error fetching Positions:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<CreateStaffsInput> = async (data) => {
    const organizationId = Number(sessionStorage.getItem('organizationId'));
    // const organizationBranchId = Number(
    //   sessionStorage.getItem('organizationBranchId')
    // );

    if (!organizationId) {
      setErrorMessage('Organization ID not found in session storage.');
      return;
    }

    //@ts-ignore
    const formattedPositions = [...data?.positions, ...data?.primary_positions];

    // filter if same value for primary and secondary
    const filteredPositions = formattedPositions.reduce((acc, current) => {
      const foundIndex = acc.findIndex(
        (item: any) => item.position_id === current.position_id
      );

      if (foundIndex === -1) {
        // If the position_id is not found, add the current object
        acc.push(current);
      } else if (acc[foundIndex].is_primary === 0 && current.is_primary === 1) {
        // If a duplicate with is_primary 0 is found, replace it with the current object if it has is_primary 1
        acc[foundIndex] = current;
      }

      return acc;
    }, []);

    const { phone, ...restData } = data;

    const formattedData = {
      ...restData,
      organization_id: organizationId,
      organization_branch_id: Number(branchId),
      phone: '+' + phone,
      // onboarded_by: 'invitation',
      // dob: new Date(data.dob).toISOString().split('T')[0],
      // dob: new Date(data.dob).toISOString(),
      positions: filteredPositions,
    };
    setLoading(true);

    try {
      const response = await inviteStaffs(formattedData);
      const resultData = response.data as CreateStaffResponse;

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          primary_location: '',
          hourly_rate: '',
          dob: '',
          employee_start_date: '',
          employment_status: '',
        });
        closeDrawer();
        toast.success('Staff created successfully', {
          position: 'top-right',
        });
        location.reload();
      }
    } catch (err: any) {
      console.log('Error message ', err.response);
      if (err.response && err.response?.data?.statusCode === 401) {
        signOut({
          callbackUrl: '/signin',
        });
      } else if (err.response?.data?.statusCode === 400) {
        setErrorMessage(err.response.data.message.join(' '));
      } else {
        setErrorMessage(err.message || 'An unknown error occurred');
      }
    } finally {
      // signOut();
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Form<CreateStaffsInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={createStaffsSchema}
        className="grid h-[100vh] grid-cols-1 gap-6 overflow-scroll p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Invite a staff
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              <Input
                label="First Name"
                placeholder="Enter first name"
                {...register('first_name')}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                {...register('last_name')}
                error={errors.last_name?.message}
              />
              <Input
                label="Email"
                placeholder="Enter email"
                {...register('email')}
                error={errors.email?.message}
              />
              {/* <Input
                label="Phone"
                placeholder="Enter phone number"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('phone')}
                defaultValue="+91"
                error={errors.phone?.message}
              /> */}
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <PhoneNumber
                    label="Phone number"
                    country="us"
                    labelClassName="font-medium text-gray-900"
                    value={value}
                    onChange={onChange}
                    error={errors?.phone?.message as string}
                  />
                )}
              />
              <Input
                label="Primary Location"
                className="col-span-full"
                placeholder="Enter primary location"
                {...register('primary_location')}
                error={errors.primary_location?.message}
              />

              <Controller
                name="primary_positions"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Primary Position
                    </label>
                    <Select
                      options={positionsData}
                      value={positionsData.find((option: any) =>
                        (field.value || []).some(
                          (position: any) =>
                            Number(position.position_id) === option.value &&
                            position.is_primary
                        )
                      )}
                      onChange={(selectedOption) => {
                        const newPosition = {
                          position_id: selectedOption?.value,
                          hourly_rate: selectedOption?.hourly_rate,
                          is_primary: 1,
                        };

                        const updatedPositions = [
                          newPosition, // New primary position
                          // Filter out any previous primary positions and update secondary positions
                          ...(field.value || []).filter(
                            (position) => position.is_primary === 0
                          ),
                        ];

                        // Update the form field's value with the new positions array
                        field.onChange(updatedPositions);
                      }}
                      // onChange={(option) => {
                      //   const newPosition = {
                      //     position_id: option?.value.toString(),
                      //     is_primary: true,
                      //   };
                      //   field.onChange([
                      //     newPosition,
                      //     ...(field.value || []).filter((p) => !p.is_primary),
                      //   ]);
                      // }}
                      name={field.name}
                      isClearable
                    />
                    {errors.primary_positions?.message && (
                      <div className="mt-1 w-full text-sm text-red">
                        {errors.primary_positions?.message}
                      </div>
                    )}
                  </div>
                )}
              />
              <Controller
                name="positions"
                control={control}
                render={({ field }) => {
                  const primaryPositionIds = (
                    watch('primary_positions') || []
                  ).map((position) => position.position_id);

                  const filteredPositions = positionsData.filter(
                    (position) => !primaryPositionIds.includes(position.value)
                  );

                  return (
                    <div className="col-span-full flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        Secondary Positions
                      </label>
                      <Select
                        options={filteredPositions}
                        value={positionsData.filter((option) =>
                          (field.value || []).some(
                            (position) =>
                              Number(position.position_id) === option.value &&
                              !position.is_primary
                          )
                        )}
                        onChange={(selectedOptions) => {
                          // Create an array to store the updated positions
                          const updatedPositions: {
                            position_id: number;
                            hourly_rate: string;
                            is_primary: number;
                          }[] = [];
                          // Loop through each selected option
                          selectedOptions.forEach((selectedOption) => {
                            // Create a new position object for the selected option
                            const newPosition = {
                              position_id: selectedOption?.value,
                              hourly_rate: selectedOption?.hourly_rate,
                              is_primary: 0, // Set as secondary
                            };

                            // Add the new position to the updated positions array
                            updatedPositions.push(newPosition);
                          });

                          // Update the form field's value with the updated positions array
                          field.onChange(updatedPositions);
                        }}
                        // onChange={(options) => {
                        //   const newPositions = options.map((option) => ({
                        //     position_id: option.value.toString(),
                        //     is_primary: false,
                        //   }));
                        //   field.onChange([
                        //     ...newPositions,
                        //     ...(field.value || []).filter((p) => p.is_primary),
                        //   ]);
                        // }}
                        name={field.name}
                        isMulti
                        isClearable
                      />
                      {errors.positions?.message && (
                        <div className="mt-1 w-full text-sm text-red">
                          {errors.positions?.message}
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              <Input
                label="Date of Birth"
                className="col-span-fu"
                placeholder="Enter date of birth"
                type="date"
                max={maxDate}
                {...register('dob')}
                error={errors.dob?.message}
              />
              <Input
                label="Employee Start Date"
                className="col-span-fu"
                placeholder="Enter employee start date"
                type="date"
                {...register('employee_start_date')}
                error={errors.employee_start_date?.message}
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
                      options={[
                        { value: 'full_time', label: 'Full Time' },
                        { value: 'part_time', label: 'Part Time' },
                        { value: 'casual', label: 'Casual' },
                        { value: 'flex', label: 'Flex' },
                      ]}
                      value={[
                        { value: 'full_time', label: 'Full Time' },
                        { value: 'part_time', label: 'Part Time' },
                        { value: 'casual', label: 'Casual' },
                        { value: 'flex', label: 'Flex' },
                      ].find((option) => option.value === field.value)}
                      onChange={(option) =>
                        field.onChange(option ? option.value : null)
                      }
                      name={field.name}
                      isClearable
                    />
                  </div>
                )}
              />
              <Input
                label="Employee ID"
                className="col-span-full"
                placeholder="Enter employee ID"
                {...register('employee_id')}
                error={errors.employee_id?.message}
              />
              {/* <Input
                label="Hourly Rate"
                className="col-span-full"
                placeholder="Enter hourly rate"
                {...register('positions.1.hourly_rate')}
                error={errors.positions?.[1]?.hourly_rate?.message}
              /> */}
              {/* <Input
                label="Hourly Rate"
                className="col-span-full"
                placeholder="Enter hourly rate"
                {...register('hourly_rate')}
                error={errors.hourly_rate?.message}
              /> */}

              {errorMessage && (
                <div className="col-span-full text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )}
              <div className="col-span-full flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={closeDrawer}
                  className="w-full @xl:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full text-white @xl:w-auto"
                >
                  Invite Staff
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
