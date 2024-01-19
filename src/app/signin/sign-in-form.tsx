'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox } from '@/components/ui/checkbox';
import { Password } from '@/components/ui/password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';
import { superAdminLogin } from '@/service/page';
import { useRouter } from 'next/navigation';
import { IoMdRefresh } from 'react-icons/io';

interface SAUser {
  id: number;
  user_type: string;
  name: string;
  phone: string;
  age: number;
  email: string;
  address: string;
  password: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}
interface SALoginInterface {
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: SAUser[];
}
// const initialValues: LoginSchema = {
//   email: 'superadmin@greenworms.com',
//   password: 'adminPassword',
//   rememberMe: true,
//   // email: 'admin@admin.com',
//   // password: 'admin',
//   // rememberMe: true,
// };

export default function SignInForm() {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const formattedData = {
      PhoneOrEmail: data.email,
      password: data.password,
    };
    try {
      setLoading(true);
      const response = await superAdminLogin(formattedData);
      const resultData = response.data as SALoginInterface;
      console.log('RESULT DATA SIGNUP PAGE', resultData);
      const { accessToken, refreshToken } = resultData.tokens;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
    } catch {}
    signIn('credentials', {
      ...data,
      // onSuccess: () => {
      //   router.push('/');
      // },
    });
    // setLoading(false);
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        // useFormProps={{
        //   defaultValues: initialValues,
        // }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              {/* <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              /> */}
              {/* <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-green-dark underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link> */}
            </div>
            {/* <Button className="w-full bg-green-dark" type="submit" size="lg">
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button> */}
            <Button className="w-full bg-green-dark" type="submit" size="lg">
              {loading ? (
                <div className='flex justify-center items-center gap-2'>
                  <IoMdRefresh
                    className="mx-auto animate-spin text-white"
                    size={24}
                  />
                  <span>Signing In..</span>
                </div>
              ) : (
                <>
                  <span>Sign in</span>{' '}
                  <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </>
              )}
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
