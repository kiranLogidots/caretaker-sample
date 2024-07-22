import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/store/quick-cart/copy.context';
import moment from 'moment';
import Image from 'next/image';
import { Fragment, useEffect } from 'react';
import { BiCopy, BiSolidPaste, BiTrash } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import DeletePopover from '../delete-popover';
import { capitalizeWords } from '@/lib/helperFunctions';

export const MemberProfile = ({
  data = {
    name: '',
    totalHours: 0,
    employment_status: '',
  },
}) => {
  return (
    <div className="flex w-full px-3 py-4">
      <Image
        src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-12.webp"
        className="mr-2 flex-shrink-0 rounded-full shadow-sm xs:!h-10 xs:!w-10"
        alt={data.name}
        width={10}
        height={10}
      />
      <div className="flex w-full flex-col">
        <div className="mb-1 flex capitalize">{data.name}</div>
        <p className="text-gray text-xs font-light">
          {capitalizeWords(data.employment_status)}
        </p>
        <small className="flex justify-end">
          <b>{data.totalHours !== 0 ? data.totalHours.toFixed(2) : '0'} hrs</b>
        </small>
      </div>
    </div>
  );
};

export const TableHeaderCell = ({ date = '' }) => {
  return (
    <div className="flex flex-col items-center">
      {moment(date, 'YYYY-MM-DD')
        .format('ddd DD')
        .split(' ')
        .map((df, i) => (
          <span key={i + '_' + df}>{df}</span>
        ))}
    </div>
  );
};

export const ShiftDataCell = ({
  data = {
    userId: null,
    shifts: [],
    summary: null,
  },
  createShift = () => {},
  editShift = (shiftData: any) => {},
  handleCopy = (shift: any) => {},
  //@ts-ignore
  cellKey,
  handlePasteData = (cellKey: any, id: any) => {},
  deleteShift = (id: number) => {},
  disableAddButton = false,
}) => {
  const { isCopy } = useCopy();

  return (
    <div className="flex cursor-pointer flex-col items-center gap-1 px-2 py-2">
      {data.userId &&
        (data.shifts.length > 0 ? (
          <>
            {data.shifts.map((s: any, i) => (
              <div
                className="group w-full"
                onClick={() => editShift(s)}
                key={i + '_' + s.shift.id}
              >
                {/* <div className="relative flex w-full flex-col"> */}
                <div className="flex w-full flex-col items-center justify-center gap-1 rounded-md border border-green-400 p-1">
                  <p className="text-xs">
                    {moment(s.shift.start_time).format('HH:mm')}-
                    {moment(s.shift.end_time).format('HH:mm')}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(s);
                      }}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <BiCopy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <DeletePopover
                        title={`Delete`}
                        description={`Are you sure you want to delete this shift ?`}
                        onDelete={() => deleteShift(s.shift_id)}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="group relative w-full">
              <Button
                className="w-full"
                variant="outline"
                onClick={createShift}
                disabled={disableAddButton}
              >
                +
              </Button>
              {isCopy && (
                <div className="absolute inset-y-0 -right-2 flex items-center pr-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePasteData(cellKey, data.userId);
                    }}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <BiSolidPaste className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="group relative w-full">
            <Button
              className="w-full"
              variant="outline"
              onClick={createShift}
              disabled={disableAddButton}
            >
              +
            </Button>
            {isCopy && (
              <div className="absolute inset-y-0 -right-2 flex items-center pr-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePasteData(cellKey, data.userId);
                  }}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <BiSolidPaste className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      {data.summary && <div className="font-bold">{data.summary}</div>}
    </div>
  );
};

export const PositionHoursDataCell = ({ data }: { data: any }) => {
  const hours = Math.floor(data?.totalMinutes / 60);
  const minutes = data?.totalMinutes % 60;
  return (
    <div className="flex items-center justify-center px-2 py-2">
      {hours} hr {minutes} min
    </div>
  );
};
