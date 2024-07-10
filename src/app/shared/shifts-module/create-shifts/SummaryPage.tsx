import { createOpenShift } from '@/service/page';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';

const SummaryPage = ({
  summaryData,
  setOpenSummary,
  scheduleSettings,
}: {
  summaryData?: any;
  setOpenSummary?: any;
  scheduleSettings: any;
}) => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function rearrangeSummary(summary: any) {
    const map = new Map();
    const result: any = [];

    summary.forEach((item: any) => {
      if (map.has(item.position.value)) {
        map.get(item.position.value).push(item);
      } else {
        map.set(item.position.value, [item]);
      }
    });

    map.forEach((value) => {
      result.push(...value);
    });

    return result;
  }

  const rearrangedSummary = rearrangeSummary(summaryData?.shifts);

  const calculateTotalTime = (start: any, end: any, breakMinutes: any) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = diffMs / (1000 * 60);
    const totalTimeMins = diffMins - breakMinutes;

    const hours = Math.floor(totalTimeMins / 60);
    const minutes = Math.floor(totalTimeMins % 60);

    return `${hours}hrs ${minutes}min`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const updatedShifts = summaryData?.shifts.map((shift: any) => {
      const {
        start_time,
        end_time,
        end_date,
        starting_day,
        interval_type,
        interval_count,
        ...rest
      } = shift;

      const startDate = new Date(shift.date);
      const startTime = new Date(start_time);
      const endTime = new Date(end_time);

      startTime.setFullYear(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      endTime.setFullYear(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      return {
        ...rest,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        assigned_date: moment(shift.date).format('YYYY-MM-DD'),
        position_id: shift.position.value,
        schedule_settings: scheduleSettings,
        is_over_time_allowed: false,
        organization_branch_id: branchId,
        ...(end_date && {
          recurring_shift: {
            end_date,
            starting_day,
            interval_type,
            interval_count,
          },
        }),
      };
    });
    const shiftsData = { shifts: updatedShifts };

    try {
      const resp = await createOpenShift(shiftsData);
      router.push('/shifts');
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-2xl font-medium">Shifts summary</p>
      </div>

      <div className="space-y-3">
        {rearrangedSummary?.map((summary: any, index: any) => (
          <div
            key={index}
            className="w-full space-y-3 rounded-md bg-[#e1e6f2] pt-3 shadow-sm"
          >
            <p className="px-4 font-bold text-black">
              {summary.position.label}
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#e1e6f2]">
                <thead>
                  <tr className="border-b border-t border-black">
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Shift Date
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Time
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Break Time
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Paid Duration
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Team Member
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: summary.quantity }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-t border-black bg-[#e1e6f2]"
                    >
                      {idx === 0 && (
                        <td
                          className="px-4 py-2 text-center font-medium"
                          rowSpan={summary.quantity}
                        >
                          {moment(summary?.date).format('ddd, MMM DD')}
                        </td>
                      )}
                      <td className="px-4 py-2 text-center font-medium">
                        {moment(new Date(summary?.start_time)).format('h a')} -{' '}
                        {moment(new Date(summary?.end_time)).format('h a')}
                      </td>
                      <td className="px-4 py-2 text-center font-medium">
                        {summary?.unpaid_break} min
                      </td>
                      <td className="px-4 py-2 text-center font-medium">
                        {calculateTotalTime(
                          summary?.start_time,
                          summary?.end_time,
                          summary?.unpaid_break
                        )}
                      </td>
                      <td className="px-4 py-2 text-center font-medium">
                        Open shift
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {summary.end_date && (
                <div className="flex gap-2 px-4 py-3">
                  <HiOutlineArrowPathRoundedSquare />
                  {summary.interval_type === 'week' ? (
                    <p className="text-xs">
                      Repeat{' '}
                      {summary?.interval_count === 1
                        ? 'every'
                        : summary?.interval_count === 2
                          ? 'two'
                          : summary?.interval_count === 3
                            ? 'three'
                            : summary?.interval_count === 4
                              ? 'four'
                              : ''}{' '}
                      week on {summary.starting_day}
                    </p>
                  ) : summary.interval_type === 'day' ? (
                    <p className="text-xs">
                      Repeat{' '}
                      {summary?.interval_count === 1
                        ? 'every'
                        : summary?.interval_count === 2
                          ? 'two'
                          : summary?.interval_count === 3
                            ? 'three'
                            : summary?.interval_count === 4
                              ? 'four'
                              : ''}{' '}
                      day from{' '}
                      <span className="font-medium">
                        {moment(summary.date).format('ddd MMMM, DD')}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {moment(summary.end_date).format('ddd MMMM, DD')}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs">
                      Repeat{' '}
                      {summary?.interval_count === 1
                        ? 'every'
                        : summary?.interval_count === 2
                          ? 'two'
                          : summary?.interval_count === 3
                            ? 'three'
                            : summary?.interval_count === 4
                              ? 'four'
                              : ''}{' '}
                      month until{' '}
                      <span className="font-medium">
                        {moment(summary.end_date).format('ddd MMMM, DD')}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-end gap-2 pt-3">
        <button
          onClick={() => setOpenSummary(false)}
          className="rounded bg-gray-400 px-8 py-2 font-bold text-white "
        >
          Edit
        </button>
        <button
          onClick={handleSubmit}
          className={`rounded bg-[#6c5ce7] px-8 py-2 font-bold text-white ${
            loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* <div className="space-y-3">
        {summaryData.shifts.map((summary: any, index: number) => {
          return (
            <div
              className="w-full rounded-md bg-[#e1e6f2] py-6 shadow-sm"
              key={index}
            >
              <p className="px-4 font-bold text-black">
                {summary.position.label}
              </p>
              <hr className="my-3 border-t border-black" />
              <div className="container mx-auto">
                <div className="grid grid-cols-5 gap-4 px-2 pr-6 font-bold text-black">
                  <p className="text-center">Shift Date</p>
                  <p className="text-center">Time</p>
                  <p className="text-center">Break Time</p>
                  <p className="text-center">Paid Duration</p>
                  <p className="text-center">Team Member</p>
                </div>
                <hr className="my-3 border-t-2 border-black" />
                <div className="grid grid-cols-5 gap-4">
                  <p className="flex items-center justify-center text-center font-medium">
                    {moment(summary?.date).format('ddd, MMM DD')}
                  </p>
                  <div className="col-span-4 space-y-2">
                    {Array.from({ length: summary.quantity }).map((_, idx) => (
                      <div key={idx} className="grid grid-cols-4 gap-4">
                        <p className="text-center font-medium">
                          <span>
                            {moment(new Date(summary?.start_time)).format(
                              'h a'
                            )}
                          </span>
                          <span> - </span>
                          <span>
                            {moment(new Date(summary?.end_time)).format('h a')}
                          </span>
                        </p>
                        <p className="text-center font-medium">
                          {summary?.unpaid_break} min
                        </p>
                        <p className="text-center font-medium">
                          {calculateTotalTime(
                            summary?.start_time,
                            summary?.end_time,
                            summary?.unpaid_break
                          )}
                        </p>
                        <p className="text-center font-medium">Open shift</p>
                        {idx < summary.quantity - 1 && (
                          <hr className="col-span-4 my-3 border-t border-black" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default SummaryPage;
