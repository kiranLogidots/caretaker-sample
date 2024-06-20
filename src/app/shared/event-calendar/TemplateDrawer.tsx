import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiXBold } from 'react-icons/pi';
import { BiTrash } from 'react-icons/bi';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import { createTemplate, deleteTemplate, listTemplate } from '@/service/page';

interface TemplateDrawerProps {
  setTemplateDrawer: Dispatch<SetStateAction<boolean>>;
  tabvalue: number;
  eventsData: any;
}

const TemplateDrawer: React.FC<TemplateDrawerProps> = ({
  setTemplateDrawer,
  tabvalue,
  eventsData,
}) => {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;

  const [templateName, setTemplateName] = useState('');
  const [error, setError] = useState('');
  const [templateArray, setTemplateArray] = useState([]);

  const results = eventsData.map((user: any) => {
    const userResults: { day: number; shift_id: number }[] = [];
    const dates = Object.keys(user).filter(
      (key) => key !== 'userId' && key !== 'teamMember'
    );

    dates.forEach((date, index) => {
      const dayShifts = user[date].shifts;
      dayShifts.forEach((shift: any) => {
        userResults.push({ day: index, shift_id: shift.shift_id });
      });
    });

    return userResults;
  });

  const handleSubmit = async () => {
    const requestData = {
      name: templateName,
      week: tabvalue,
      organization_branch_id: branchId,
      template_shifts: results.flat(),
    };

    try {
      const resp = await createTemplate(requestData);
      fetchTemplate();
      setError('');
    } catch (error: any) {
      console.log(error?.response?.data?.message, 'template error');
      setError(error?.response?.data?.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTemplate(Number(id));
      fetchTemplate();
      setError('');
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    }
  };

  const fetchTemplate = async () => {
    try {
      const response = await listTemplate(Number(branchId));
      setTemplateArray(response);
    } catch (error: any) {
      console.log(error.response.data.message, 'List template error');
    }
  };

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-y-auto">
      <div className="mb-5 mt-4 flex items-center justify-between px-5">
        <h3 className=" text-center ">Create template</h3>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => setTemplateDrawer(false)}
        >
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <hr />

      <div className="w-full px-4">
        <input
          placeholder="Enter template name"
          className="w-full rounded-md border-gray-200 placeholder:text-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0"
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <p className="mt-2 pl-4 text-sm font-medium text-gray-500">
          {tabvalue} week
        </p>
      </div>

      {error && (
        <div className="col-span-full text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      <div className="col-span-full flex items-center justify-end gap-4 px-4">
        <Button
          variant="outline"
          onClick={() => setTemplateDrawer(false)}
          className="w-full @xl:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full text-white @xl:w-auto"
        >
          Create template
        </Button>
      </div>

      <div className="flex w-full flex-col gap-2 px-4">
        {templateArray?.map((template: any) => (
          <div
            key={template?.id}
            className="flex w-full items-center justify-between rounded-md border px-4 py-3"
          >
            <div className="w-full">
              <p>Template: {template?.name}</p>
              <p>{template?.week} week</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-xs">Apply </div>
              <ActionIcon
                size="sm"
                variant="text"
                onClick={() => handleDelete(template?.id)}
              >
                <BiTrash className="h-auto w-5" />
              </ActionIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateDrawer;
