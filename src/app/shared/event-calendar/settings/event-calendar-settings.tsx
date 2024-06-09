import { useForm, FormProvider } from 'react-hook-form';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import GeneralEventSettings from './general';
import { useDrawer } from '@/app/shared/drawer-views/use-drawer';
import SchedulingRules from './scheduling-rules';
// import { Select } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Select } from 'rizzui'
import axios from 'axios';


export default function EventCalendarSettings() {
    const { closeDrawer } = useDrawer();
    const methods = useForm();
    const [selectedTab, setSelectedTab] = useState('general'); // State to track selected navigation option
    const [schedulingSettings, setSchedulingSettings] = useState(null);

    useEffect(() => {
        const branchId = sessionStorage.getItem('organizationBranchId');
        const accessToken = sessionStorage.getItem('accessToken');
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.nexsysi.alpha2.logidots.com/api/v1/scheduling-settings/branch/${branchId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setSchedulingSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch scheduling settings:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className=' max-h-full overflow-y-auto'>
                <FormProvider {...methods}>
                    <div className="flex items-center justify-between mb-5 mt-4">
                        <div></div>
                        <h3 className=' text-center '>Schedule Settings</h3>
                        <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                            <PiXBold className="h-auto w-5" />
                        </ActionIcon>
                    </div>

                    <div className="flex justify-evenly">
                        <button className={` min-w-[50%] pb-3 ${selectedTab === 'general' ? ' border-b-4 border-b-violet-700' : ''}`} onClick={() => setSelectedTab('general')}>General</button>
                        <button className={` min-w-[50%] pb-3 ${selectedTab === 'scheduling' ? 'border-b-4 border-b-violet-700' : ''}`} onClick={() => setSelectedTab('scheduling')}>Scheduling Rules</button>
                    </div>
                    <hr />

                    <div className='m-10'>
                        {schedulingSettings && selectedTab === 'general' && <GeneralEventSettings schedulingSettings={schedulingSettings} />}
                        {schedulingSettings && selectedTab === 'scheduling' && <SchedulingRules schedulingSettings={schedulingSettings} />}
                    </div>
                </FormProvider>
            </div>
        </>
    );
}