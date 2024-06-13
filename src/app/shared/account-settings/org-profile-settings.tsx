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
// import { countries, roles, timezones } from '@/data/forms/my-details';
// import AvatarUpload from '@/components/ui/file-upload/avatar-upload';
import { useEffect, useState } from 'react';
import axios from 'axios';

// const Select = dynamic(
//     () => import('@/components/ui/select').then((mod) => mod.Select),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="grid h-10 place-content-center">
//                 <Spinner />
//             </div>
//         ),
//     }
// );

// const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
//     ssr: false,
// });

export default function OrgInfoView() {
  // const onSubmit: SubmitHandler<PersonalInfoFormTypes> = (data) => {
  //     toast.success(<Text as="b">Successfully added!</Text>);
  //     console.log('Profile settings data ->', {
  //         ...data,
  //     });
  // };
  const onSubmit = () => {
    toast.success(<Text as="b">Successfully added!</Text>);
  };
  type Org = {
    company_name: string;
    company_address_line_one: string;
    company_address_line_two: string;
    work_email: string;
    industryType: {
      name: string;
    };
    accountType: {
      name: string;
    };
  };

  const [org, setOrg] = useState<Org | null>(null);

  const fetchUser = async () => {
    console.log('fetching user');
    const token = sessionStorage.getItem('accessToken');
    const OrgId = sessionStorage.getItem('organizationId');
    const response = await axios.get(
      `https://api.nexsysi.alpha2.logidots.com/api/v1/organizations/${OrgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setOrg(response.data);
    console.log('user ->', response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Form
      //   validationSchema={personalInfoFormSchema}
      // resetValues={reset}
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
            {/* <FormGroup
              title="Personal Info"
              description="Update your photo and personal details here"
              className=""
            /> */}

            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Organization Name"
                className="@3xl:grid-cols-12 "
              >
                <Input
                  placeholder="Organization Name"
                  //   {...register('first_name')}
                  //   error={errors.first_name?.message}
                  className="col-span-full"
                  value={org?.company_name}
                  disabled
                />
              </FormGroup>

              <FormGroup
                title="Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  //   prefix={
                  //     <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  //   }
                  //   type="email"
                  placeholder="Address Line 1"
                  //   {...register('email')}
                  //   error={errors.email?.message}
                  value={org?.company_address_line_one}
                  disabled
                />
                <Input
                  className="col-span-full"
                  //   prefix={
                  //     <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  //   }
                  //   type="email"
                  placeholder="Address Line 2"
                  //   {...register('email')}
                  //   error={errors.email?.message}
                  value={org?.company_address_line_two}
                  disabled
                />
              </FormGroup>
              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="email@example.com"
                  // {...register('email')}
                  // error={errors.email?.message}
                  value={org?.work_email}
                  disabled
                />
              </FormGroup>
              <FormGroup
                title="Industry Type"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Industry Type"
                  //   {...register('first_name')}
                  //   error={errors.first_name?.message}
                  className="col-span-full"
                  value={org?.industryType.name}
                  disabled
                />
              </FormGroup>

              <FormGroup
                title="Account Type"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Account Type"
                  //   {...register('first_name')}
                  //   error={errors.first_name?.message}
                  className="col-span-full"
                  value={org?.accountType.name}
                  disabled
                />
              </FormGroup>

              {/* <FormGroup
                                title="Your Photo"
                                description="This will be displayed on your profile."
                                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                            >
                                <div className="flex flex-col gap-6 @container @3xl:col-span-2">
                                    <AvatarUpload
                                        name="avatar"
                                        setValue={setValue}
                                        getValues={getValues}
                                        error={errors?.avatar?.message as string}
                                    />
                                </div>
                            </FormGroup> */}

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

            {/* <FormFooter
                            // isLoading={isLoading}
                            altBtnText="Cancel"
                            submitBtnText="Save"
                        /> */}
          </>
        );
      }}
    </Form>
  );
}
