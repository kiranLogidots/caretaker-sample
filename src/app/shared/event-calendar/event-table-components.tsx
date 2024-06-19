import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import Image from 'next/image';
import { Fragment } from 'react';

export const MemberProfile = ({
  data = {
    name: '',
    totalHours: '',
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
        <p className="text-gray text-xs font-light">{data.employment_status}</p>
        <small className="flex justify-end">
          <b>{data.totalHours} hrs</b>
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
}) => {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-1 px-2 py-2">
      {data.userId &&
        (data.shifts.length > 0 ? (
          <>
            {data.shifts.map((s: any, i) => (
              <div onClick={() => editShift(s)} key={i + '_' + s.shift.id}>
                <Button
                  className="disabled w-full border-green-400 px-5"
                  variant="outline"
                >
                  {moment(s.shift.start_time).format('HH:mm')} -
                  {moment(s.shift.end_time).format('HH:mm')}
                </Button>
                {/* <Badge
                variant="flat"
                rounded="pill"
                className="mb-1 w-[90px] whitespace-nowrap font-medium text-white"
                color="secondary"
              >
                {moment(s.shift.start_time).format('HH:mm')} -
                {moment(s.shift.end_time).format('HH:mm')}
              </Badge> */}
              </div>
            ))}
            <Button className="w-full" variant="outline" onClick={createShift}>
              +
            </Button>
          </>
        ) : (
          <Button className="w-full" variant="outline" onClick={createShift}>
            +
          </Button>
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
