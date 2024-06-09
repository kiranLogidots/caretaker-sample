import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/datepicker';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { useDrawer } from '../../drawer-views/use-drawer';

interface GeneralEventSettingsProps {
  schedulingSettings: SchedulingSettings;
}

interface SchedulingSettings {
  last_pay_period_start_date: string | null;
  over_time_calculation_period_length: string | null;
  [key: string]: any; // This allows for any other keys in the object
}

interface OptionType {
  value: string;
  label: string;
}

const PeriodOption: OptionType[] = [
  {
    value: 'ups',
    label: 'UPS',
  },
  {
    value: 'usps',
    label: 'USPS',
  },
  {
    value: 'fedex',
    label: 'FedEx',
  },
];

const OvertimePeriodOption: OptionType[] = [
  {
    value: '1',
    label: '1 Week',
  },
  {
    value: '2',
    label: '2 Weeks',
  },
];

const GeneralEventSettings: React.FC<GeneralEventSettingsProps> = ({ schedulingSettings }) => {
  const { closeDrawer } = useDrawer();
  const { setValue, formState: { errors } } = useFormContext();
  const [isLoading, setLoading] = useState(false);

  // Set default start date
  const defaultStartDate = new Date('2024-05-01');
  const initialStartDate = schedulingSettings?.last_pay_period_start_date ? new Date(schedulingSettings.last_pay_period_start_date) : defaultStartDate;

  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [overtimePeriod, setOvertimePeriod] = useState<string>(
    schedulingSettings?.over_time_calculation_period_length
      ? `${schedulingSettings.over_time_calculation_period_length} Week`
      : OvertimePeriodOption[0].label
  );

  const [tempData, setTempData] = useState<SchedulingSettings>(schedulingSettings);

  useEffect(() => {
    if (schedulingSettings) {
      const newStartDate = schedulingSettings.last_pay_period_start_date ? new Date(schedulingSettings.last_pay_period_start_date) : defaultStartDate;
      setStartDate(newStartDate);
      setOvertimePeriod(
        schedulingSettings.over_time_calculation_period_length
          ? `${schedulingSettings.over_time_calculation_period_length} Week`
          : OvertimePeriodOption[0].label
      );
      setTempData(schedulingSettings);
    }
  }, [schedulingSettings]);

  useEffect(() => {
    setValue('lastPayPeriodStartDate', startDate);
    setValue('overtimePeriod', overtimePeriod);
  }, [startDate, overtimePeriod, setValue]);

  const handleDateChange = (date: Date) => {
    setStartDate(date);
    setTempData((prevData) => ({ ...prevData, last_pay_period_start_date: date.toISOString().split('T')[0] }));
  };

  const handlePeriodChange = (selectedOption: OptionType) => {
    setOvertimePeriod(selectedOption.label);
    setTempData((prevData) => ({ ...prevData, over_time_calculation_period_length: selectedOption.value }));
  };

  return (
    <div className='flex flex-col gap-6'>
      <h3>Overtime Calculation Period</h3>
      <p className='font-bold'>These settings will determine the overtime calculations and scheduling views for the location.</p>
      <div>
        <p>Location</p>
        <p className='font-bold'>{tempData.organization_branch_id}</p>
      </div>
      <div>
        <p className='mb-2'>Last pay period start date</p>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          dateFormat="dd/MM/yyyy"
          wrapperClassName="w-full"
        />
      </div>
      <div>
        <Select
          label="Overtime Calculation Period"
          options={OvertimePeriodOption}
          value={overtimePeriod}
          onChange={(selectedOption: OptionType) => handlePeriodChange(selectedOption)}
          dropdownClassName='z-[10000]'
          error={errors?.overtimePeriod?.message as string}
        />
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={closeDrawer}
          className="w-full xl:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full xl:w-auto"
          onClick={() => {alert('Save clicked' + JSON.stringify(tempData));}}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default GeneralEventSettings;
