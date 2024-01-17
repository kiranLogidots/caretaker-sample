'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import {
  CreateUserInput,
  combinedSchema,
  createUserSchema,
} from '@/utils/validators/create-user.schema';
import { Title } from '@/components/ui/text';
import { Password } from '@/components/ui/password';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { permissions, roles, statuses } from '@/app/shared/drivers/utils';
import {
  assignCollectionPoints,
  createDriver,
  createHSK,
  listCollection,
} from '@/service/page';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import {
  CollectionPointOption,
  CreateUserResponse,
  ListCollectionInterface,
} from '@/types';

export default function CreateUser() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collectionPointsOptions, setCollectionPointsOptions] = useState<
    CollectionPointOption[]
  >([]);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const selectedCollectionPoints = watch('collectionPoints', []);
  console.log('CP SELECTED ARE ', selectedCollectionPoints);

  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        const result = (await listCollection()) as ListCollectionInterface;
        console.log('Result of CP API', result);
        setCollectionPointsOptions(
          result.data.map((point) => ({
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
  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    const formattedData = {
      user_type: 'drivers',
      name: data.fullName,
      age: parseInt(data.age),
      address: data.address,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirmPassword,
    };

    setLoading(true);

    try {
      // const resultData = (await createDriver(
      //   formattedData
      // )) as CreateUserResponse;
      const response = await createHSK(formattedData);

      const resultData = response.data as CreateUserResponse;
      console.log('Driver creation API Response:', resultData);
      if (resultData.status == true) {
        setReset({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          address: '',
          role: '',
          permissions: '',
          status: '',
        });
        closeModal();
        toast.success('User created successfully', {
          position: 'top-right',
        });
      }

      const user_id = resultData.data[0].id;

      const collectionPointsData = {
        user_id: user_id,
        collectionPointIds: selectedCollectionPoints.map(
          (point: { value: number }) => point.value
        ),
      };
      const assignPointsResult =
        await assignCollectionPoints(collectionPointsData);
      console.log('Assign Points', assignPointsResult);
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error (e.g., display an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {' '}
      <Toaster position="top-right" />
      <Form<CreateUserInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={combinedSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a new User
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeModal}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              <Input
                label="Full Name"
                placeholder="Enter user's full name"
                {...register('fullName')}
                // className="col-span-full"
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                placeholder="Enter user's Email Address"
                // className="col-span-full"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Phone"
                placeholder="Enter your phone number..."
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('phone')}
                error={errors.phone?.message}
              />

            

              <Input
                label="Age"
                placeholder="Enter user's age"
                // className="col-span-full"
                {...register('age')}
                error={errors.age?.message}
              />
                <Input
                label="Address"
                placeholder="Enter user's Address"
                className="col-span-full"
                {...register('address')}
                error={errors.address?.message}
              />

              <label
                htmlFor="collectionPoints"
                className=" col-span-full flex flex-col gap-2 text-sm font-medium text-gray-700"
              >
                Collection Points
                <Select
                  id="collectionPoints"
                  placeholder="Select collection points"
                  isMulti
                  className=""
                  options={collectionPointsOptions}
                  {...register('collectionPoints')}
                  value={watch('collectionPoints')}
                  onChange={(selectedOptions) =>
                    setValue('collectionPoints', selectedOptions)
                  }
                />
              </label>

              <Password
                label="Password"
                placeholder="Enter your password"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('password')}
                error={errors.password?.message}
              />
              <Password
                label="Confirm Password"
                placeholder="Enter your password"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              {/* <Controller
              name="role"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={roles}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Role"
                  className="col-span-full"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    roles.find((option) => option.value === selected)?.label ??
                    selected
                  }
                  dropdownClassName={'z-[9999]'}
                />
              )}
            /> */}

              {/* <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={statuses}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Status"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    statuses.find((option) => option.value === selected)
                      ?.label ?? ''
                  }
                  dropdownClassName={'z-[9999]'}
                />
              )}
            /> */}

              {/* <Controller
              name="permissions"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={permissions}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Permissions"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    permissions.find((option) => option.value === selected)
                      ?.label ?? ''
                  }
                  dropdownClassName={'z-[9999]'}
                />
              )}
            /> */}

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
                  Create User
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
