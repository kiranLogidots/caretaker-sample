'use client';

import { PiDownloadSimpleBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { Button, type ButtonProps } from '@/components/ui/button';
import cn from '@/utils/class-names';

interface DownloadButtonProps extends ButtonProps {
  label?: string;
  className?: string;
  customSize?: string;
  icon?: React.ReactNode;
  onClickFunction: () => void;
}

export default function DownloadButton({
  label = 'Add New',
  className,
  customSize = '500px',
  onClickFunction,
  icon = <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />,
  ...rest
}: DownloadButtonProps) {
  return (
    <Button
      className={cn(
        'mt-5 w-full text-xs capitalize @lg:w-auto sm:text-sm lg:mt-0 text-white',
        className
      )}
      onClick={onClickFunction} 
      {...rest}
    >
      {icon}
      {label}
    </Button>
  );
}
