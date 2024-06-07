import React, { useState } from 'react'
import { DatePicker } from '@/components/ui/datepicker';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext } from 'react-hook-form';
import { useDrawer } from '../../drawer-views/use-drawer';

interface UnpaidBreak {
    shift: string;
    break: string;
}

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const shiftOptions: { label: string; value: string }[] = [
    { label: 'Morning Shift', value: 'morning' },
    { label: 'Afternoon Shift', value: 'afternoon' },
    // ... other options
];

const breakOptions: { label: string; value: string }[] = [
    { label: '15 Minutes', value: '15' },
    { label: '30 Minutes', value: '30' },
    // ... other options
];


function SchedulingRules() {
    const { closeDrawer } = useDrawer();
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const [isLoading, setLoading] = useState(false);
    const [value, setValue] = useState(options[0]);
    const [rules, setRules] = useState<UnpaidBreak[]>([]);

    const addRule = () => {
        setRules((prevRules) => [...prevRules, { shift: '', break: '' }]);
    };

    const removeRule = (index: number) => {
        if (index > 0) {
            setRules((prevRules) => prevRules.filter((_, i) => i !== index));
        }
    };

    const handleShiftChange = (value: string, index: number) => {
        setRules((prevRules) =>
            prevRules.map((rule, i) => (i === index ? { ...rule, shift: value } : rule))
        );
    };

    const handleBreakChange = (value: string, index: number) => {
        setRules((prevRules) =>
            prevRules.map((rule, i) => (i === index ? { ...rule, break: value } : rule))
        );
    };

    return (
        <>
            <div className='flex flex-col gap-8'>
                <h3>Configure default rules</h3>
                <text className='font-bold'>These rules will be applied to shifts and call outs for this position.</text>
                <div>
                    <text>Location</text><br />
                    <text className='font-bold'>J360 Training</text>
                </div>
                <div>
                    <text>Position</text><br />
                    <text className='font-bold'>Default </text>
                    <text className=' font-light'>(Applies to all position unless otherwise specified)</text>
                </div>
                <hr />
                <div className='flex flex-col gap-5'>
                    <text>Overtime Thresholds</text>
                    <div className='flex justify-evenly items-center gap-4'>
                        <Select
                            // label="Select"
                            className='flex-1'
                            options={options}
                            value={value}
                            onChange={setValue}
                        />
                        <text className='flex-1'>Per day *</text>
                    </div>
                    <div className='flex justify-evenly items-center gap-4'>
                        <Select
                            // label="Select"
                            className='flex-1'
                            options={options}
                            value={value}
                            onChange={setValue}
                        />
                        <text className='flex-1'>Per day *</text>
                    </div>
                    <text>* Excludes unpaid breaks.</text>
                </div>
                <hr />
                <div>
                    <text>Minimum Time Between Shifts</text>
                    <Select
                        // label="Select"
                        className=' w-1/2'
                        options={options}
                        value={value}
                        onChange={setValue}
                    />
                </div>
                <hr />
                <div>
                    <text>Default Unpaid Breaks</text>
                    <div className='flex justify-evenly'>
                        <div><text>For shifts over or exactly</text></div>
                        <div><text>Default unpaid break to</text></div>
                    </div>
                    <div >
                        {rules.map((rule, index) => (
                            <div key={index} className='flex justify-evenly items-center gap-3 mt-4'>
                                <Select
                                    // label="Shift"
                                    
                                    value={rule.shift}
                                    onChange={(value) => handleShiftChange(value as string, index)}
                                    options={shiftOptions}
                                />
                                <Select
                                    // label="Break"
                                    value={rule.break}
                                    onChange={(value) => handleBreakChange(value as string, index)}
                                    options={breakOptions}
                                />
                                {index > 0 && <button onClick={() => removeRule(index)}>X</button>}
                                {index < 1 && <button className=' w-5' onClick={() => removeRule(index)}> </button>}
                                
                            </div>
                        ))}
                    </div>
                    <button onClick={addRule}>Add Another Rule</button>

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
                    >
                        Save
                    </Button>
                </div>
            </div>
        </>
    )
}

export default SchedulingRules