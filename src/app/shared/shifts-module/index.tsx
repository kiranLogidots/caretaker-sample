'use client';

import React from 'react';
import { Text, Title } from '@/components/ui/text';
import { Button, type ButtonProps } from '@/components/ui/button';
import { PiPlusBold } from 'react-icons/pi';
import Link from 'next/link';

const ShiftsModule = () => {
  return (
    <div className="mt-4">
      <div className=" mb-4 flex flex-wrap items-center justify-between gap-2.5 @container ">
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
    </div>
  );
};

export default ShiftsModule;
