'use client';

import { ActionIcon } from '@/components/ui/action-icon';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneNumber } from '@/components/ui/phone-input';
import { Title } from '@/components/ui/text';
import { addAdministration, listOrgBranches } from '@/service/page';
import {
  CreateAdministratorsInput,
  createAdministratorsSchema,
} from '@/utils/validators/create-administrators.schema';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { PiXBold } from 'react-icons/pi';
import { useDrawer } from '../drawer-views/use-drawer';
import { MultiSelect } from 'react-multi-select-component';
import Spinner from '@/components/ui/spinner';

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [branches, setBranches] = useState<{ value: number; label: string }[]>(
    []
  );

  const fetchBranches = async () => {
    setLoading(true);
    const organizationId = sessionStorage.getItem('organizationId');
    try {
      const response = await listOrgBranches(organizationId);
      const result = response.data;
      console.log('Organizations:', result);
      setBranches(
        result.map((org: any) => ({
          value: org.id,
          label: org.branch_name,
        }))
      );
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  const onSubmit: SubmitHandler<CreateAdministratorsInput> = async (data) => {
    const organizationId = sessionStorage.getItem('organizationId');
    const roles: any = sessionStorage.getItem('userRoles');
    const parsedRoles: any = JSON.parse(roles);

    if (!organizationId) {
      setErrorMessage('Organization ID not found in session storage.');
      return;
    }
    const { branches, phone, ...restData } = data;
    const branchIds = data.branches.map((branch: any) => branch.value);
    const formattedData = {
      ...restData,
      branches: branchIds,
      phone: '+' + phone,
      organization_id: Number(organizationId),
      onboarded_by: parsedRoles[0].name,
    };

    try {
      const response = await addAdministration(formattedData);
      const resultData = response.data;

      closeDrawer();
      toast.success('Administrator created successfully', {
        position: 'top-right',
      });
      location.reload();
    } catch (err: any) {
      console.log('Error message ', err.message);
      toast.error(err?.response?.data?.message);
    } finally {
      // signOut();
      setLoading(false);
      closeDrawer();
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-full flex-col">
        <Form<CreateAdministratorsInput>
          resetValues={reset}
          onSubmit={onSubmit}
          validationSchema={createAdministratorsSchema}
          className="flex h-full flex-col gap-6 overflow-y-auto p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
        >
          {({ register, control, watch, formState: { errors } }) => {
            console.log(errors, 'errordata');
            return (
              <>
                <div className="col-span-full flex items-center justify-between">
                  <Title as="h4" className="font-semibold">
                    Add a administrator
                  </Title>
                  <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                    <PiXBold className="h-auto w-5" />
                  </ActionIcon>
                </div>

                <div className="flex gap-2">
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
                </div>

                <Input
                  label="Address"
                  placeholder="Enter administrator Address"
                  className="col-span-full"
                  {...register('primary_location')}
                  error={errors.primary_location?.message}
                />

                {/* <Input
                label="Country"
                placeholder="Enter your country"
                {...register('country')}
                error={errors.country?.message}
              />  */}

                <div className="flex gap-2">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className="z-50 col-span-full flex flex-col gap-2">
                        <label className="font-medium text-gray-900 dark:text-white">
                          Phone Number
                        </label>
                        <PhoneNumber
                          country="us"
                          value={value}
                          className="col-span-full"
                          onChange={onChange}
                          error={errors?.phone?.message as string}
                        />
                      </div>
                    )}
                  />

                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    className="col-span-full"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  className="col-span-full"
                  //@ts-ignore
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                />

                {isLoading ? (
                  <Spinner />
                ) : (
                  <Controller
                    name="branches"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div className=" col-span-full flex flex-col gap-2">
                        <label className="font-medium text-gray-900 dark:text-white">
                          Select Branches
                        </label>
                        <MultiSelect
                          options={branches}
                          value={value ?? []}
                          onChange={onChange}
                          labelledBy="Select Positions"
                        />
                        {errors?.branches?.message && (
                          <div className="col-span-full text-sm font-semibold text-red-500">
                            {errors?.branches.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                )}

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
                    Create Location
                  </Button>
                </div>
              </>
            );
          }}
        </Form>
      </div>
    </>
  );
}
