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
export const deleteDepartments = async (departmentId: string) => {
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
    const response = await axios.get(
      `${apiBaseUrl}/v1/organization-users/schedule-users`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: 1,
          limit: 1000,
          sortBy: 'id:DESC',
          'filter.assignedShifts.assigned_date':
            '$btw:' + params.dateRange.join(','),
          'filter.organization_branch_id': params?.branchId,
          'filter.organizationUserPositions.position_id': params?.positionId,
        },
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
