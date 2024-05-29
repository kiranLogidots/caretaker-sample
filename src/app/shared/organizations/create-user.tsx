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
import { useModal } from '@/app/shared/modal-views/use-modal';
import { createOrg, listAccountTypes, listIndustryTypes } from '@/service/page';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import {
  CreateUserResponse,
  ListAccountInterface,
  ListIndustryInterface,
} from '@/types';
import { useDrawer } from '../drawer-views/use-drawer';
import { signOut } from 'next-auth/react';

export default function CreateUser() {
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountTypes, setAccountTypes] = useState< { value: number; label: string }[]>([]);
  const { register, control, watch, setValue, handleSubmit, formState: { errors },} = useForm();
  const [industryTypes, setIndustryTypes] = useState< { value: number; label: string }[]>([]);

  useEffect(() => {
    const fetchIndustryTypes = async () => {
      try {
        const industryTypesData =
          (await listIndustryTypes()) as ListIndustryInterface[];
        setIndustryTypes(
          industryTypesData.map((type) => ({
            value: type.id,
            label: type.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching industry types:', error);
      }
    };

    fetchIndustryTypes();
  }, []);

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const result = (await listAccountTypes()) as ListAccountInterface[];
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

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    console.log('The create user button is clicked', data);

    const formattedData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      industry_type_id: Number(data.industry_type_id),
      account_type_id: Number(data.account_type_id),
      // industry_type_id: parseInt(data.industry_type_id)?.value,
      // account_type_id: parseInt(data.account_type_id)?.value,
      // industry_type_id: data.industry_type_id?.value,
      // account_type_id: data.account_type_id?.value,
      company_name: data.company_name,
      company_address_line_one: data.company_address_line_one,
      company_address_line_two: data.company_address_line_two,
      country: data.country,
      postal_code: data.postal_code,
      work_phone: data.work_phone,
      work_email: data.work_email,
    };

    setLoading(true);

    try {
      const response = await createOrg(formattedData);
      const resultData = response.data as CreateUserResponse;
      console.log('API Response of create Org:', resultData);

      if (resultData.message = "Organization and Organization Admin created successfully") {
        setReset({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          industry_type_id: '',
          account_type_id: '',
          company_name: '',
          company_address_line_one: '',
          company_address_line_two: '',
          country: '',
          postal_code: '',
          work_phone: '',
          work_email: '',
        });
        closeDrawer();
        toast.success('User created successfully', {
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
      }  else if (err.response?.data?.statusCode === 400) {
        setErrorMessage(err.response.data.message.join(' '));
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
                  Add new organization
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
                label="Work Email"
                placeholder="Enter work email"
                {...register('work_email')}
                error={errors.work_email?.message}
              />

              <Input
                label="Phone"
                placeholder="Enter work phone number"
                labelClassName="font-medium text-gray-900 dark:text-white"
                {...register('work_phone')}
                defaultValue="+91"
                error={errors.work_phone?.message}
              />
              
              <Controller
              name="account_type_id"
              control={control}
              render={({ field }) => (
                <div className="col-span- flex flex-col gap-2">
                  <label
                    htmlFor={field.name}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    Account Type
                  </label>
                  <Select
                    options={accountTypes}
                    value={accountTypes.find(at => at.value === field.value)}
                    onChange={option => field.onChange(option ? option.value : null)}
                    name={field.name}
                    isClearable
                  />
                </div>
              )}
            />
            <Controller
              name="industry_type_id"
              control={control}
              render={({ field }) => (
                <div className="col-span- flex flex-col gap-2">
                  <label
                    htmlFor={field.name}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    Industry Type
                  </label>
                  <Select
                    options={industryTypes}
                    value={industryTypes.find(it => it.value === field.value)}
                    onChange={option => field.onChange(option ? option.value : null)}
                    name={field.name}
                    isClearable
                    // menuPortalTarget={document.body}
                    // styles={{
                    //   menuPortal: base => ({ ...base, zIndex: 9999 }),
                    //   menu: base => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
                    // }}
                  />
                </div>
              )}
            />

              <Input
                label="Company Name"
                placeholder="Enter company name"
                className="col-span-full"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
              <Input
                label="Company Address Line One"
                placeholder="Enter company address"
                // className="col-span-full"
                {...register('company_address_line_one')}
                error={errors.company_address_line_one?.message}
              />
              <Input
                label="Company Address Line Two"
                placeholder="Enter company address"
                // className="col-span-full"
                {...register('company_address_line_two')}
                error={errors.company_address_line_two?.message}
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
                  Create Organization
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
