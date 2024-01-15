import { CreateCluster, CreateHSK, CreateEvent, AdminLogin, CreateDriver, CreatePA, AssignCollectionPoints } from '@/types';

const accessToken = sessionStorage.getItem("accessToken");
// console.log("Access Token", accessToken)

//ADMIN LOGIN

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

//HKS

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
    `https://api.greenworms.alpha.logidots.com/api/users/${userId}`, {
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
    `https://api.greenworms.alpha.logidots.com/api/collection-point?perPage=50&page=1&type=`, {
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

export const assignCollectionPoints = async (details: AssignCollectionPoints) => {
  let response = await fetch(
    'https://api.greenworms.alpha.logidots.com/api/collection-point',
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

//CLUSTER

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

export const listClusterCreation = async () => {
  let response = await fetch(
    `https://api.greenworms.alpha.logidots.com/api/users?user_type=cluster_admin`, {
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

export const listDrivers = async () => {
  let response = await fetch(
    `https://api.greenworms.alpha.logidots.com/api/users?user_type=drivers`, {
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

export const listPA = async () => {
  let response = await fetch(
    `https://api.greenworms.alpha.logidots.com/api/users?user_type=project_associate`, {
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






















