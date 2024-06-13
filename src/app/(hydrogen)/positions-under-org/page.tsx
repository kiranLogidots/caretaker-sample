'use client';
import React, { useState, useEffect } from 'react';
import PageHeader from '@/app/shared/page-header';
import ControlledTable from '@/components/controlled-table';
import axios from 'axios';
import { Select, Button } from 'rizzui';
import { MultiSelect } from 'react-multi-select-component';
import { ColumnType } from 'rc-table/es/interface';
import { useAtom } from 'jotai';
import { selectedBranchAtom } from '@/store/checkout';
import toast from 'react-hot-toast';

interface Position {
  id: string;
  name: string;
  hourly_rate: string;
  position_category_id: number;
  categoryName: string;
}

interface SelectedName {
  value: string;
  label: string;
}

interface Department {
  value: string;
  label: string;
}

interface DefaultRecordType {
  [key: string]: any;
}

const pageHeader = {
  title: 'Positions',
};

const getColumns = (
  handleInputChange: (id: string, value: string) => void,
  handleCheckboxChange: (id: string, checked: boolean) => void
): ColumnType<DefaultRecordType>[] => {
  return [
    {
      title: '',
      dataIndex: 'select',
      key: 'select',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={record.selected}
          onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
        />
      ),
      width: 50,
    },
    {
      title: 'Positions',
      dataIndex: 'name',
      key: 'name',
      width: 800,
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourly_rate',
      key: 'hourly_rate',
      render: (_, record) => (
        <div style={{ textAlign: 'right', paddingRight: '170px' }}>
          <input
            type="text"
            value={record.hourly_rate}
            onChange={(e) => handleInputChange(record.id, e.target.value)}
            style={{
              textAlign: 'left',
              width: '180px',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
      ),
      className: 'hourly-rate-header',
    },
  ];
};

export default function UsersTable() {
  const [selectedBranch] = useAtom(selectedBranchAtom);
  const branchId = selectedBranch?.value;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [Names, setNames] = useState<SelectedName[]>([]);
  const [selectedNames, setSelectedNames] = useState<SelectedName[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [updatedPositions, setUpdatedPositions] = useState<Position[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      if (Number(branchId) == 0) return;

      try {
        const response = await axios.get(
          `https://api.nexsysi.alpha2.logidots.com/api/v1/organization-branch-departments?organization_branch_id=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const departmentOptions: Department[] = response.data.map(
          (department: { id: string; name: string }) => ({
            value: department.id,
            label: department.name,
          })
        );
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }

    fetchDepartments();
  }, [branchId]);

  useEffect(() => {
    async function fetchNames() {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await axios.get(
          'https://api.nexsysi.alpha2.logidots.com/api/v1/position-categories',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const categories = response.data;
        const positionNames: SelectedName[] = categories.map(
          (category: any) => {
            return { value: category.id.toString(), label: category.name };
          }
        );
        setNames(positionNames);

        const allPositions = categories.reduce(
          (acc: Position[], category: any) => {
            const positionsWithCategory = category.positions.map(
              (position: any) => ({
                ...position,
                id: position.id.toString(),
                position_category_id: category.id,
                categoryName: category.name,
                selected: false,
              })
            );
            return acc.concat(positionsWithCategory);
          },
          []
        );
        setPositions(allPositions);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    }

    fetchNames();
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) =>
        position.id === id ? { ...position, hourly_rate: value } : position
      )
    );

    setUpdatedPositions((prevUpdatedPositions) => {
      const existingPositionIndex = prevUpdatedPositions.findIndex(
        (position) => position.id === id
      );
      if (existingPositionIndex > -1) {
        const updatedPositions = [...prevUpdatedPositions];
        updatedPositions[existingPositionIndex].hourly_rate = value;
        return updatedPositions;
      } else {
        const newPosition = positions.find((position) => position.id === id);
        if (newPosition) {
          return [
            ...prevUpdatedPositions,
            { ...newPosition, hourly_rate: value },
          ];
        }
        return prevUpdatedPositions;
      }
    });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) =>
        position.id === id ? { ...position, selected: checked } : position
      )
    );

    if (checked) {
      setSelectedPositions((prevSelectedPositions) => [
        ...prevSelectedPositions,
        id,
      ]);
    } else {
      setSelectedPositions((prevSelectedPositions) =>
        prevSelectedPositions.filter((positionId) => positionId !== id)
      );
    }
  };

  const handleSave = async () => {
    if (!selectedDepartment) {
      alert('Please select a department');
      return;
    }

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    const selectedAndUpdatedPositions = positions.filter((position) =>
      selectedPositions.includes(position.id)
    );

    const payload = {
      positions: selectedAndUpdatedPositions.map((position) => ({
        department_id: parseInt(selectedDepartment.value),
        position_id: parseInt(position.id),
        hourly_rate: parseFloat(position.hourly_rate),
      })),
    };

    console.log('Selected Department:', selectedDepartment);
    console.log(
      'Updated Positions:',
      JSON.stringify(updatedPositions, null, 2)
    );
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        'https://api.nexsysi.alpha2.logidots.com/api/v1/department-position/assign',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response.data);
      location.reload();
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error(error?.response?.data?.message);
    }
  };

  const filteredPositions = positions.filter((position) =>
    selectedNames.some(
      (selected) => selected.value === position.position_category_id.toString()
    )
  );

  return (
    <>
      <style>
        {`

        .save-button-container {
          display: flex;
          justify-content: flex-end;
          align-items: center; /* Center align items vertically */
          width: 100%; /* Ensure it stretches to the container's width */
          margin-top: 35px;
        }
      `}
      </style>
      <div style={{ marginTop: '25px' }}>
        <PageHeader title={pageHeader.title} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div style={{ marginBottom: '10px', marginTop: '-40px' }}>
            <p style={{ marginBottom: '40px', fontWeight: 'bold' }}>
              Please select all the positions that this location can work and
              pick up jobs for. Rates can <br /> be customized from the default
              rates shown.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '10px',
                marginTop: '-20px',
                width: '400px',
              }}
            >
              <label
                htmlFor="department-select"
                style={{ marginBottom: '5px', fontWeight: 'bold' }}
              >
                Select Department
              </label>
              <Select
                id="department-select"
                value={selectedDepartment}
                onChange={(selected) =>
                  setSelectedDepartment(selected as Department)
                }
                options={departments.map((department) => ({
                  value: department.value,
                  label: department.label,
                }))}
                clearable={true}
                placeholder="Select Department"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '10px',
              marginTop: '20px',
              width: '400px',
            }}
          >
            <label
              htmlFor="position-select"
              style={{ marginBottom: '5px', fontWeight: 'bold' }}
            >
              Position Categories
            </label>
            <div style={{ width: '100%' }}>
              <MultiSelect
                options={Names}
                value={selectedNames}
                onChange={setSelectedNames}
                labelledBy="Select Positions"
              />
            </div>
          </div>
          <div
            className="save-button-container"
            style={{ marginRight: '30px', marginTop: '-20px' }}
          >
            <Button
              onClick={handleSave}
              variant="solid"
              style={{
                backgroundColor: '#6c5ce7',
                width: '150px',
                color: 'white',
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        {selectedNames.length === 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: '14px' }}>
              No position categories selected
            </h2>
            <ControlledTable
              data={[]}
              columns={getColumns(handleInputChange, handleCheckboxChange)}
            />
          </div>
        )}
        {selectedNames.map((selectedName, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: '14px' }}>
              {selectedName.label}
            </h2>
            <ControlledTable
              data={filteredPositions.filter(
                (position) =>
                  position.position_category_id.toString() ===
                  selectedName.value
              )}
              columns={getColumns(handleInputChange, handleCheckboxChange)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
