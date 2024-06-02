'use client';

import uniqueId from 'lodash/uniqueId';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { ActionIcon, Button, Input, Text, Textarea, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select'
import toast from 'react-hot-toast';
import { DatePicker } from '@/components/ui/datepicker';
import cn from '@/utils/class-names';
import { CalendarEvent } from '@/types';
import useEventCalendar from '@/hooks/use-event-calendar';
import {
  EventFormInput,
  eventFormSchema,
} from '@/utils/validators/create-event.schema';
import { useEffect } from 'react';
import { assignShiftToUser, getShifts, viewBranch } from '@/service/page';

interface CreateEventProps {
  assignedDate: Date;
  startDate?: Date;
  endDate?: Date;
  event?: any;
  eventTemplate?: any;
  user?: any;
}

export default function EventForm({
  assignedDate,
  startDate,
  endDate,
  event,
  eventTemplate,
  user
}: CreateEventProps) {
  const { closeModal } = useModal();
  const unpaidBreakOptions = [
    {
      label: 'No Unpaid Break',
      value: 0
    },
    {
      label: '30m',
      value: 30
    },
    {
      label: '1h',
      value: 60
    }
  ];

  const isUpdateEvent = event !== undefined;

  const onSubmit: SubmitHandler<EventFormInput> = (data) => {
    assignShiftToUser({
      ...eventTemplate,
      organization_branch_id: user.organization_branch_id,
      user_id: user.user_id,
      assigned_date: assignedDate,
      ...data
    });
    //closeModal();
  };

  return (
    <div className="m-auto p-4 md:px-7 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          {isUpdateEvent ? 'Update Shift' : 'Create a new shift'}
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

      <Form<EventFormInput>
        validationSchema={eventFormSchema}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: {
            start_time: startDate ?? event?.start,
            end_time: endDate ?? event?.end,
            unpaid_break: 60
          },
        }}
        className="grid grid-cols-1 gap-5 @container md:grid-cols-2 [&_label]:font-medium"
      >
        {({ register, control, watch, formState: { errors } }) => {
          const startDate = watch('start_time');
          const endDate = watch('end_time');
          return (
            <>
              <Controller
                name="start_time"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    title='Start time'
                    selected={value}
                    onChange={onChange}
                    selectsStart
                    startDate={value}
                    endDate={endDate}
                    minDate={new Date()}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    fixedHeight
                  />
                )}
              />
              <Controller
                name="end_time"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value}
                    onChange={onChange}
                    selectsEnd
                    minDate={startDate}
                    startDate={startDate}
                    endDate={value}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
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
                        displayValue={(selected: any) => unpaidBreakOptions.find(b => b.value === selected)?.label}
                      />
                  )}
                />
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
                  className="hover:gray-700 w-full hover:bg-gray-700 @xl:w-auto dark:bg-gray-200 text-white dark:hover:bg-gray-300 dark:active:enabled:bg-gray-300"
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
