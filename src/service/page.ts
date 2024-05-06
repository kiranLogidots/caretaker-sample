import {
  AdminLogin,
  AssignCollectionPoints,
  CreateOrg,
  CreateUser,
  SaveImageUpload,
} from '@/types';
import axios from 'axios';
import { signOut } from 'next-auth/react';

const apiBaseUrl = 'https://api.seekhealth.alpha2.logidots.com/api';
const accessToken = sessionStorage.getItem('accessToken');
// const refreshToken = sessionStorage.getItem('refreshToken');
console.log('Access Token', accessToken);

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
export const createOrg = async (details: CreateOrg) => {
  let response = await axios.post(`${apiBaseUrl}/organizations`, details, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

export const listOrg = () => {
  return axios
    .get(`${apiBaseUrl}/organizations`, {
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

export const viewEventDetail = (id: number) => {
  return axios
    .get(`${apiBaseUrl}/events/${id}`, {
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

export const downloadEventReport = () => {
  return axios
    .get(`${apiBaseUrl}/events/export`, {
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
