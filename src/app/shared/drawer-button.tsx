'use client';

import { PiPlusBold } from 'react-icons/pi';
import { useDrawer } from '@/app/shared/drawer-views/use-drawer';
import { Button, type ButtonProps } from '@/components/ui/button';
import cn from '@/utils/class-names';

interface DrawerButtonProps extends ButtonProps {
  label?: string;
  className?: string;
  customSize?: string;
  icon?: React.ReactNode;
  view: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
}

export default function DrawerButton({
  label = 'Add New',
  className,
  customSize = '500px',
  view,
  icon = <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />,
  placement = 'right',
  ...rest
}: DrawerButtonProps) {
  const { openDrawer } = useDrawer();
  return (
    <Button
      className={cn(
        'mt-5 w-full text-xs capitalize @lg:w-auto sm:text-sm lg:mt-0 text-white bg-[#4286F5]',
        className
      )}
      onClick={() =>
        openDrawer({
          view,
          placement,
          customSize,
        })
      }
      {...rest}
    >
      {icon}
      {label}
    </Button>
  );
}
