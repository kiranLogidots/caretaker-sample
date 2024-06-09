import React, { useState, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { useDrawer } from '../../drawer-views/use-drawer';
import { FaCirclePlus } from "react-icons/fa6";
import { PiXBold } from 'react-icons/pi';

interface SchedulingSettingsProps {
  schedulingSettings: SchedulingSettings;
}

interface SchedulingSettings {
  location: string;
  position: string;
  [key: string]: any; // Allows for additional keys
}

interface OptionType {
  value: string;
  label: string;
}

interface Rule {
  for_shifts_over_or_exact: string;
  default_unpaid_break_to: string;
}

const overtimethresholdsOptions: OptionType[] = [
  { label: '1 hrs', value: '1' },
  { label: '2 hrs', value: '2' },
  { label: '3 hrs', value: '3' },
  { label: '4 hrs', value: '4' },
  { label: '5 hrs', value: '5' },
  { label: '6 hrs', value: '6' },
  { label: '7 hrs', value: '7' },
  { label: '8 hrs', value: '8' },
  { label: '9 hrs', value: '9' },
  { label: '10 hrs', value: '10' },
  { label: '11 hrs', value: '11' },
  { label: '12 hrs', value: '12' },
  { label: '13 hrs', value: '13' },
  { label: '14 hrs', value: '14' },
  { label: '15 hrs', value: '15' },
  { label: '16 hrs', value: '16' },
  { label: '17 hrs', value: '17' },
  { label: '18 hrs', value: '18' },
  { label: '19 hrs', value: '19' },
  { label: '20 hrs', value: '20' },
  { label: '21 hrs', value: '21' },
  { label: '22 hrs', value: '22' },
  { label: '23 hrs', value: '23' },
  { label: '24 hrs', value: '24' },
];

const overtimeperiodOptions: OptionType[] = [
  { label: '10 mins', value: '10' },
  { label: '20 mins', value: '20' },
  { label: '30 mins', value: '30' },
  { label: '40 mins', value: '40' },
  { label: '50 mins', value: '50' },
  { label: '60 mins', value: '60' },
];

const mintimebetweenshiftsOptions: OptionType[] = [
  { label: '10 mins', value: '10' },
  { label: '20 mins', value: '20' },
  { label: '30 mins', value: '30' },
  { label: '40 mins', value: '40' },
  { label: '50 mins', value: '50' },
  { label: '60 mins', value: '60' },
];

const forshiftsOptions: OptionType[] = [
  { label: '1 hrs', value: '1' },
  { label: '2 hrs', value: '2' },
  { label: '3 hrs', value: '3' },
  { label: '4 hrs', value: '4' },
  { label: '5 hrs', value: '5' },
  { label: '6 hrs', value: '6' },
  { label: '7 hrs', value: '7' },
  { label: '8 hrs', value: '8' },
  { label: '9 hrs', value: '9' },
  { label: '10 hrs', value: '10' },
  { label: '11 hrs', value: '11' },
  { label: '12 hrs', value: '12' },
  { label: '13 hrs', value: '13' },
  { label: '14 hrs', value: '14' },
  { label: '15 hrs', value: '15' },
  { label: '16 hrs', value: '16' },
  { label: '17 hrs', value: '17' },
  { label: '18 hrs', value: '18' },
  { label: '19 hrs', value: '19' },
  { label: '20 hrs', value: '20' },
  { label: '21 hrs', value: '21' },
  { label: '22 hrs', value: '22' },
  { label: '23 hrs', value: '23' },
  { label: '24 hrs', value: '24' },
];

const unpaidbreakOptions: OptionType[] = [
  { label: '10 mins', value: '10' },
  { label: '20 mins', value: '20' },
  { label: '30 mins', value: '30' },
  { label: '40 mins', value: '40' },
  { label: '50 mins', value: '50' },
  { label: '60 mins', value: '60' },
];


const SchedulingRules: React.FC<SchedulingSettingsProps> = ({ schedulingSettings }) => {
  const { closeDrawer } = useDrawer();
  const { formState: { errors } } = useFormContext();
  const [isLoading, setLoading] = useState(false);
  const [tempData, setTempData] = useState<SchedulingSettings>(schedulingSettings);

  const [overtimethresholds, setOvertimeThresholds] = useState<string>(
    schedulingSettings?.def_over_time_threshold_per_day
      ? `${schedulingSettings.def_over_time_threshold_per_day} hrs`
      : overtimethresholdsOptions[0].label
  );

  const [overtimeperiod, setOvertimePeriod] = useState<string>(
    schedulingSettings?.def_over_time_threshold_per_over_time_period
      ? `${schedulingSettings.def_over_time_threshold_per_over_time_period} mins`
      : overtimeperiodOptions[0].label
  );

  const [mintimebetweenshifts, setMinTimeBetweenShifts] = useState<string>(
    schedulingSettings?.min_time_between_shifts
      ? `${schedulingSettings.min_time_between_shifts} mins`
      : mintimebetweenshiftsOptions[0].label
  );

  const [rules, setRules] = useState<Rule[]>(schedulingSettings.default_unpaid_breaks);

  useEffect(() => {
    setTempData(schedulingSettings);
    console.log(rules);
  }, [schedulingSettings]);

  const handleovertimethresholdsChange = (selectedOption: OptionType) => {
    setOvertimeThresholds(selectedOption.label);
    setTempData((prevData) => ({ ...prevData, def_over_time_threshold_per_day: selectedOption.value }));
  }

  const handleovertimeperiodChange = (selectedOption: OptionType) => {
    setOvertimePeriod(selectedOption.label);
    setTempData((prevData) => ({ ...prevData, def_over_time_threshold_per_over_time_period: selectedOption.value }));
  }

  const handlemintimebetweenshiftsChange = (selectedOption: OptionType) => {
    setMinTimeBetweenShifts(selectedOption.label);
    setTempData((prevData) => ({ ...prevData, min_time_between_shifts: selectedOption.value }));
  }

  const handleForShiftsChange = (selectedOption: OptionType, index: number) => {
    const updatedRules = rules.map((rule, idx) => {
      if (idx === index) { // Use the index to find the correct rule
        return { ...rule, for_shifts_over_or_exact: selectedOption.value };
      }
      return rule;
    });
    setRules(updatedRules);
  };

  const handleUnpaidBreakChange = (selectedOption: OptionType, index: number) => {
    const updatedRules = rules.map((rule, idx) => {
      if (idx === index) { // Use the index to find the correct rule
        return { ...rule, default_unpaid_break_to: selectedOption.value };
      }
      return rule;
    });
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([...rules, { for_shifts_over_or_exact: '1', default_unpaid_break_to: '10' }]);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, idx) => idx !== index);
    setRules(updatedRules);
  };

  return (
    <div className='flex flex-col gap-6'>
      <h3>Configure default rules</h3>
      <p className='font-bold'>These rules will be applied to shifts and call outs for this position.</p>
      <div>
        <p>Location</p>
        <p className='font-bold'>{tempData.organization_branch_id}</p>
      </div>
      <div>
        <p>Position</p>
        <p className='font-bold'>Default</p>
        <p className='font-light'>(Applies to all positions unless otherwise specified)</p>
      </div>
      <hr />
      <div className='flex flex-col gap-4'>
        <p className='text-base font-bold'>Overtime Thresholds</p>
        <div className='flex justify-evenly items-center gap-4'>
          <Select
            className='flex-1'
            options={overtimethresholdsOptions}
            value={overtimethresholds}
            onChange={(selectedOption: OptionType) => handleovertimethresholdsChange(selectedOption)}
            dropdownClassName='z-[10000]'
          />
          <p className='flex-1 font-bold'>Per day *</p>
        </div>
        <div className='flex justify-evenly items-center gap-4'>
          <Select
            className='flex-1'
            options={overtimeperiodOptions}
            value={overtimeperiod}
            onChange={(selectedOption: OptionType) => handleovertimeperiodChange(selectedOption)}
            dropdownClassName='z-[10000]'
          />
          <p className='flex-1 font-bold'>Per overtime period *</p>
        </div>
        <p className='text-xs font-bold'>* Excludes unpaid breaks.</p>
      </div>
      <hr />
      <div className='flex flex-col gap-4'>
        <p className='text-base font-bold'>Minimum Time Between Shifts</p>
        <Select
          className='w-1/2'
          options={mintimebetweenshiftsOptions}
          value={mintimebetweenshifts}
          onChange={(selectedOption: OptionType) => handlemintimebetweenshiftsChange(selectedOption)}
          dropdownClassName='z-[10000]'
        />
      </div>
      <hr />
      <div className='flex flex-col gap-4'>
        <p className='text-base font-bold'>Default Unpaid Breaks</p>
        <div>
          <div className='flex'>
            <div className='font-bold flex-1'><p>For shifts over or exactly</p></div>
            <div className='font-bold flex-1'><p>Default unpaid break to</p></div>
          </div>
          {/* <div>
            {tempData.defaultUnpaidBreaks.map((_, index) => (
              <div key={index} className='flex justify-evenly items-center gap-3 mt-4'>
                <Select
                  value={null} // Set the actual value based on your state or props
                  onChange={handleForShiftsChange}
                  options={forshiftsOptions}
                  dropdownClassName='z-[10000]'
                />
                <Select
                  value={null} // Set the actual value based on your state or props
                  onChange={handleUnpaidBreakChange}
                  options={unpaidbreakOptions}
                  dropdownClassName='z-[10000]'
                />
                {index > 0 && <button onClick={() => removeRule(index)}><PiXBold className="h-auto w-5" /></button>}
                {index < 1 && <button className='w-6'> </button>}
              </div>
            ))}
          </div> */}
          {/* <div>
            {rules.map((rule: Rule, index: number) => (
              <div key={index} className='flex justify-evenly items-center gap-3 mt-4'>
                <Select
                  value={rule.defaultUnpaidBreakTo}
                  onChange={(selectedOption: OptionType) => handleForShiftsChange(selectedOption)}
                  options={forshiftsOptions}
                  dropdownClassName='z-[10000]'
                />
                <Select
                  value={rule.forShiftsOverOrExact}
                  onChange={(selectedOption: OptionType) => handleUnpaidBreakChange(selectedOption)}
                  options={unpaidbreakOptions}
                  dropdownClassName='z-[10000]'
                />
                {index > 0 && <button onClick={() => removeRule(index)}><PiXBold className="h-auto w-5" /></button>}
                {index < 1 && <button className='w-6'> </button>}
              </div>
            ))}
          </div> */}
          <div>
            {rules.map((rule: Rule, index: number) => (
              <div key={index} className='flex justify-evenly items-center gap-3 mt-4'>
                <Select
                  value={rule.for_shifts_over_or_exact} // Set the actual value based on your state or props
                  onChange={(selectedOption: OptionType) => handleForShiftsChange(selectedOption, index)}
                  options={forshiftsOptions}
                  dropdownClassName='z-[10000]'
                />
                <Select
                  value={rule.default_unpaid_break_to} // Set the actual value based on your state or props
                  onChange={(selectedOption: OptionType) => handleUnpaidBreakChange(selectedOption, index)}
                  options={unpaidbreakOptions}
                  dropdownClassName='z-[10000]'
                />
                {index > 0 && <button onClick={() => removeRule(index)}><PiXBold className="h-auto w-5" /></button>}
                {index < 1 && <button className='w-10'>  </button>}
              </div>
            ))}
          </div>

        </div>
        <button className='flex items-center gap-2' onClick={addRule}><FaCirclePlus />Add Another Rule</button>
      </div>
      <div className="flex items-center justify-end gap-4">
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
          className="w-full @xl:w-auto"
          onClick={() => { alert( JSON.stringify(rules, null, 2) ) } }
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default SchedulingRules;
