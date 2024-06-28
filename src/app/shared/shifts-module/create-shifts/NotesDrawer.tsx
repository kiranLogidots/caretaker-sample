import React, { useState } from 'react';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { CiClock2 } from 'react-icons/ci';
import moment from 'moment';
import { LuDot } from 'react-icons/lu';
import { useFormContext } from 'react-hook-form';

interface NotesDrawerProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setShiftNote?: React.Dispatch<React.SetStateAction<string>>;
  shiftQuantity: number;
  startTime: Date;
  endTime: Date;
  date: Date | null;
  shiftNote: string;
  positionName: string;
  index: number;
}

const NotesDrawer: React.FC<NotesDrawerProps> = ({
  setDrawer,
  shiftQuantity,
  startTime,
  endTime,
  date,
  setShiftNote,
  shiftNote,
  positionName,
  index,
}) => {
  const { setValue } = useFormContext();

  const maxCharacters = 2000;
  const [notes, setNotes] = useState(shiftNote);

  const handleChange = (event: any) => {
    const { value } = event.target;
    if (value.length <= maxCharacters) {
      setNotes(value);
    }
  };

  const handleSave = () => {
    setValue(`shifts[${index}].shift_notes`, notes);
    setDrawer(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-5 overflow-y-auto px-5">
      <div className="mb-5 mt-4 flex items-center justify-between ">
        <h6 className=" flex-1 text-center">New Shift x{shiftQuantity}</h6>
        <ActionIcon size="sm" variant="text" onClick={() => setDrawer(false)}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <div className="">
        <h3>Edit Details</h3>
        <div className="flex items-center gap-1 pt-3 text-xs font-medium">
          <CiClock2 />
          <span>{moment(date).format('ddd, MMM D')}</span>
          <LuDot />
          <span>{moment(startTime).format('h a')}</span>
          <span>-</span>
          <span>{moment(endTime).format('h a')}</span>
        </div>
        <div className="pt-3 text-xs font-medium text-black">
          {positionName}
        </div>
      </div>
      <hr />
      <div className="w-full">
        <p className="text-xs font-medium">Shift Notes</p>
        <textarea
          rows={3}
          placeholder="Type notes..."
          className="w-full rounded-md placeholder:text-xs"
          value={notes}
          onChange={handleChange}
        ></textarea>
        <p className="pt-2 text-left text-xs text-gray-500">
          {notes.length}/{maxCharacters}
        </p>
      </div>
      <div className="absolute bottom-5 right-5">
        <button
          className=" rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleSave()}
          type="button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NotesDrawer;
