import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import moment from 'moment';

export const MemberProfile = ({
  data = {
    name: '',
    totalHours: ''
  }
}) => {
  return (
    <div className='flex px-3 py-4'>
      <img
        src='https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-12.webp'
        className="flex-shrink-0 shadow-sm xs:!h-10 xs:!w-10 rounded-full mr-2"
      />
      <div className='flex flex-col'>
        <div className='capitalize mb-1'>{data.name}</div>
        <small><b>{data.totalHours} hrs</b></small>
      </div>
    </div>
  )
}

export const TableHeaderCell = ({ date = '' }) => {
  return (
    <div className='flex flex-col items-center'>
        {
          moment(date, 'YYYY-MM-DD').format('ddd DD').split(' ').map(df => (
            <span>{df}</span>
          ))
        }
      </div>
  )
}

export const ShiftDataCell = ({
  data = {
    userId: null,
    shifts: [],
    summary: null
  },
  createShift = () => { },
  editShift = (shiftData: any) => { }
}) => {
  return (
    <div
      className='cursor-pointer px-2 py-2 flex flex-col items-center'
    >
      {
        data.userId &&
        (
          data.shifts.length > 0 ?
            data.shifts.map((s: any) => (
              <div onClick={() => editShift(s)}>
                <Badge
                  variant="flat"
                  rounded="pill"
                  className="w-[90px] font-medium text-white whitespace-nowrap mb-1"
                  color="primary"
                >
                  {moment(s.shift.start_time).format('HH:mm')} -
                  {moment(s.shift.end_time).format('HH:mm')}
                </Badge>
              </div>
            )) :
            <Button
              className="w-full"
              variant="outline"
              onClick={createShift}
            >
              +
            </Button>
        )
      }
      {
        data.summary &&
        <div className='font-bold'>{data.summary}</div>
      }
    </div>
  )
}