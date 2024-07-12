'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { Title } from '@/components/ui/text';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { createBranches, listOrg, listPositionCat } from '@/service/page';
import toast, { Toaster } from 'react-hot-toast';
import {
  Branch,
  CreatePositionCatResponse,
  ListBranchesInterface,
  ListOrganisationResponse,
  ListPositionCategoryInterface,
} from '@/types';
import { signOut } from 'next-auth/react';
import Select from 'react-select';
import { useDrawer } from '../drawer-views/use-drawer';
import {
  CreateBranchesInput,
  createBranchesSchema,
} from '@/utils/validators/create-branches.schema';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

interface LatLng {
  lat: number;
  lng: number;
}

interface MarkerState {
  coords: LatLng;
}

export default function CreateUser() {
  const { getValues, setValue, control, watch } = useForm();
  // const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();
  const [reset, setReset] = useState({});
  const [isLoadingData, setLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<
    { value: number; label: string }[]
  >([]);

  // Google maps  states
  const [myMap, setMyMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLng>({
    lat: 29.972065,
    lng: -90.111533,
  });
  const [marker, setMarker] = useState<MarkerState | null>(null);
  const [drawMarker, setDrawMarker] = useState<boolean>(true);
  const [address, setAddress] = useState<string>('');

  const googleMapsApiKey: any = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = (await listOrg()) as ListOrganisationResponse;
        const result = response.data;
        console.log('Organizations:', result);
        setOrganizations(
          result.map((org) => ({
            value: org.id,
            label: org.company_name,
          }))
        );
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchAccountTypes();
  }, []);

  const onSubmit: SubmitHandler<CreateBranchesInput> = async (data) => {
    const organizationId = sessionStorage.getItem('organizationId');
    if (!organizationId) {
      setErrorMessage('Organization ID not found in session storage.');
      return;
    }
    const formattedData = {
      branch_admin: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      },
      branch_name: data.branch_name,
      location_address_line_one: data.location_address_line_one,
      location_address_line_two: data.location_address_line_two,
      country: data.country,
      postal_code: data.postal_code,
      organization_id: Number(organizationId), // take from the session storage
      ...(address && { geo_address: address }),
      ...(marker && { geo_coordinates: marker.coords }),
    };

    console.log(formattedData, 'formattedData');

    setLoadingData(true);

    try {
      const response = await createBranches(formattedData);
      const resultData = response.data as CreatePositionCatResponse[];

      if (resultData) {
        setReset({
          name: '',
          description: '',
        });
        closeDrawer();
        toast.success('Location created successfully', {
          position: 'top-right',
        });
        location.reload();
      }
    } catch (err: any) {
      console.log('Error message ', err.message);
      if (err.response && err.response?.data?.statusCode === 401) {
        signOut({
          callbackUrl: 'http://localhost:3000',
        });
      } else if (err.response?.data?.statusCode === 400) {
        setErrorMessage(err.response.data.message.join(' '));
      } else {
        setErrorMessage(err.message || 'An unknown error occurred');
      }
    } finally {
      // signOut();
      setLoadingData(false);
    }
  };

  // google map functions

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  const getAddress = async (coords: any) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${googleMapsApiKey}`
      );
      const data: any = await response.json();

      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);

        const addressComponents = data.results[0].address_components;
        let postalCode = '';
        let country = '';
        let addressWithoutPostalCodeAndCountry = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });

        addressWithoutPostalCodeAndCountry = data.results[0].formatted_address;
        if (postalCode) {
          addressWithoutPostalCodeAndCountry =
            addressWithoutPostalCodeAndCountry.replace(postalCode, '').trim();
        }
        if (country) {
          addressWithoutPostalCodeAndCountry =
            addressWithoutPostalCodeAndCountry.replace(country, '').trim();
        }

        console.log(addressWithoutPostalCodeAndCountry);

        // setValue('postal_code', postalCode);
        // setValue('country', country);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const setSingleMarker = (coords: any) => {
    setMarker({ coords });
    getAddress(coords);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error('Error getting user location');
        }
      );
    }
  }, []);

  const renderMap = () => (
    <div>
      {address && (
        <div className="pb-2">
          <h6>Selected Address:</h6>
          <p>{address}</p>
        </div>
      )}
      <GoogleMap
        onClick={(e) =>
          //@ts-ignore
          drawMarker ? setSingleMarker(e.latLng.toJSON()) : null
        }
        mapContainerStyle={{
          height: '230px',
          width: '100%', // Adjust width as needed to fit within the drawer
        }}
        zoom={10}
        center={center}
        onLoad={(map) => setMyMap(map)}
      >
        {marker && (
          <Marker
            draggable={drawMarker}
            position={marker.coords}
            //@ts-ignore
            onDragEnd={(e) => setMarker({ coords: e.latLng.toJSON() })}
          />
        )}
      </GoogleMap>

      {/* <button
        type="button"
        className="mt-2 rounded-md bg-blue-400 p-2"
        onClick={() => setMarker(null)}
      >
        CLEAR MAP
      </button> */}
    </div>
  );

  // const watchAddressLineOne = watch('location_address_line_one');
  // const watchPostalCode = watch('postal_code');
  // const watchCountry = watch('country');

  return (
    <div className="mb-4 overflow-y-auto px-2">
      <Toaster position="top-right" />
      <Form<CreateBranchesInput>
        resetValues={reset}
        onSubmit={onSubmit}
        validationSchema={createBranchesSchema}
        className="grid grid-cols-2 gap-6 overflow-y-auto p-3 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        {({ register, control, watch, formState: { errors } }) => {
          return (
            <>
              <div className="col-span-full flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                  Add a location
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeDrawer}>
                  <PiXBold className="h-auto w-5" />
                </ActionIcon>
              </div>

              <Input
                label="Location name"
                placeholder="Enter the location"
                className="col-span-full"
                {...register('branch_name')}
                error={errors.branch_name?.message}
              />

              {/* <Controller
                name="organization_id"
                control={control}
                render={({ field }) => (
                  <div className="col-span-full flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Select Organization
                    </label>
                    <Select
                      options={organizations}
                      value={organizations.find(
                        (at) => at.value === field.value
                      )}
                      onChange={(option) =>
                        field.onChange(option ? option.value : null)
                      }
                      name={field.name}
                      isClearable
                    />
                  </div>
                )}
              /> */}
              <Input
                label="Location Address Line One"
                placeholder="Enter location Address"
                className="col-span-full"
                {...register('location_address_line_one')}
                error={errors.location_address_line_one?.message}
              />
              <Input
                label="Location Address Line Two"
                placeholder="Enter location Address"
                className="col-span-full"
                {...register('location_address_line_two')}
                error={errors.location_address_line_two?.message}
              />

              <Input
                label="Postal Code"
                placeholder="Enter postal code "
                {...register('postal_code')}
                error={errors.postal_code?.message}
                // value={watchPostalCode}
              />

              <Input
                label="Country"
                placeholder="Enter your country"
                {...register('country')}
                error={errors.country?.message}
                // value={watchCountry}
              />

              <Input
                label="First Name"
                placeholder="Enter first name"
                {...register('first_name')}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                {...register('last_name')}
                error={errors.last_name?.message}
              />
              <Input
                label="Email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
              />
              {errorMessage && (
                <div className="col-span-full text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )}
              <div className="col-span-full flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={closeDrawer}
                  className="w-full @xl:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoadingData}
                  className="w-full text-white @xl:w-auto"
                >
                  Create Location
                </Button>
              </div>
            </>
          );
        }}
      </Form>
      {isLoaded && renderMap()}
    </div>
  );
}
