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
import { initiateJobs, listCollection, listDrivers } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  CollectionPointOption,
  JobsListResponse,
  ListCollectionInterface,
} from '@/types';
import { signOut } from 'next-auth/react';
import {
  PickupReqFormInput,
  pickupReqFormSchema,
} from '@/utils/validators/create-pickup-request.schema';
import Select from 'react-select';

export default function CreateUser() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collectionPointsOptions, setCollectionPointsOptions] = useState<
    CollectionPointOption[]
  >([]);
  const [driverListData, setDriverListData] = useState<CollectionPointOption[]>(
    []
  );

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        const result = (await listCollection()) as ListCollectionInterface;
        console.log('Result of CP API', result);
        setCollectionPointsOptions(
          result?.data?.map((point) => ({
            value: point.id,
            label: point.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching collection points:', error);
      }
    };

    fetchCollectionPoints();
  }, []);
  useEffect(() => {
    const fetchDriverListData = async () => {
      try {
        const result = (await listDrivers()) as ListCollectionInterface;
        console.log('Result of list driver', result);
        setDriverListData(
          result?.data?.map((point) => ({
            value: point.id,
            label: point.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching collection points:', error);
      }
    };

    fetchDriverListData();
  }, []);

  const onSubmit: SubmitHandler<PickupReqFormInput> = async (data) => {
    const formattedData = {
      collection_point_id: data.collection_point_id,
      driver_id: data.driver_id,
      materialType: data.materialType,
      date: new Date(data.date).toISOString().split('T')[0],
      approximateWeight: parseInt(data.approximateWeight),
    };

    setLoading(true);

    try {
      const response = await initiateJobs(formattedData);
      const resultData = response.data as JobsListResponse;

      console.log('API Response:', resultData);

      if (resultData.status == true) {
        setReset({
          collection_point_id: '',
          driver_id: '',
          materialType: '',
          date: '',
          approximateWeight: '',
        });
        closeModal();
        toast.success('New Job created successfully', {
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
      {' '}
      <Toaster position="top-right" />
      <Form<PickupReqFormInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={pickupReqFormSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Request for pickup
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeModal}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>

              <Controller
                name="collection_point_id"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Select LSG
                    </label>
                    <Select
                      options={collectionPointsOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      value={collectionPointsOptions.find(
                        (option) => String(option.value) === String(value)
                      )}
                      className="col-span-full"
                      onChange={(selectedOption) => {
                        onChange(selectedOption?.value); // Set the selected value
                      }}
                      name={name}
                    />
                  </div>
                )}
              />

              <Input
                label="Date"
                type="date"
                className="col-span-full"
                {...register('date')}
                error={errors.date?.message}
              />

              <Controller
                name="materialType"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <div className="col-span-full flex flex-col gap-2 ">
                    <label
                      htmlFor={name}
                      className=" font-medium text-gray-900 dark:text-white"
                    >
                      Material Selection
                    </label>
                    <Select
                      options={[
                        { value: 'reject', label: 'reject' },
                        { value: 'recycle', label: 'recycle' },
                        { value: 'mixed', label: 'mixed' },
                      ]}
                      className="col-span-full"
                      // value={{ value: value, label: value }}
                      value={value ? { value, label: value } : null}
                      onChange={(selectedOption) =>
                        onChange(selectedOption?.value)
                      }
                      name={name}
                    />
                  </div>
                )}
              />

              {/* <Input
                label="Driver"
                placeholder="Select Driver"
                {...register('driver_id')}
                error={errors.driver_id?.message}
              /> */}
              <Controller
                name="driver_id"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Select Driver
                    </label>
                    <Select
                      options={driverListData.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      value={driverListData.find(
                        (option) => String(option.value) === String(value)
                      )}
                      className="col-span-full scroll"
                      onChange={(selectedOption) => {
                        onChange(selectedOption?.value); 
                      }}
                      name={name}
                    />
                  </div>
                )}
              />

              <Input
                label="Approximate Weight"
                placeholder="Enter approx weight"
                className="col-span-full"
                {...register('approximateWeight')}
                error={errors.approximateWeight?.message}
              />

              {errorMessage && (
                <div className="col-span-full text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )}

              <div className="col-span-full flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="w-full @xl:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full @xl:w-auto"
                >
                  Initiate Job Request
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
