'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiClock, PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/utils/validators/personal-info.schema';
// import UploadZone from '@/components/ui/file-upload/upload-zone';
import { countries, roles, timezones } from '@/data/forms/my-details';
// import AvatarUpload from '@/components/ui/file-upload/avatar-upload';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { profileUpdate } from '@/service/page';

const Select = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.Select),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-10 place-content-center">
        <Spinner />
      </div>
    ),
  }
);

const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
  ssr: false,
});

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

export default function PersonalInfoView() {
  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = async (data) => {
    const formattedData = {
      first_name: data.first_name,
      last_name: data.last_name,
    };

    try {
      await profileUpdate(formattedData);
      toast.success('Profile Updated');
    } catch (err: any) {
      console.log('Error message ', err.message);
      toast.error(err?.response?.data?.message);
    }
  };

  const [user, setUser] = useState<User | null>(null);
  const [reset, setReset] = useState({});

  const fetchUser = async () => {
    const token = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');
    const response = await axios.get(
      `https://api.nexsysi.alpha2.logidots.com/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(response.data);
    setReset({
      first_name: response?.data?.first_name,
      last_name: response?.data?.last_name,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Form<PersonalInfoFormTypes>
      validationSchema={personalInfoFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: 'onChange',
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        return (
          <>
            <FormGroup
              title="Personal Info"
              description="Update your photo and personal details here"
              className=""
            />

            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Name"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="First Name"
                  {...register('first_name')}
                  error={errors.first_name?.message}
                  className="flex-grow"
                  // value={user?.first_name}
                />
                <Input
                  placeholder="Last Name"
                  {...register('last_name')}
                  error={errors.last_name?.message}
                  className="flex-grow"
                  // value={user?.last_name}
                />
              </FormGroup>

              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  disabled
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                  value={user?.email}
                />
              </FormGroup>

              <FormGroup
                title="Your Photo"
                description="This will be displayed on your profile."
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <div className="flex flex-col gap-6 @container @3xl:col-span-2">
                  {/* <AvatarUpload
                    name="avatar"
                    setValue={setValue}
                    getValues={getValues}
                    error={errors?.avatar?.message as string}
                  /> */}
                </div>
              </FormGroup>

              {/* <FormGroup
                title="Role"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      placeholder="Select Role"
                      options={roles}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        roles?.find((r) => r.value === selected)?.label ?? ''
                      }
                      error={errors?.role?.message as string}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                title="Country"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="country"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      placeholder="Select Country"
                      options={countries}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        countries?.find((con) => con.value === selected)
                          ?.label ?? ''
                      }
                      error={errors?.country?.message as string}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                title="Timezone"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      prefix={<PiClock className="h-6 w-6 text-gray-500" />}
                      placeholder="Select Timezone"
                      options={timezones}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        timezones?.find((tmz) => tmz.value === selected)
                          ?.label ?? ''
                      }
                      error={errors?.timezone?.message as string}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                title="Bio"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, value } }) => (
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]"
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                    />
                  )}
                />
              </FormGroup> */}

              {/* <FormGroup
                title="Portfolio Projects"
                description="Share a few snippets of your work"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <div className="mb-5 @3xl:col-span-2">
                  <UploadZone
                    name="portfolios"
                    getValues={getValues}
                    setValue={setValue}
                    error={errors?.portfolios?.message as string}
                  />
                </div>
              </FormGroup> */}
            </div>

            <FormFooter
              // isLoading={isLoading}
              altBtnText="Cancel"
              submitBtnText="Save"
            />
          </>
        );
      }}
    </Form>
  );
}
