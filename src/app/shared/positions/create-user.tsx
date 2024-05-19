'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { Title } from '@/components/ui/text';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { createPositionCat } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import { CreatePositionCatResponse } from '@/types';
import {
  EventHKSFormInput,
  eventHKSFormSchema,
} from '@/utils/validators/create-event-hks.schema';
import { signOut } from 'next-auth/react';

export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<EventHKSFormInput> = async (data) => {
    const formattedData = {
      name: data.name,
      description: data.description,
    };

    setLoading(true);

    try {
      const response = await createPositionCat(formattedData);
      const resultData = response.data as CreatePositionCatResponse[];

      console.log('API Response:', resultData);

      if (resultData) {
        setReset({
          name: '',
          description: '',
        });
        closeModal();
        toast.success('Position Category created successfully', {
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
      <Form<EventHKSFormInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={eventHKSFormSchema}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a position
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeModal}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              <Input
                label="Name"
                placeholder="Enter name of the event"
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
                  Create Position Category
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
