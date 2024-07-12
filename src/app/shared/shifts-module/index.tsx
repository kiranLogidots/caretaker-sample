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
    color: '#6c5ce7',
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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState();
  const perPage = 10;

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

  const fetchShifts = async (page: number = 1) => {
    setLoading(true);
    const params = {
      branchId: branchId,
      page: page,
      perPage: perPage,
      // status: 'open',
    };
    try {
      const resp = await getOpenShifts(params);
      setShiftsDataArray(resp?.data);
      setPaginationMeta(resp?.meta);
      console.log(resp);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchShifts(page);
  };

  useEffect(() => {
    fetchShifts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, currentPage]);

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 @container">
        <Title as="h2" className="-order-6 basis-2/5 @xl:basis-auto">
          Batch Shifts
        </Title>
        <Link href="/shifts/create-shifts">
          <Button className="mt-5 w-full bg-[#6c5ce7] text-xs capitalize text-white @lg:w-auto sm:text-sm lg:mt-0">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Batch Shifts
          </Button>
        </Link>
      </div>
      <div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="shift tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            display: 'flex',
            gap: '10px',
            '& .MuiTabs-indicator': {
              backgroundColor: '#6c5ce7',
            },
          }}
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
          currentPage={currentPage}
          onPageChange={handlePageChange}
          paginationMeta={paginationMeta}
        />
      </TabPanel>
    </div>
  );
};

export default ShiftsModule;
