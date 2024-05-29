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
import { createOrgPositions, createPositions, listPositionCat, listPositions } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  CreatePositionUnderOrgResponse,
  CreatePositionsUnderOrg,
  ListPositionCategoryInterface,
} from '@/types';
import { signOut } from 'next-auth/react';
import Select from 'react-select';
import { useDrawer } from '../drawer-views/use-drawer';
import { PositionsUnderOrgInput, positionsUnderOrgSchema } from '@/utils/validators/create-positionsunderorg.schema';

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountTypes, setAccountTypes] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const result =
          (await listPositions()) as ListPositionCategoryInterface[];
        console.log('Account types:', result);
        setAccountTypes(
          result.map((type) => ({
            value: type.id,
            label: type.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching account types:', error);
      }
    };

    fetchAccountTypes();
  }, []);

  const onSubmit: SubmitHandler<PositionsUnderOrgInput> = async (data) => {

    const organizationId = Number(sessionStorage.getItem('organizationId'));

    // const formattedData = {
    //   description: data.description,
    //   position_id: Number(data.position_id),
    //   hourly_rate: data.hourly_rate,
    // };
    // const formattedData = {
    //   organization_positions: [
    //     {
    //       organization_id: organizationId, // Assuming a static organization_id, modify as needed
    //       position_id: Number(data.position_id),
    //       hourly_rate: data.hourly_rate, // Converting hourly_rate to string as required
    //     },
    //   ],
    // };
    // const formattedData = {
    //   organization_positions: data.organization_positions.map((position) => ({
    //     ...position,
    //     organization_id: organizationId,
    //   })),
    // };
    // const formattedData = data.organization_positions.map((position) => ({
    //   organization_id: organizationId,
    //   position_id: position.position_id,
    //   hourly_rate: position.hourly_rate,
    // }));
    const formattedData: CreatePositionsUnderOrg = {
      organization_positions: data.organization_positions.map(position => ({
        organization_id: organizationId,
        position_id: position.position_id,
        hourly_rate: position.hourly_rate,
      }))
    };
    setLoading(true);

    try {
      const response = await createOrgPositions(formattedData);
      const resultData = response.data as CreatePositionUnderOrgResponse[];

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          organization_positions: [{
            position_id: null,
            hourly_rate: '',
          }]
        });
        closeDrawer();
        toast.success('Position saved', {
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
        // setErrorMessage(err.response.data.message.join(' '));
        const errorMessage = err.response.data.message.join(' ');

        if (errorMessage.includes('organization_positions.0.position_id already exists')) {
          setErrorMessage('This position is already selected under this organisation');
        } else {
          setErrorMessage(errorMessage);
        }
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
      <Form<PositionsUnderOrgInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={positionsUnderOrgSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Assign positions
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              {/* <Input
                label="Name"
                placeholder="Enter name"
                className="col-span-full"
                {...register('name')}
                error={errors.name?.message}
              /> */}

              <Controller
                name="organization_positions"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Select Positions
                    </label>
                    <Select
                      options={accountTypes}
                      value={accountTypes.find((at) =>
                        field.value.some((position) => position.position_id === at.value)
                      )}
                      onChange={(option) =>
                        field.onChange(
                          option ? [{ position_id: option.value, hourly_rate: '' }] : []
                        )
                      }
                      name={field.name}
                      isClearable
                    />
                    {/* <Select
                      options={accountTypes}
                      value={accountTypes.find(
                        (at) => at.value === field.value
                      )}
                      onChange={(option) =>
                        field.onChange(option ? option.value : null)
                      }
                      name={field.name}
                      isClearable
                    /> */}
                  </div>
                )}
              />
                <Input
                label="Hourly Rate"
                placeholder="Enter hourly rate"
                className="col-span-full"
                {...register('organization_positions.0.hourly_rate', {
                  setValueAs: (value) => parseFloat(value), // Convert the input value to a number
                })}
                error={errors.organization_positions?.[0]?.hourly_rate?.message}
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
              {/* <Input
                label="Description"
                placeholder="Enter description"
                className="col-span-full"
                {...register('description')}
                error={errors.description?.message}
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
                  Save
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
