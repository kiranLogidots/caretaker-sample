/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
// import { BASE_API_URL, TOKEN } from '../config'; // Adjust the configuration import as needed
// import Backbutton from '@/components/Backbutton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/text';

export default function EditUser({ params }: { params: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location_address_line_one: '',
    location_address_line_two: '',
    postal_code: '',
    country: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const organizationId = sessionStorage.getItem('organizationId');
  const apiBaseUrl = 'https://api.nexsysi.alpha2.logidots.com/api';
  const accessToken = sessionStorage.getItem('accessToken');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          signOut({ callbackUrl: 'http://localhost:3000' });
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);


    try {
      await axios.patch(`${apiBaseUrl}/v1/organization-branches/${organizationId}`, user, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success('Location updated successfully', { position: 'top-right' });
    //   router.push('/users');
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.response?.status === 401) {
        signOut({ callbackUrl: 'http://localhost:3000' });
      } else {
        setErrorMessage(error.message || 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="ml-10 w-full bg-[#141414] py-20 text-white">
        <div className="mx-auto max-w-xl rounded-xl border border-[#252525] p-4">
          <Title as="h4" className="mb-6 font-semibold">
            Edit User
          </Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={user.first_name}
              onChange={handleChange}
              name="first_name"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={user.last_name}
              onChange={handleChange}
              name="last_name"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              name="email"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Location Address Line One"
              placeholder="Enter location address"
              value={user.location_address_line_one}
              onChange={handleChange}
              name="location_address_line_one"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Location Address Line Two"
              placeholder="Enter location address"
              value={user.location_address_line_two}
              onChange={handleChange}
              name="location_address_line_two"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Postal Code"
              placeholder="Enter postal code"
              value={user.postal_code}
              onChange={handleChange}
              name="postal_code"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            <Input
              label="Country"
              placeholder="Enter your country"
              value={user.country}
              onChange={handleChange}
              name="country"
              className="rounded-xl border border-[#252525] bg-[#141414] p-2 outline-none"
            />
            {errorMessage && (
              <div className="text-sm font-semibold text-red-500">
                {errorMessage}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/users')}
                variant="outline"
                className="w-full @xl:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full text-white @xl:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
