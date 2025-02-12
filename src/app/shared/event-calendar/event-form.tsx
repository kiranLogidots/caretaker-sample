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
import {
  assignShiftToUser,
  editAssignShiftToUser,
  getSchedulingSettings,
} from '@/service/page';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';

interface CreateEventProps {
  id: string | number | null | undefined;
  shift_id?: string | number | null | undefined;
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

const unpaidBreakOptions = [
  {
    label: 'No Unpaid Break',
    value: 0,
  },
  { label: '10 mins', value: 10 },
  { label: '20 mins', value: 20 },
  { label: '30 mins', value: 30 },
  { label: '40 mins', value: 40 },
  { label: '50 mins', value: 50 },
  { label: '60 mins', value: 60 },
];

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
  shift_id,
  refresh = () => {},
}: CreateEventProps) {
  const { closeModal } = useModal();
  const [selectedBranch] = useAtom(selectedBranchAtom);

  const [defaultUnpaidBreaks, setDefaultUnpaidBreaks] = useState<any[]>([]);
  const branchId = selectedBranch?.value;

  const isUpdateEvent = !!id;
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<EventFormInput> = async (data) => {
    setLoading(true);
    const requestData = {
      ...eventTemplate,
      organization_branch_id: user.organization_branch_id,
      user_id: user.user_id,
      assigned_date: assignedDate,
      ...data,
    };

    if (!data.shift_notes) {
      delete requestData.shift_notes;
    }

    if (!isUpdateEvent) {
      try {
        await assignShiftToUser(requestData);
        refresh();
      } catch (error: any) {
        console.log(error);
        const err = error?.response?.data?.message;
        const errorAr = error?.response?.data?.message[0];
        if (err) {
          toast.error(err);
        } else if (errorAr) {
          toast.error(errorAr);
        } else {
          toast.error('Something went wrong');
        }
      }
    } else {
      try {
        await editAssignShiftToUser(Number(shift_id), requestData);
        refresh();
      } catch (error: any) {
        console.log(error);
        const err = error?.response?.data?.message;
        const errorAr = error?.response?.data?.message[0];
        if (err) {
          toast.error(err);
        } else if (errorAr) {
          toast.error(errorAr);
        } else {
          toast.error('Something went wrong');
        }
      }
    }
    closeModal();
  };

  useEffect(() => {
    const fetchScheduleSettings = async () => {
      try {
        const response = await getSchedulingSettings(Number(branchId));
        setDefaultUnpaidBreaks(response?.default_unpaid_breaks);
        console.log(response?.default_unpaid_breaks);
      } catch (error) {
        console.error('Failed to fetch scheduling settings:', error);
      }
    };

    fetchScheduleSettings();
  }, [branchId]);

  const findUnpaidBreak = (start: any, end: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60);

    defaultUnpaidBreaks.sort(
      (a, b) => a.for_shifts_over_or_exact - b.for_shifts_over_or_exact
    );

    for (let i = defaultUnpaidBreaks.length - 1; i >= 0; i--) {
      if (diffMins >= defaultUnpaidBreaks[i]?.for_shifts_over_or_exact) {
        return defaultUnpaidBreaks[i]?.default_unpaid_break_to;
      }
    }
    return 0; // or any default value if no match is found
  };

  const calculateTotalTime = (start: any, end: any, breakMinutes: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60); // convert milliseconds to minutes
    const totalTimeMins = diffMins - breakMinutes;

    // const unpaidBreak = findUnpaidBreak(diffMins);
    // setValue('unpaid_break', unpaidBreak);
    // console.log(diffMins, unpaidBreak, 'unpaidBreak');

    const hours = Math.floor(totalTimeMins / 60);
    const minutes = Math.floor(totalTimeMins % 60);
    return `${hours}hrs ${minutes}min`;
  };

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_time: startDate ?? event?.start,
      end_time: endDate ?? event?.end,
      unpaid_break: unpaid_break ?? 0,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchedStartDate,
    watchedEndDate,
    watchedUnpaidBreak,
    defaultUnpaidBreaks,
  ]);

  useEffect(() => {
    const unpaidBreak = findUnpaidBreak(watchedStartDate, watchedEndDate);
    if (!unpaid_break || unpaid_break === 0) {
      setValue('unpaid_break', unpaidBreak);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedStartDate, watchedEndDate, defaultUnpaidBreaks]);

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
            unpaid_break: unpaid_break ?? 0,
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
                      selected={value}
                      onChange={onChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      //@ts-ignore
                      minTime={new Date().setHours(0, 0, 0, 0)}
                      //@ts-ignore
                      maxTime={new Date().setHours(23, 59, 59, 999)}
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
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      //@ts-ignore
                      minTime={
                        watchedStartDate
                          ? new Date(watchedStartDate.getTime() + 60000)
                          : new Date().setHours(0, 0, 0, 0)
                      } // Min time set to one minute after the start time
                      //@ts-ignore
                      maxTime={new Date().setHours(23, 59, 59, 999)}
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
                  disabled={loading}
                  isLoading={loading}
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
