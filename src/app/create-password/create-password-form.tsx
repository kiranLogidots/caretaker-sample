'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Password } from '@/components/ui/password';
import { createPassword } from '@/service/page';
import {
  CreatePasswordSchema,
  createPasswordSchema,
} from '@/utils/validators/create-password.schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';

export default function CreatePasswordForm() {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  const handleFocus = () => {
    setErrorMessage('');
  };
  const onSubmit: SubmitHandler<CreatePasswordSchema> = async (data) => {
    const formattedData = {
      password: data.password,
      token: token,
    };

    try {
      setLoading(true);
      const response = await createPassword(formattedData);
      router.push('/signin');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        setLoading(false);
        console.error('Error during login', error);
      } else {
        setErrorMessage(error?.message || 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form<CreatePasswordSchema>
        validationSchema={createPasswordSchema}
        resetValues={reset}
        onSubmit={onSubmit}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Password
              label="Password"
              placeholder="Enter new password"
              size="lg"
              onFocus={handleFocus}
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            {errorMessage && (
              <div className="col-span-full text-sm font-semibold text-red-500">
                {errorMessage}
              </div>
            )}

            <Button
              className="w-full bg-[#6c5ce7] hover:bg-[#4c40ae]"
              type="submit"
              size="lg"
            >
              <>
                <span>Create Password</span>{' '}
                <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
              </>
            </Button>
          </div>
        )}
      </Form>
      {/* <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signUp1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign Up
        </Link>
      </Text> */}
    </>
  );
}
