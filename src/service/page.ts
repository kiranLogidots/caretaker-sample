import {
  CreateCluster,
  CreateHSK,
  CreateEvent,
  AdminLogin,
  CreateDriver,
  CreatePA,
  AssignCollectionPoints,
} from '@/types';
import axios from 'axios';
import { signOut } from 'next-auth/react';

const apiBaseUrl = 'https://api.greenworms.alpha.logidots.com/api';

const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem('refreshToken');

  // Make a request to your server to refresh the access token
  try {
    const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken } = response.data;
    sessionStorage.setItem('accessToken', accessToken);

    // Retry the original request with the new access token
    return Promise.resolve();
  } catch (error) {
    // Handle refresh token failure (e.g., redirect to login page)
    return Promise.reject(error);
  }
};

axios.interceptors.request.use(
  (config) => {
    // Add the access token to the request headers
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token, try refreshing the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      signOut();
      try {
        await refreshAccessToken();
        return axios(originalRequest);
      } catch (refreshError) {
        signOut();
        // If refresh fails, handle the error (e.g., redirect to login page)
        return Promise.reject(refreshError);
      }
    }

    // For other errors, pass through the original error
    return Promise.reject(error);
  }
);
const accessToken = sessionStorage.getItem('accessToken');
// const refreshToken = sessionStorage.getItem('refreshToken');
// console.log("Access Token", accessToken)

//ADMIN LOGIN

export const superAdminLogin = async (details: AdminLogin) => {
  let response = await axios.post(
    `${apiBaseUrl}/auth/login`,
    details,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('RESULT FROM SERVICE PAGE', response);
  return response;
};

//HKS

export const createHSK = async (details: CreateHSK) => {
  let response = await axios.post(
    `${apiBaseUrl}/users`,
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

export const listHKS = async () => {
  let response = await fetch(
    `${apiBaseUrl}/users?user_type=hks_users`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const viewHSK = async (userId: number) => {
  let response = await fetch(
    `${apiBaseUrl}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const listCollection = async () => {
  let response = await fetch(
    `${apiBaseUrl}/collection-point?perPage=50&page=1&type=`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const assignCollectionPoints = async (
  details: AssignCollectionPoints
) => {
  let response = await axios.post(
    `${apiBaseUrl}/collection-point`,
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

//CLUSTER

export const createCluster = async (details: CreateCluster) => {
  let response = await axios.post(
    `${apiBaseUrl}/users`,
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

export const listClusterCreation = async () => {
  let response = await fetch(
    `${apiBaseUrl}/users?user_type=cluster_admin`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

//DRIVERS

export const createDriver = async (details: CreateDriver) => {
  let response = await axios.post(
    `${apiBaseUrl}/users`,
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

export const listDrivers = async () => {
  let response = await fetch(
    `${apiBaseUrl}/users?user_type=drivers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

//PROJECT-ASSOCIATES

export const createPA = async (details: CreatePA) => {
  let response = await fetch(
    `${apiBaseUrl}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(details),
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const listPA = async () => {
  let response = await fetch(
    `${apiBaseUrl}/users?user_type=project_associate`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

//EVENT

export const createEvent = async (details: CreateEvent) => {
  let response = await axios.post(
    `${apiBaseUrl}/events`,
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

export const listEventsHKS = async () => {
  let response = await fetch(
    `${apiBaseUrl}/events`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};