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
import { createPositions, createStaffs, listPositionCat } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  CreatePositionCatResponse,
  CreateStaffResponse,
  ListPositionCategoryInterface,
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
  const onboardedByOptions = [
    { value: 'invitation', label: 'Invitation' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'organization_super_admin', label: 'Organization Super Admin' },
    { value: 'branch_admin', label: 'Branch Admin' },
    { value: 'branch_staff', label: 'Branch Staff' },
  ];

  // const [accountTypes, setAccountTypes] = useState<
  //   { value: number; label: string }[]
  // >([]);

  // useEffect(() => {
  //   const fetchAccountTypes = async () => {
  //     try {
  //       const result =
  //         (await listPositionCat()) as ListPositionCategoryInterface[];
  //       console.log('Account types:', result);
  //       setAccountTypes(
  //         result.map((type) => ({
  //           value: type.id,
  //           label: type.name,
  //         }))
  //       );
  //     } catch (error) {
  //       console.error('Error fetching account types:', error);
  //     }
  //   };

  //   fetchAccountTypes();
  // }, []);

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

    const formattedData = {
      ...data,
      organization_id: organizationId,
      organization_branch_id: organizationBranchId,
      positions: [
        {
          position_id: Number(data.primary_position_id),
          hourly_rate: Number(data.hourly_rate),
          is_primary: 1,
        },
      ],
    };
    setLoading(true);

    try {
      const response = await createStaffs(formattedData);
      const resultData = response.data as CreateStaffResponse;

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          onboarded_by: '',
          primary_location: '',
          primary_position_id: '',
          hourly_rate: '',
        });
        closeDrawer();
        toast.success('Staff created successfully', {
          position: 'top-right',
        });
      }
    } catch (err: any) {
      console.log('Error message ', err.response);
      if (err.response && err.response?.data?.statusCode === 401) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else if (err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Please try again');
      }
    } finally {
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
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a staff
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
                label="Password"
                placeholder="Enter password"
                // type="password"
                {...register('password')}
                error={errors.password?.message}
              />
              <Controller
                name="onboarded_by"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Onboarded By
                    </label>
                    <Select
                      options={onboardedByOptions}
                      value={onboardedByOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) =>
                        field.onChange(option ? option.value : null)
                      }
                      name={field.name}
                      isClearable
                    />
                  </div>
                )}
              />

              {/* <Input
                label="Onboarded By"
                placeholder="Enter onboarded by"
                {...register('onboarded_by')}
                error={errors.onboarded_by?.message}
              /> */}
              <Input
                label="Primary Location"
                className="col-span-full"
                placeholder="Enter primary location"
                {...register('primary_location')}
                error={errors.primary_location?.message}
              />
              <Input
                label="Primary Position ID"
                className="col-span-full"
                placeholder="Enter primary position ID"
                {...register('primary_position_id')}
                error={errors.primary_position_id?.message}
              />
              <Input
                label="Hourly Rate"
                className="col-span-full"
                placeholder="Enter hourly rate"
                {...register('hourly_rate')}
                error={errors.hourly_rate?.message}
              />

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
                  Create Staff
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
