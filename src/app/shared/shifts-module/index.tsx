'use client';

import React, { useEffect, useState } from 'react';
import { Text, Title } from '@/components/ui/text';
import { Button, type ButtonProps } from '@/components/ui/button';
import { PiPlusBold } from 'react-icons/pi';
import Link from 'next/link';
import { Tabs, Tab, Box, Paper, styled } from '@mui/material';
import UpcomingShifts from './components/UpcomingShifts';
import PastShifts from './components/PastShifts';
import RecentShifts from './components/RecentShifts';
import { getOpenShifts } from '@/service/page';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { useParams } from 'next/navigation';

const CustomTab = styled(Tab)(({ theme }) => ({
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  border: '.5px outset',
  '&.Mui-selected': {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  marginLeft: 0,
  marginRight: theme.spacing(1),
  fontSize: '12px',
  fontWeight: 'bold',
}));

const ShiftsModule = () => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const [tabValue, setTabValue] = React.useState(2);
  const [shiftsDataArray, setShiftsDataArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`shifts-tabpanel-${index}`}
        aria-labelledby={`shifts-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  };

  const fetchShifts = async () => {
    setLoading(true);
    const params = {
      branchId: branchId,
      status: 'open',
    };
    try {
      const resp = await getOpenShifts(params);
      setShiftsDataArray(resp?.data);
      console.log(resp);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 @container">
        <Title as="h2" className="-order-6 basis-2/5 @xl:basis-auto">
          Shifts
        </Title>
        <Link href="/shifts/create-shifts">
          <Button className="mt-5 w-full bg-[#6c5ce7] text-xs capitalize text-white @lg:w-auto sm:text-sm lg:mt-0">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Shifts
          </Button>
        </Link>
      </div>
      <div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="shift tabs"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ display: 'flex', gap: '10px' }}
        >
          <CustomTab label="Upcoming Shifts" />
          <CustomTab label="Past Shifts" />
          <CustomTab label="Recently Created Shifts" />
        </Tabs>
      </div>
      <TabPanel value={tabValue} index={0}>
        <UpcomingShifts />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PastShifts />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <RecentShifts
          shiftsDataArray={shiftsDataArray}
          fetchShifts={fetchShifts}
          loading={loading}
        />
      </TabPanel>
    </div>
  );
};

export default ShiftsModule;
