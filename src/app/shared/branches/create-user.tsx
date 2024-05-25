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
import { createBranches, listOrg, listPositionCat } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  Branch,
  CreatePositionCatResponse,
  ListBranchesInterface,
  ListOrganisationResponse,
  ListPositionCategoryInterface,
} from '@/types';
import { signOut } from 'next-auth/react';
import Select from 'react-select';
import { useDrawer } from '../drawer-views/use-drawer';
import {
  CreateBranchesInput,
  createBranchesSchema,
} from '@/utils/validators/create-branches.schema';

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = (await listOrg()) as ListOrganisationResponse;
        const result = response.data;
        console.log('Organizations:', result);
        setOrganizations(
          result.map((org) => ({
            value: org.id,
            label: org.company_name,
          }))
        );
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchAccountTypes();
  }, []);

  const onSubmit: SubmitHandler<CreateBranchesInput> = async (data) => {
    const organizationId = sessionStorage.getItem('organizationId');
    const formattedData = {
      branch_admin: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      },
      branch_name: data.branch_name,
      location_address_line_one: data.location_address_line_one,
      location_address_line_two: data.location_address_line_two,
      country: data.country,
      postal_code: data.postal_code,
      organization_id: Number(organizationId), // take from the url
    };

    setLoading(true);

    try {
      const response = await createBranches(formattedData);
      const resultData = response.data as CreatePositionCatResponse[];

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          name: '',
          description: '',
        });
        closeDrawer();
        toast.success('Location created successfully', {
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
      <Form<CreateBranchesInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={createBranchesSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a location
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
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
              />
              <Input
                label="Location"
                placeholder="Enter the location"
                className="col-span-full"
                {...register('branch_name')}
                error={errors.branch_name?.message}
              />
              {/* <Controller
                name="organization_id"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Select Organization
                    </label>
                    <Select
                      options={organizations}
                      value={organizations.find(
                        (at) => at.value === field.value
                      )}
                      onChange={(option) =>
                        field.onChange(option ? option.value : null)
                      }
                      name={field.name}
                      isClearable
                    />
                  </div>
                )}
              /> */}
              <Input
                label="Location Address Line One"
                placeholder="Enter location Address"
                // className="col-span-full"
                {...register('location_address_line_one')}
                error={errors.location_address_line_one?.message}
              />
              <Input
                label="Location Address Line Two"
                placeholder="Enter location Address"
                // className="col-span-full"
                {...register('location_address_line_two')}
                error={errors.location_address_line_two?.message}
              />

              <Input
                label="Postal Code"
                placeholder="Enter postal code "
                {...register('postal_code')}
                error={errors.postal_code?.message}
              />

              <Input
                label="Country"
                placeholder="Enter your country"
                {...register('country')}
                error={errors.country?.message}
              />

              {/* <Input
                label="Hourly Rate"
                placeholder="Enter hourly rate"
                className="col-span-full"
                // {...register('hourly_rate')}
                {...register('hourly_rate', {
                  setValueAs: (value) => parseFloat(value), // Convert the input value to a number
                })}
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
                  className="w-full @xl:w-auto text-white"
                >
                  Create Location
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
