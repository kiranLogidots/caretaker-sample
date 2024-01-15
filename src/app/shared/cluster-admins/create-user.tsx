'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import {
  CreateUserInput,
  createUserSchema,
} from '@/utils/validators/create-user.schema';
import { Title } from '@/components/ui/text';
import { Select } from '@/components/ui/select';
import { Password } from '@/components/ui/password';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  permissions,
  roles,
  statuses,
} from '@/app/shared/cluster-admins/utils';
import { createCluster } from '@/service/page';
export default function CreateUser() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    const formattedData = {
      user_type: 'cluster_admin',
      name: data.fullName,
      age: parseInt(data.age),
      address: data.address,
      phone: data.phone,
      email:data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    };
    setLoading(true);

    try {
      const resultData = (await createCluster(formattedData)) as {
        status: boolean;
      };
      console.log('Cluster Data API Response:', resultData);
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
      }
      // setTimeout(() => {
      //   console.log('formattedData', formattedData);
      //   setLoading(false);
      //   setReset({
      //     fullName: '',
      //     email: '',
      //     phone: '',
      //     age: '',
      //     address: '',
      //     role: '',
      //     permissions: '',
      //     status: '',
      //   });
      //   closeModal();
      // }, 600);
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error (e.g., display an error message to the user)
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
              className="col-span-full"
              error={errors.fullName?.message}
            />

            <Input
              label="Email"
              placeholder="Enter user's Email Address"
              className="col-span-full"
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
              label="Address"
              placeholder="Enter user's Address"
              className="col-span-full"
              {...register('address')}
              error={errors.address?.message}
            />

            <Input
              label="Age"
              placeholder="Enter user's age"
              className="col-span-full"
              {...register('age')}
              error={errors.age?.message}
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
  );
}
