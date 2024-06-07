import React, { useState } from 'react'
import { DatePicker } from '@/components/ui/datepicker';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext } from 'react-hook-form';
import { useDrawer } from '../../drawer-views/use-drawer';

const PeriodOption = [
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

function GeneralEventSettings() {
    const { closeDrawer } = useDrawer();
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const [isLoading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    return (
        <>
            <div className='flex flex-col gap-8'>
                <h3>Overtime Calculation Period</h3>
                <text className=' font-bold'>These settings will determine the overtime calculations and scheduling views for the location.</text>
                <div>
                    <text>Location</text><br />
                    <text className='font-bold'>J360 Training</text>
                </div>
                {/* <Controller
                    name="date"
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                        <DatePicker
                            inputProps={{ label: 'Last pay period start date' }}
                            placeholderText="Select Date"
                            dateFormat="dd/MM/yyyy"
                            onChange={onChange}
                            onBlur={onBlur}
                            wrapperClassName="w-full"
                            //@ts-ignore
                            selected={value}
                        />
                    )}
                /> */}
                <div>
                    <text className=' mb-2'>Last pay period start date</text>
                    <DatePicker
                        name='lastpay'
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        placeholderText="Select Date"
                    />
                </div>
                {/* <Controller
                    name="period select"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            options={PeriodOption}
                            value={value}
                            onChange={onChange}
                            label="Last pay period start date"
                            error={errors?.shippingMethod?.message as string}
                            getOptionValue={(option) => option.label}
                        />
                    )}
                /> */}
                <Select
                    className=''
                    label="Overtime Calculation Period"
                    options={PeriodOption}
                    value={PeriodOption[0]}
                    onChange={() => { }}
                    dropdownClassName=' z-[10000]'
                />
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

export default GeneralEventSettings