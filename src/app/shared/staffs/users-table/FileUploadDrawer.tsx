'use client';

import { staffImportCsv } from '@/service/page';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoArrowBackSharp } from 'react-icons/io5';
import { RiUploadLine, RiCloseLine } from 'react-icons/ri';

export default function FileUploadDrawer({
  setOpenDrawer,
  fetchData,
}: {
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: any;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: any) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }
    console.log(file, 'targetvalue1');

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await staffImportCsv(formData);
      const errorData = response?.data?.errorData[0];

      if (errorData) {
        toast.error(errorData?.error_message, {
          duration: 5000,
        });
      }

      if (response?.data?.errorData.length <= 0) {
        toast.success('Import successfully', {
          duration: 5000,
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setOpenDrawer(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-y-auto px-3  pl-5">
      <div
        className="mt-6 flex cursor-pointer items-center gap-3 "
        onClick={() => {
          setOpenDrawer(false);
        }}
      >
        <IoArrowBackSharp size={25} />
        <p className="text-base font-semibold">Back</p>
      </div>
      <div className="pt-12">
        <form onSubmit={handleSubmit} className="flex flex-col space-x-2">
          <p className="mb-2 pl-3 font-medium">Upload CSV</p>
          <label
            htmlFor="file-upload"
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-md border py-4`}
          >
            <RiUploadLine className="h-8 w-8" />
            <p className="font-medium">Drop or Select file</p>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden w-full"
          />
          {file && (
            <div className="mt-4 flex w-full items-center justify-between space-x-2 rounded-md border p-4">
              <p>{file?.name}</p>
              <button onClick={handleRemoveFile} className="cursor-pointer">
                <RiCloseLine className="h-4 w-4" />
              </button>
            </div>
          )}
          <button
            type="submit"
            className="mt-3 w-full rounded-md bg-blue-500 py-2 text-white"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
