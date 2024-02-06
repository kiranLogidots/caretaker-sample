import {
  CreateCluster,
  CreateHSK,
  CreateEvent,
  AdminLogin,
  CreateDriver,
  CreatePA,
  AssignCollectionPoints,
  CreateUser,
  AddWardData,
  InitiateJobsRequest,
  SaveImageUpload,
} from '@/types';
import axios from 'axios';
import { signOut } from 'next-auth/react';

const apiBaseUrl = 'https://api.greenworms.alpha.logidots.com/api';

// const refreshAccessToken = async () => {
//   const refreshToken = sessionStorage.getItem('refreshToken');
//   try {
//     const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
//       refreshToken,
//     });

//     const { accessToken } = response.data;
//     sessionStorage.setItem('accessToken', accessToken);
//     return Promise.resolve();
//   } catch (error) {
//     // Handle refresh token failure (e.g., redirect to login page)
//     signOut();
//     return Promise.reject(error);
//   }
// };

// axios.interceptors.request.use(
//   (config) => {
//     // Add the access token to the request headers
//     const accessToken = sessionStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     signOut();
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is due to an expired access token, try refreshing the token
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       signOut();
//       try {
//         await refreshAccessToken();
//         return axios(originalRequest);
//       } catch (refreshError) {
//         signOut();
//         // If refresh fails, handle the error (e.g., redirect to login page)
//         return Promise.reject(refreshError);
//       }
//     }

//     // For other errors, pass through the original error
//     return Promise.reject(error);
//   }
// );

const accessToken = sessionStorage.getItem('accessToken');
// const refreshToken = sessionStorage.getItem('refreshToken');
// console.log("Access Token", accessToken)

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

//CREATE USER API
export const createUser = async (details: CreateUser) => {
  let response = await axios.post(`${apiBaseUrl}/users`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

//HKS

export const createHSK = async (details: CreateHSK) => {
  let response = await axios.post(`${apiBaseUrl}/users`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const listHKS = () => {
  return axios
    .get(`${apiBaseUrl}/users?user_type=hks_users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

export const viewHSK = async (userId: number) => {
  let response = await fetch(`${apiBaseUrl}/users/${userId}`, {
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

export const listCollection = () => {
  return axios
    .get(`${apiBaseUrl}/collection-point?perPage=50&page=1&type=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response); // Log the error response
      if (error.response && error.response?.data?.statusCode === 401) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else {
        console.error('Error fetching data:', error);
      }
      // throw new Error('Something wrong on network connection');
    });
};

export const assignCollectionPoints = async (
  details: AssignCollectionPoints
) => {
  let response = await axios.post(`${apiBaseUrl}/collection-point`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

//CLUSTER

export const createCluster = async (details: CreateCluster) => {
  let response = await axios.post(`${apiBaseUrl}/users`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

export const listClusterCreation = () => {
  return axios
    .get(`${apiBaseUrl}/users?user_type=cluster_admin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

//DRIVERS

export const createDriver = async (details: CreateDriver) => {
  let response = await axios.post(`${apiBaseUrl}/users`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const listDrivers = () => {
  return axios
    .get(`${apiBaseUrl}/users?user_type=drivers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

//PROJECT-ASSOCIATES

export const createPA = async (details: CreatePA) => {
  let response = await fetch(`${apiBaseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(details),
  });
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const listPA = () => {
  return axios
    .get(`${apiBaseUrl}/users?user_type=project_associate`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

//EVENT

export const createEvent = async (details: CreateEvent) => {
  let response = await axios.post(`${apiBaseUrl}/events`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const listEventsHKS = () => {
  return axios
    .get(`${apiBaseUrl}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/events/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete event failed:', error);
    // throw new Error('Failed to delete event');
  }
};

export const uploadFileToApi = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${apiBaseUrl}/image-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const saveImageUpload = async (details: SaveImageUpload) => {
  let response = await axios.post(`${apiBaseUrl}/event-images`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

//INPUT WARD DATA

export const addWardData = async (details: AddWardData) => {
  let response = await axios.post(
    `${apiBaseUrl}/ward-collection-data`,
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

export const listWardData = () => {
  return axios
    .get(`${apiBaseUrl}/ward-collection-data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

export const deleteWardData = async (wardId: string) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/ward-collection-data/${wardId}`,
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

//PICK UP REQUEST

export const initiateJobs = async (details: InitiateJobsRequest) => {
  let response = await axios.post(`${apiBaseUrl}/jobs/initiate`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const listAllJobs = () => {
  return axios
    .get(`${apiBaseUrl}/jobs/list-all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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

export const viewJobRequest = (id: number) => {
  return axios
    .get(`${apiBaseUrl}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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
export const jobTrackings = (id: number) => {
  return axios
    .get(`${apiBaseUrl}/jobs/${id}/trackings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error response:', error.response);
      if (
        error.response &&
        (error.response?.data?.statusCode === 403 ||
          error.response.status === 401)
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
