import { CreateCluster, CreateHSK, CreateEvent } from '@/types';

// GET OPERATIONS
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJpYXQiOjE3MDUwNDc0NTYsImV4cCI6MTcwNTA1MDQ1Nn0.khcaT9ok51gOEDMUDMJkJLYfF4rchq7hmim8Q3cWS68';

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
