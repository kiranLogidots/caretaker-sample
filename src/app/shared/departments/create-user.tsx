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
import {  createDepartments, createPositions, listBranches, listPositionCat } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import { CreatePositionCatResponse, ListBranchesInterface, ListPositionCategoryInterface } from '@/types';
import { signOut } from 'next-auth/react';
import {
  PositionsFormInput,
  positionsFormSchema,
} from '@/utils/validators/create-position.schema';
import Select from 'react-select';
import { useDrawer } from '../drawer-views/use-drawer';
import { DepartmentFormInput, createDepartmentSchema } from '@/utils/validators/create-department.schema';

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountTypes, setAccountTypes] = useState< { value: number; label: string }[]>([]);

  // useEffect(() => {
  //   const fetchBranches = async () => {
  //     try {
  //       const result = (await listBranches()) as ListBranchesInterface[];
  //       console.log('List branch results:', result);
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

  //   fetchBranches();
  // }, []);

  const onSubmit: SubmitHandler<DepartmentFormInput> = async (data) => {
    const BranchId = sessionStorage.getItem('organizationBranchId');

    const formattedData = {
      name: data.name,
      description: data.description,
      organization_branch_id: Number(BranchId),
    };

    setLoading(true);

    try {
      const response = await createDepartments(formattedData);
      const resultData = response.data as CreatePositionCatResponse[];

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          name: '',
          description: '',
        });
        closeDrawer();
        toast.success('Departments created successfully', {
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
      <Form<DepartmentFormInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={createDepartmentSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a department
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              <Input
                label="Name"
                placeholder="Enter name"
                className="col-span-full"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Description"
                placeholder="Enter description"
                className="col-span-full"
                {...register('description')}
                error={errors.description?.message}
              />
              {/* <Controller
                name="organization_branch_id"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                    Select Location
                    </label>
                    <Select
                      options={accountTypes}
                      value={accountTypes.find(
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
                  className="w-full @xl:w-auto"
                >
                  Create Department
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
