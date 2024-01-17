'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import {  SubmitHandler } from 'react-hook-form';
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

import { createEvent } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import { CreateEventResponse } from '@/types';
import axios from 'axios';
import { EventHKSFormInput, eventHKSFormSchema } from '@/utils/validators/create-event-hks.schema';

export default function CreateUser() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<EventHKSFormInput> = async (data) => {
    const formattedData = {
      name: data.name,
      expense: data.expense,
      date: data.date,
    };

    setLoading(true);

    try {
      const response = await createEvent(formattedData);
      const resultData = response.data as CreateEventResponse;

      console.log('API Response:', resultData);

      if (resultData.status == true) {
        setReset({
          name: '',
          expense: '',
          date: '',
        });
        closeModal();
        toast.success('Event created successfully', {
          position: 'top-right',
        });
      }
    } catch (err: any) {
      console.log('Error message ', err.message);
      if (err.response.data) {
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
                  Add a new User
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
                label="Expense"
                placeholder="Enter expense"
                className="col-span-full"
                {...register('expense')}
                error={errors.expense?.message}
              />
              <Input
                label="Date"
                type="date"
                className="col-span-full"
                {...register('date')}
                error={errors.date?.message}
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
                  Create Event
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
