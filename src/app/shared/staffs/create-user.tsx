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
  listPositionCat,
  listPositions,
} from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  CreatePositionCatResponse,
  CreateStaffResponse,
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

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [positionsData, setPositionsData] = useState<
    { value: number; label: string }[]
  >([]);
  // const onboardedByOptions = [
  //   { value: 'invitation', label: 'Invitation' },
  //   { value: 'super_admin', label: 'Super Admin' },
  //   { value: 'organization_super_admin', label: 'Organization Super Admin' },
  //   { value: 'branch_admin', label: 'Branch Admin' },
  //   { value: 'branch_staff', label: 'Branch Staff' },
  // ];

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const result = (await listPositions()) as ListPositionsInterface[];
        console.log('Positions:', result);
        setPositionsData(
          result.map((type) => ({
            value: type.id,
            label: type.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching Positions:', error);
      }
    };

    fetchPositions();
  }, []);

  const onSubmit: SubmitHandler<CreateStaffsInput> = async (data) => {
    const organizationId = Number(sessionStorage.getItem('organizationId'));
    const organizationBranchId = Number(
      sessionStorage.getItem('organizationBranchId')
    );

    if (!organizationId) {
      setErrorMessage('Organization ID not found in session storage.');
      return;
    }
    if (!organizationBranchId) {
      setErrorMessage('Branch ID not found in session storage.');
      return;
    }

    const formattedPositions = [

      ...data.positions.map(({ position_id, hourly_rate, is_primary }) => ({
        position_id: Number(position_id),
        hourly_rate: Number(hourly_rate),
        is_primary: is_primary ? 1 : 0,
      })),
    ];
    const formattedData = {
      ...data,
      organization_id: organizationId,
      organization_branch_id: organizationBranchId,
      // onboarded_by: 'invitation',
      // dob: new Date(data.dob).toISOString().split('T')[0],
      // dob: new Date(data.dob).toISOString(),
      positions: formattedPositions,
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
      console.log('Error message ', err.message);
      if (err.response && err.response?.data?.statusCode === 401) {
        signOut({
          callbackUrl: 'http://localhost:3000',
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
              <Input
                label="Phone"
                placeholder="Enter phone number"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('phone')}
                defaultValue="+91"
                error={errors.phone?.message}
              />
              <Input
                label="Primary Location"
                className="col-span-full"
                placeholder="Enter primary location"
                {...register('primary_location')}
                error={errors.primary_location?.message}
              />
              <Controller
                name="positions"
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
                      value={positionsData.find((option) =>
                        (field.value || []).some(
                          (position) =>
                            Number(position.position_id) === option.value &&
                            position.is_primary
                        )
                      )}
                      onChange={(option) => {
                        const newPosition = {
                          position_id: option?.value.toString(),
                          is_primary: true,
                        };
                        field.onChange([
                          newPosition,
                          ...(field.value || []).filter((p) => !p.is_primary),
                        ]);
                      }}
                      name={field.name}
                      isClearable
                    />
                  </div>
                )}
              />
              <Controller
                name="positions"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Secondary Positions
                    </label>
                    <Select
                      options={positionsData}
                      value={positionsData.filter((option) =>
                        (field.value || []).some(
                          (position) =>
                            Number(position.position_id) === option.value &&
                            !position.is_primary
                        )
                      )}
                      onChange={(options) => {
                        const newPositions = options.map((option) => ({
                          position_id: option.value.toString(),
                          is_primary: false,
                        }));
                        field.onChange([
                          ...newPositions,
                          ...(field.value || []).filter((p) => p.is_primary),
                        ]);
                      }}
                      name={field.name}
                      isMulti
                      isClearable
                    />
                  </div>
                )}
              />
              <Input
                label="Date of Birth"
                className="col-span-fu"
                placeholder="Enter date of birth"
                type="date"
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
              <Input
                label="Hourly Rate"
                className="col-span-full"
                placeholder="Enter hourly rate"
                {...register('positions.1.hourly_rate')}
                error={errors.positions?.[1]?.hourly_rate?.message}
              />
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
