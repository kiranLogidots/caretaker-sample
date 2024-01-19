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
  createUserSchema,
} from '@/utils/validators/create-user.schema';
import { Title } from '@/components/ui/text';
// import { Select } from '@/components/ui/select';
import { Password } from '@/components/ui/password';
import { useModal } from '@/app/shared/modal-views/use-modal';
// import {
//   permissions,
//   roles,
//   statuses,
// } from '@/app/shared/roles-permissions/utils';
import {
  assignCollectionPoints,
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
import axios from 'axios';
import { signOut } from 'next-auth/react';

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
  // Convert the CollectionPointOption objects to strings.
  //  const collectionPointStrings = selectedCollectionPoints.map(
  //   (option: { label: any }) => option.label
  // );
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
    console.log('The create user button is clicked', data);

    const formattedData = {
      user_type: 'hks_users',
      name: data.fullName,
      age: parseInt(data.age),
      address: data.address,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirmPassword,
    };

    setLoading(true);

    try {
      const response = await createHSK(formattedData);
      const resultData = response.data as CreateUserResponse;
      console.log('API Response:', resultData);

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
          collectionPoints: '',
        });
        closeModal();
        toast.success('User created successfully', {
          position: 'top-right',
        });
      }
      const user_id = resultData.data.id;
      const collectionPointsData = {
        user_id: user_id,
        collectionPointIds: selectedCollectionPoints.map(
          (point: { value: number }) => point.value
        ),
      };
      const assignPointsResult =
        await assignCollectionPoints(collectionPointsData);
      console.log('Assign Points', assignPointsResult);
    } catch (err: any) {
      console.log('Error message ', err.message);
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
      // signOut();
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
        validationSchema={createUserSchema}
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
                error={errors.fullName?.message}
              />

              <Input
                label="Email"
                placeholder="Enter user's Email Address"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Phone"
                placeholder="Enter phone number"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <Input
                label="Age"
                placeholder="Enter user's age"
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

              <Controller
                name="collectionPoints"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <Select
                    options={collectionPointsOptions}
                    value={value}
                    className="col-span-full"
                    onChange={onChange}
                    name={name}
                    isMulti
                    // label="Collection Points"
                    // error={errors?.status?.message}
                    // getOptionValue={(option) => option.value}
                    // displayValue={(selected: string) =>
                    //   permissions.find((option) => option.value === selected)    ?.label ?? ''
                    // }
                    // dropdownClassName={'z-[9999]'}
                  />
                )}
              />

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
              {errorMessage && (
                <div className="col-span-full font-semibold text-sm text-red-500">{errorMessage}</div>
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
