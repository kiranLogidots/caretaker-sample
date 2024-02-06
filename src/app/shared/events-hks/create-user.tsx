'use client';

import { useCallback, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import {
  Controller,
  SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { Title } from '@/components/ui/text';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { createEvent, saveImageUpload } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import { CreateEventResponse, SaveImageUpload } from '@/types';
import axios from 'axios';
import {
  EventHKSFormInput,
  eventHKSFormSchema,
} from '@/utils/validators/create-event-hks.schema';
import { signOut } from 'next-auth/react';
import Select from 'react-select';
import FormGroup from '../form-group';
import UploadZone from '@/components/ui/file-upload/upload-zone';
interface FileType {
  name: string;
  url: string;
  size: number;
}
export default function CreateUser() {
  const { getValues, setValue, control } = useForm();
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<FileType[]>([]);
  const handleUploadedImages = (newImages: FileType[]) => {
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };
  const onSubmit: SubmitHandler<EventHKSFormInput> = async (data) => {
    const formattedData = {
      name: data.name,
      expense: parseInt(data.expense),
      date: new Date(data.date).toISOString().split('T')[0],
      no_of_participants: parseInt(data.no_of_participants),
      description: data.description,
      other_description: data.other_description,
      organised_by: data.organised_by,
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
          no_of_participants: '',
          description: '',
          other_description: '',
          organised_by: '',
        });
        closeModal();
        toast.success('Event created successfully', {
          position: 'top-right',
        });
      }
      const event_id = resultData.data?.id;
      console.log('event id', event_id);

      const saveEventImageData : SaveImageUpload = {
        event_id: event_id,
        images: uploadedImages.map((image) => image.name),
      };

      //save image upload api calling
      const EventsImagesSave = await saveImageUpload(saveEventImageData);
      console.log('saveImageUpload response', EventsImagesSave);

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
                  Add a new Event
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeModal}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>
              <Input
                label="Name"
                placeholder="Enter name of the event"
                // className="col-span-full"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Expense"
                placeholder="Enter expense"
                // className="col-span-full"
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

              <Input
                label="Number of Participants"
                placeholder="Enter number of participants"
                // className="col-span-full"
                {...register('no_of_participants')}
                error={errors.no_of_participants?.message}
              />
              <Input
                label="Description"
                placeholder="Enter description"
                // className="col-span-full"
                {...register('description')}
                error={errors.description?.message}
              />
              <Input
                label="Other Description"
                placeholder="Enter other description"
                // className="col-span-full"
                {...register('other_description')}
                error={errors.other_description?.message}
              />
              <Controller
                name="organised_by"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <div className=" flex flex-col gap-2">
                    <label
                      htmlFor={name}
                      className=" font-medium text-gray-900 dark:text-white"
                    >
                      Event Type
                    </label>
                    <Select
                      options={[
                        { value: 'greenworms', label: 'greenworms' },
                        { value: 'lsg', label: 'lsg' },
                        { value: 'other', label: 'other' },
                      ]}
                      value={{ value: value, label: value } || ''}
                      onChange={(selectedOption) =>
                        onChange(selectedOption?.value)
                      }
                      name={name}
                    />
                  </div>
                )}
              />
              <FormGroup
                title="Upload images"
                description="Upload yourimages here"
                // className={cn(className)}
                className="col-span-full"
              >
                <UploadZone
                  className="col-span-full "
                  name="productImages"
                  getValues={getValues}
                  setValue={setValue}
                  // onDrop={onDrop}
                  onImagesUploaded={handleUploadedImages}
                />
              </FormGroup>

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
