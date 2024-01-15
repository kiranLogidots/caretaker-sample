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
import { Dropdown } from 'rizzui';
import Select from 'react-select';

interface CreateUserResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: ResponseData[];
}

interface ResponseData {
  id: number;
  user_type: string;
  name: string;
  phone: string;
  age: number;
  password: string;
  created_by: number;
  roles: RolesResponse[];
  created_at: string;
  updated_at: string;
}

interface RolesResponse {
  id: number;
  name: string;
}

interface ListCollectionInterface {
  status: boolean;
  message: string;
  statusCode: number;
  data: ListData[];
  pagination: Pagination[];
}
interface ListData {
  id: number;
  name: string;
  point_type: string;
  district_id: number;
}

interface Pagination {
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPage: number;
}
interface CollectionPointOption {
  value: number;
  label: string;
}
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
      const resultData = (await createHSK(formattedData)) as CreateUserResponse;

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

    } catch (error) {
      console.error('Error while calling the api:', error);
      // if (error.response && error.response.status === 400) {
      //   setErrorMessage(error.response.data.message);
      // } else {
      //   setErrorMessage(
      //     'An unexpected error occurred. Please try again later.'
      //   );
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
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

            <label
              htmlFor="collectionPoints"
              className=" text-sm font-medium text-gray-700 col-span-full flex flex-col gap-2"
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
            {errorMessage && (
              <div className="col-span-full text-red-500">{errorMessage}</div>
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
  );
}
