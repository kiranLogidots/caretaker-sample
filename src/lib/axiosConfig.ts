// // axiosConfig.js
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { signOut } from 'next-auth/react';

// export const axiosRequestInterceptor = (config: {
//   headers: { Authorization: string };
// }) => {
//   const authToken = Cookies.get('access_token');

//   if (authToken) {
//     config.headers.Authorization = `Bearer ${authToken}`;
//   }
//   return config;
// };

// export const axiosResponseErrorInterceptor = (error: {
//   response: { status: number; data: { message: string } };
// }) => {
//   const authToken = Cookies.get('access_token');

//   if (error.response) {
//     // Unauthorized
//     if (
//       authToken &&
//       error.response.status === 401 &&
//       error.response.data?.message === 'Unauthorized'
//     ) {
//       // Clear the token
//       Cookies.remove('access_token');
//       signOut();
//       // Redirect to login page
//       //   window.location.href = '/signin';
//     }
//   }

//   return Promise.reject(error);
// };

// // Create an instance of Axios with interceptors
// export const axiosInstance = axios.create();

// // Set up interceptors
// axiosInstance.interceptors.request.use(axiosRequestInterceptor, (err) =>
//   Promise.reject(err)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   axiosResponseErrorInterceptor
// );
