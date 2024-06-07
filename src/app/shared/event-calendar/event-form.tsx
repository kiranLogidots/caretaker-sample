'use client';

import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { ActionIcon, Button, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import cn from '@/utils/class-names';
import {
  EventFormInput,
  eventFormSchema,
} from '@/utils/validators/create-event.schema';
import { assignShiftToUser } from '@/service/page';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CreateEventProps {
  id: string | number | null | undefined;
  assignedDate: string;
  startDate?: Date;
  endDate?: Date;
  event?: any;
  eventTemplate?: any;
  user?: any;
  refresh: Function;
  unpaid_break?: number;
  shift_notes?: string | undefined;
}

export default function EventForm({
  id,
  assignedDate,
  startDate,
  endDate,
  event,
  eventTemplate,
  user,
  unpaid_break,
  shift_notes,
  refresh = () => {},
}: CreateEventProps) {
  const { closeModal } = useModal();
  const unpaidBreakOptions = [
    {
      label: 'No Unpaid Break',
      value: 0,
    },
    {
      label: '30m',
      value: 30,
    },
    {
      label: '1h',
      value: 60,
    },
  ];

  const isUpdateEvent = !!id;
  const [duration, setDuration] = useState('');

  const onSubmit: SubmitHandler<EventFormInput> = async (data) => {
    console.log(data);
    if (!isUpdateEvent) {
      const requestData = {
        ...eventTemplate,
        organization_branch_id: user.organization_branch_id,
        user_id: user.user_id,
        assigned_date: assignedDate,
        ...data,
      };

      // Only include shift_notes if it is not empty
      if (!data.shift_notes) {
        delete requestData.shift_notes;
      }
      try {
        await assignShiftToUser(requestData);
      } catch (error: any) {
        console.log(error);
        const err = error?.response?.data?.message;
        const errorAr = error?.response?.data?.message[0];
        if (err) {
          toast.error(err);
        } else if (errorAr) {
          toast.error(errorAr);
        } else {
          toast.error('Somethng went wrong');
        }
      }
      refresh();
      closeModal();
    }
  };

  const calculateTotalTime = (start: any, end: any, breakMinutes: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60); // convert milliseconds to minutes
    const totalTimeMins = diffMins - breakMinutes;

    const hours = Math.floor(totalTimeMins / 60);
    const minutes = Math.floor(totalTimeMins % 60);
    return `${hours}hrs ${minutes}min`;
  };

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_time: startDate ?? event?.start,
      end_time: endDate ?? event?.end,
      unpaid_break: unpaid_break ?? 60,
      shift_notes: shift_notes ?? '',
    },
  });

  const watchedStartDate = useWatch({ control, name: 'start_time' });
  const watchedEndDate = useWatch({ control, name: 'end_time' });
  const watchedUnpaidBreak = useWatch({ control, name: 'unpaid_break' });

  useEffect(() => {
    setDuration(
      calculateTotalTime(watchedStartDate, watchedEndDate, watchedUnpaidBreak)
    );
  }, [watchedStartDate, watchedEndDate, watchedUnpaidBreak]);

  return (
    <div className="m-auto p-4 md:px-7 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          {isUpdateEvent ? 'Update Assigned Shift' : 'New Assigned Shift'} -{' '}
          {user?.branch?.branch_name}
        </Title>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>
      {eventTemplate?.position_name && (
        <div className="d-flex mb-5 w-full flex-col">
          <p className="font-medium">Position</p>
          <h5 className="font-normal">{eventTemplate.position_name}</h5>
        </div>
      )}
      <Form<EventFormInput>
        validationSchema={eventFormSchema}
        //@ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        useFormProps={{
          defaultValues: {
            start_time: startDate ?? event?.start,
            end_time: endDate ?? event?.end,
            unpaid_break: unpaid_break ?? 60,
            shift_notes: shift_notes ?? '',
          },
        }}
        className="grid grid-cols-1 gap-5 @container md:grid-cols-2 [&_label]:font-medium"
      >
        {() => {
          // const startDate = watch('start_time');
          // const endDate = watch('end_time');
          // const unpaidBreak = watch('unpaid_break');

          // useEffect(() => {
          //   setDuration(calculateTotalTime(startDate, endDate, unpaidBreak));
          // }, [startDate, endDate, unpaidBreak]);
          return (
            <>
              <Controller
                name="start_time"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <p className="mb-1 font-medium">Start Time</p>
                    <DatePicker
                      title="Start time"
                      selected={value}
                      onChange={onChange}
                      selectsStart
                      startDate={value}
                      endDate={endDate}
                      minDate={new Date()}
                      showTimeSelect
                      dateFormat=" h:mm aa"
                      selectsRange={false}
                    />
                  </div>
                )}
              />
              <Controller
                name="end_time"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <p className="mb-1 font-medium">End Time</p>
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      selectsEnd
                      minDate={startDate}
                      startDate={startDate}
                      endDate={value}
                      showTimeSelect
                      dateFormat=" h:mm aa"
                      selectsRange={false}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="unpaid_break"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Unpaid Breaks"
                    dropdownClassName="z-[9999]"
                    options={unpaidBreakOptions}
                    onChange={onChange}
                    value={value}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected: any) =>
                      unpaidBreakOptions.find((b) => b.value === selected)
                        ?.label
                    }
                  />
                )}
              />
              <div className="flex flex-col gap-1.5">
                <p className="mt-1 font-medium">Duration</p>
                <p className="font-medium">{duration}</p>
              </div>

              <div className="col-span-full flex flex-col gap-1.5">
                <p className="mt-1 font-medium">Notes</p>
                <textarea
                  {...register('shift_notes')}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  rows={2}
                ></textarea>
              </div>
              <div className={cn('col-span-full grid grid-cols-2 gap-4 pt-5')}>
                <Button
                  variant="outline"
                  className="w-full @xl:w-auto dark:hover:border-gray-400"
                  onClick={() => closeModal()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="hover:gray-700 w-full text-white hover:bg-gray-700 @xl:w-auto dark:bg-gray-200 dark:hover:bg-gray-300 dark:active:enabled:bg-gray-300"
                >
                  Save
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}
