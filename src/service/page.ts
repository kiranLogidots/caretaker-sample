import {
  AdminLogin,
  CreateBranches,
  CreateDepartments,
  CreateOrg,
  CreatePositionCat,
  CreatePositions,
  CreatePositionsUnderOrg,
  CreateStaffs,
} from '@/types';
import axios from 'axios';
import { StringChain } from 'lodash';
import { signOut } from 'next-auth/react';

const apiBaseUrl = 'https://api.nexsysi.alpha2.logidots.com/api';
let accessToken: string | null = null;

if (typeof window !== 'undefined') {
  accessToken = sessionStorage.getItem('accessToken');
}
// const accessToken = sessionStorage.getItem('accessToken');
// const refreshToken = sessionStorage.getItem('refreshToken');
console.log('Access Token', accessToken);

//------------------------------------------------------------------------------------------------------------------------------------------------

//ADMIN LOGIN
export const superAdminLogin = async (details: AdminLogin) => {
  let response = await axios.post(`${apiBaseUrl}/auth/login`, details, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('RESULT FROM SERVICE PAGE', response);
  return response;
};

//PASSWORD CREATE

export const createPassword = async (details: { password: string }) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/invitations/complete`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
};

//-----------------------------------------------------------------------------------------------------------------------------------------------

//CREATE ORGANIZATION API
export const createOrg = async (details: CreateOrg) => {
  let response = await axios.post(`${apiBaseUrl}/v1/organizations`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

//LIST ORGANIZATION API
export const listOrg = () => {
  return axios
    .get(`${apiBaseUrl}/v1/organizations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
    });
};

//VIEW ORGANIZATION API
export const viewOrg = async (userId: number) => {
  let response = await fetch(`${apiBaseUrl}/v1/organizations/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

//EDIT ORGANIZATION API
export const EditOrg = async (userId: number, data: any) => {
  let response = await axios.patch(
    `${apiBaseUrl}/v1/organizations/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error('Something went wrong on network connection');
  }
  let result = response.data;
  return result;
};

// -----------------------------------------------------------------------------------------------------------------------------------------------

//LIST ACCOUNT TYPES API
export const listAccountTypes = () => {
  return axios
    .get(`${apiBaseUrl}/v1/account-types`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

//LIST INDUSTRY TYPES API
export const listIndustryTypes = () => {
  return axios
    .get(`${apiBaseUrl}/v1/industry-types`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response); // Log the error response
    });
};

//------------------------------------------------------------------------------------------------------------------------------------------------

//CREATE POSITION CATEGORY API
export const createPositionCat = async (details: CreatePositionCat) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/position-categories`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};

//LIST POSITION CATEGORY API
export const listPositionCat = () => {
  return axios
    .get(`${apiBaseUrl}/v1/position-categories`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
      // throw new Error('Something wrong on network connection');
    });
};

//DELETE POSITION CATEGORY API
export const deletePositionCat = async (positionCatId: string) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/v1/position-categories/${positionCatId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
    // throw new Error('Failed to delete event');
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------

//CREATE POSITIONS API
export const createPositions = async (details: CreatePositions) => {
  let response = await axios.post(`${apiBaseUrl}/v1/positions`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};
export const createOrgPositions = async (details: CreatePositionsUnderOrg) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/organization-positions`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

//LIST POSITIONS API
export const listPositions = () => {
  return axios
    .get(`${apiBaseUrl}/v1/positions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
      // throw new Error('Something wrong on network connection');
    });
};

//LIST DEPARTMENT POSITIONS API
export const listDepartmentPositions = (id: number) => {
  return axios
    .get(`${apiBaseUrl}/v1/organization-branch-departments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};

export const listOrgPositions = (branchId: number) => {
  if (branchId == 0) {
    return;
  }

  return axios
    .get(
      `${apiBaseUrl}/v1/department-position?organization_branch_id=${branchId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
      // throw new Error('Something wrong on network connection');
    });
};

//DELETE POSITIONS API
export const deletePositions = async (positionCatId: string) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/v1/positions/${positionCatId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
    // throw new Error('Failed to delete event');
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------

//CREATE BRANCHES API
export const createBranches = async (details: CreateBranches) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/organization-branches`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};

//VIEW BRANCH API
export const viewBranch = async (branchId: number) => {
  // const branchId = id || sessionStorage.getItem('organizationBranchId');
  if (branchId == 0) return;
  let response = await axios.get(
    `${apiBaseUrl}/v1/organization-branches/${branchId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//UPDATE BRANDCHES API
export const updateBranches = async (details: any) => {
  const organizationId = sessionStorage.getItem('organizationId');

  let response = await axios.patch(
    `${apiBaseUrl}/v1/organization-branches/${organizationId}`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};

//LIST BRANCHES API
export const listBranches = () => {
  const organizationId = sessionStorage.getItem('organizationId');
  return axios
    .get(
      `${apiBaseUrl}/v1/organization-branches?organization_id=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
    });
};

//DELETE BRANCHES API
export const deleteBranches = async (branchId: string) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/v1/organization-branches/${branchId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------

// CREATE DEPARTMENTS API
export const createDepartments = async (details: CreateDepartments) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/organization-branch-departments`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};

//LIST DEPARTMENTS API
export const listDepartments = (id: number) => {
  console.log('idBranch', id);
  if (id === 0) {
    return;
  }
  return axios
    .get(
      `${apiBaseUrl}/v1/organization-branch-departments?organization_branch_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
    });
};

///DELETE DEPARTMENTS API
export const deleteDepartments = async (departmentId: number) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/v1/organization-branch-departments/${departmentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------

//CREATE STAFFS API
export const createStaffs = async (details: CreateStaffs) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/organization-users/create/branch-staff`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

//INVITE STAFFS API
export const inviteStaffs = async (details: CreateStaffs) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/invitations/send`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

//LIST STAFFS API
export const listStaffs = (branchId: number) => {
  return axios
    .get(
      `${apiBaseUrl}/v1/invitations/list-by-branch?organization_branch_id=${branchId}`,

      // `${apiBaseUrl}/v1/organization-users?organization_branch_id=${BranchId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
    });
};
//LIST STAFFS API
export const listApprovedStaffs = (branchId: number) => {
  if (branchId == 0) {
    return;
  }
  return axios
    .get(
      `${apiBaseUrl}/v1/organization-users/list-branch-staffs?filter.organization_branch_id=${branchId}`,

      // `${apiBaseUrl}/v1/organization-users?organization_branch_id=${BranchId}`,
      // https://api.nexsysi.alpha2.logidots.com/api/v1/organization-users
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        // error.response?.data?.statusCode === 403 ||
        error.response.status === 401
      ) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
    });
};

// Active deActive staffs
export const staffStatusChange = async (payload: any) => {
  const response = await axios.post(
    `${apiBaseUrl}/auth/user/toggle-activation`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//DELETE STAFFS API
export const deleteStaffs = async (staffId: string) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/v1/organization-users/${staffId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
  }
};

export const assignShiftToUser = async (data: any) => {
  let response = await axios.post(`${apiBaseUrl}/v1/shift/assign-shift`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// Edit shift
export const editAssignShiftToUser = async (id: number, data: any) => {
  let response = await axios.patch(`${apiBaseUrl}/v1/shifts/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// Delete schedule shift
export const deleteAssignShift = async (id: number) => {
  const response = await axios.delete(`${apiBaseUrl}/v1/shifts/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getShifts = async ({ branchId }: { branchId: string }) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/v1/shifts`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        'filter.organization_branch_id': branchId,
        'filter.position_id': 2,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not fetch user shifts:', error);
  }
};

export const getUsersWithShifts = async (
  params: { [key: string]: any } = {}
) => {
  try {
    const filters = {
      page: 1,
      limit: 1000,
      sortBy: 'id:DESC',
      'filter.assignedShifts.assigned_date':
        '$btw:' + params.dateRange.join(','),
      'filter.organization_branch_id': params.branchId,
      'filter.organizationUserPositions.position_id': params.positionId,
      search: params?.memberName,
    };

    if (params.employStatus) {
      //@ts-ignore
      filters['filter.user.employment_status'] = '$in:' + params.employStatus;
    }

    if (params.shiftStatus) {
      //@ts-ignore
      filters['filter.assignedShifts.shift_status'] =
        '$in:' + params.shiftStatus;
    }
    const response = await axios.get(
      `${apiBaseUrl}/v1/organization-users/schedule-users`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        params: filters,

        // params: {
        //   page: 1,
        //   limit: 1000,
        //   sortBy: 'id:DESC',
        //   'filter.assignedShifts.assigned_date':
        //     '$btw:' + params.dateRange.join(','),
        //   'filter.organization_branch_id': params?.branchId,
        //   'filter.organizationUserPositions.position_id': params?.positionId,
        //   'filter.user.employment_status': '$in:' + params?.employStatus,
        //   'filter.assignedShifts.shift_status': '$in:' + params?.shiftStatus,
        // },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Could not fetch user shifts:', error);
  }
};

//Upload staff csv
export const staffImportCsv = async (data: any) => {
  let response = await axios.post(`${apiBaseUrl}/v1/invitations/import`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// List branches for administrators create

export const listOrgBranches = (id: any) => {
  return axios
    .get(`${apiBaseUrl}/v1/organization-branches`, {
      params: { organization_id: id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

// Create Administration

export const addAdministration = async (data: any) => {
  let response = await axios.post(
    `${apiBaseUrl}/v1/organization-users/create/organization_admin`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

//List Administrators
export const listAdministrators = (branchId: number) => {
  if (branchId == 0) return;

  return axios
    .get(
      `${apiBaseUrl}/v1/organization-users?filter.userBranches.branch_id=${branchId}&filter.role=$in:organization_admin,organization_super_admin,branch_admin`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

// List branches for user

export const listUserBranches = () => {
  return axios
    .get(`${apiBaseUrl}/v1/user-branches`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

//Profile Update

export const profileUpdate = async (data: any) => {
  let response = await axios.patch(`${apiBaseUrl}/auth/profile`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// SCHEDULE Settings update

export const scheduleSettingsUpdate = async (id: number, data: any) => {
  let response = await axios.patch(
    `${apiBaseUrl}/v1/scheduling-settings/${id}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

// SHIFT STATUS Schedule filter

export const scheduleShiftStatus = () => {
  return axios
    .get(`${apiBaseUrl}/v1/shift-status`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

// Template create shift

export const createTemplate = async (data: any) => {
  let response = await axios.post(`${apiBaseUrl}/v1/templates`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// List template shift

export const listTemplate = (id: number) => {
  return axios
    .get(`${apiBaseUrl}/v1/templates?organization_branch_id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
    });
};

// Template shift delete

export const deleteTemplate = async (id: number) => {
  const response = await axios.delete(`${apiBaseUrl}/v1/templates/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Template shift Apply

export const applyTemplate = async (data: any) => {
  const response = await axios.post(`${apiBaseUrl}/v1/templates/apply`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

//Scheduling settings fetch
export const getSchedulingSettings = async (branchId: any) => {
  if (branchId == 0) return;
  const response = await axios.get(
    `${apiBaseUrl}/v1/scheduling-settings/branch/${branchId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Create open shift

export const createOpenShift = async (data: any) => {
  const response = await axios.post(
    `${apiBaseUrl}/v1/shifts/open-shift`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//List open shifts
export const getOpenShifts = async (params: any) => {
  if (params.branchId == 0) return;
  const filters = {
    ...(params.branchId && {
      'filter.organization_branch_id': params.branchId,
    }),
    ...(params.status && { 'filter.shift_status': params.status }),
    page: params.page,
    limit: params.perPage,
    ...(params?.is_owner && {
      'filter.organizations.is_owner': false,
    }),
    ...(params?.positionId && { 'filter.position_id': params?.positionId }),
    ...(params.organizationId && {
      'filter.organizations.organization_id': params.organizationId,
    }),
  };
  const response = await axios.get(`${apiBaseUrl}/v1/shifts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params: filters,
  });
  return response.data;
};

// Send to agencies

export const sendToAgencies = async (data: any) => {
  const response = await axios.post(
    `${apiBaseUrl}/v1/shifts/send-to-agencies`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//List request agency member

export const getRequestAgencyMember = async (params: any) => {
  const filters = {
    'filter.userPositions.position_id ': params.position_id,
    limit: params.limit,
    page: params.page,
  };
  const response = await axios.get(
    `${apiBaseUrl}/v1/organization-users/agency/branch-staffs`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: filters,
    }
  );
  return response.data;
};

// List time sheet data

export const getTimeSheetData = async (params: any) => {
  if (params?.branchId == 0) return;

  const filters = {
    'filter.userPositions.position_id ': params.position_id,
    start_date: params.startDate,
    end_date: params.endDate,
    organization_branch_id: params.branchId,
    ...(params.userId && { 'filter.user.id': params.userId }),
  };
  const response = await axios.get(
    `${apiBaseUrl}/v1/shift-attendences/time-sheet`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: filters,
    }
  );
  return response.data;
};

// Time sheet download

export const downloadTimeSheet = async (params: any) => {
  if (params?.branchId == 0) return;

  const filters = {
    'filter.userPositions.position_id': params.position_id,
    start_date: params.startDate,
    end_date: params.endDate,
    organization_branch_id: params.branchId,
    ...(params.userId && { 'filter.user.id': params.userId }),
  };

  const queryString = new URLSearchParams(filters).toString();

  const url = `${apiBaseUrl}/v1/shift-attendences/time-sheet/download?${queryString}`;

  return url;
};

//Agency list for send to shifts
export const getSpecificAgency = async (params: any) => {
  const response = await axios.get(
    `${apiBaseUrl}/v1/organizations?filter.accountType.name=agency&filter.organizationBranches.id=$not:$null`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    }
  );
  return response.data;
};

//Selected agency members (agency admin shift)
export const selectedAgencyMembers = async (shiftId: number) => {
  const ordId = sessionStorage.getItem('organizationId');

  const response = await axios.get(
    `${apiBaseUrl}/v1/shift-organization-users/agency-users?filter.shiftOrganizationUsers.shiftOrganization.shift_id=${shiftId}&filter.organizationUsers.organization_id=${ordId}&limit=100`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//Available agency members (agency admin shift)
export const availableAgencyMembers = async (shiftId: number) => {
  const ordId = sessionStorage.getItem('organizationId');
  const response = await axios.get(
    `${apiBaseUrl}/v1/shift-organization-users/agency-users?filter.shiftOrganizationUsers.shiftOrganization.shift_id=$not:${shiftId}&filter.shiftOrganizationUsers.shiftOrganization.shift_id=$or:$null&filter.organizationUsers.organization_id=${ordId}&limit=100`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// List open shift apply staff list
export const getOpenShiftApplyUsers = async (params: any) => {
  const response = await axios.get(`${apiBaseUrl}/v1/shift-applications`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params: params,
  });
  return response.data;
};

// Apply user to open shifts
export const openShiftsUserApply = async (appliedId: number) => {
  const response = await axios.post(
    `${apiBaseUrl}/v1/shift-applications/${appliedId}/accept-or-reject`,
    {
      status: 'accepted',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Add user to shifts (Agency admin)
export const addUsersToShift = async (payload: any) => {
  const response = await axios.post(
    `${apiBaseUrl}/v1/shift-organization-users/add `,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Remove users from shifts (Agency admin)
export const removeUsersFromShifts = async (payload: any) => {
  const response = await axios.post(
    `${apiBaseUrl}/v1/shift-organization-users/remove `,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

//------------------------------------------------------------------------------------------------------------------------------------------------

// export const viewEventDetail = (id: number) => {
//   return axios
//     .get(`${apiBaseUrl}/events/${id}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error('Error response:', error.response);
//       if (
//         error.response &&
//         // error.response?.data?.statusCode === 403 ||
//         error.response.status === 401
//       ) {
//         signOut({
//           callbackUrl: 'http://localhost:3000',
//         });
//       } else {
//         console.error('Error fetching data:', error);
//       }
//     });
// };

// export const uploadFileToApi = async (file: any) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await axios.post(`${apiBaseUrl}/image-upload`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log('File upload response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('File upload error:', error);
//     throw error;
//   }
// };

// export const saveImageUpload = async (details: SaveImageUpload) => {
//   let response = await axios.post(`${apiBaseUrl}/event-images`, details, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return response;
// };

// export const downloadEventReport = () => {
//   return axios
//     .get(`${apiBaseUrl}/events/export`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error('Error response:', error.response);
//       if (
//         error.response &&
//         // error.response?.data?.statusCode === 403 ||
//         error.response.status === 401
//       ) {
//         signOut({
//           callbackUrl: 'http://localhost:3000',
//         });
//       } else {
//         console.error('Error fetching data:', error);
//       }
//       // throw new Error('Something wrong on network connection');
//     });
// };

// export const deleteOrg = async (eventId: string) => {
//   try {
//     const response = await axios.delete(`${apiBaseUrl}/events/${eventId}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Delete event failed:', error);
//     // throw new Error('Failed to delete event');
//   }
// };
