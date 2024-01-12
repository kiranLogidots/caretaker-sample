import { CreateCluster, CreateHSK, CreateEvent, AdminLogin } from '@/types';

// GET OPERATIONS
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJpYXQiOjE3MDUwNTEyMzQsImV4cCI6MTcwNTA1NDIzNH0.8gK53HIAPY1eY-nJQqII49GmldWx9UEke2CO_cCaG6U';

export const listHKS = async () => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/users?user_type=hks_users',
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
    `https://api.greenworms.alpha.logidots.com/api/users/${userId}`
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const listCollection = async () => {
  let response = await fetch(
    `https://api.greenworms.alpha.logidots.com/api/collection-point?perPage=50&page=1&type=`
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

export const listClusterCreation = async () => {
  let response = await fetch(
    `https://api.greenworms.alpha.logidots.com/api/users?user_type=cluster_admin`
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  return result;
};

// POST OPERATIONS

export const superAdminLogin = async (details: AdminLogin) => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    }
  );
  if (!response.ok) {
    throw new Error('Something wrong on network connection');
  }
  let result = await response.json();
  console.log("RESULT FROM SERVICE PAGE", result);
  return result;
};

export const createHSK = async (details: CreateHSK) => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/users',
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
export const createCluster = async (details: CreateCluster) => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/users',
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
export const createEvent = async (details: CreateEvent) => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/events',
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
