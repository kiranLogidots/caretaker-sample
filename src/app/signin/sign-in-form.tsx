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

interface UserRole {
  id: number;
  name: string;
  created_at: string;
}

interface OrganizationUser {
  id: number;
  role: string;
  organization_id: number;
  organization_branch_id: number | null;
  role_id: number;
  user_id: string;
  primary_location: string | null;
  onboarded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SALoginInterface {
  type: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
  id: string;
  email: string;
  is_active: boolean;
  roles: UserRole[];
  is_agency_admin?: boolean;
  organizationUsers: OrganizationUser[];
}

// interface SALoginInterface {
//   message: string;
//   access_token: string;
//   refresh_token: string;
//   id: string;
//   email: string;
//   is_active: boolean;
//   roles: UserRoles[];
// }
// const initialValues: LoginSchema = {
//   email: 'admin@caretaker.com',
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleFocus = () => {
    setErrorMessage('');
  };

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const formattedData = {
      email: data.email,
      password: data.password,
    };
    try {
      setLoading(true);
      const response = await superAdminLogin(formattedData);
      const resultData = response.data as SALoginInterface;
      console.log('Login response', resultData);

      const accessToken = resultData.access_token;
      const user_roles = resultData.roles;
      const userId = resultData.id;
      const userRole = user_roles[0].name;

      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('userId', userId);
      console.log('USER ID', userId);

      // if (resultData?.is_agency_admin) {
      //   const roleObject = user_roles[0];
      //   roleObject.name = 'agency_admin';
      //   sessionStorage.setItem('userRoles', JSON.stringify([roleObject]));
      // } else {
      //   sessionStorage.setItem('userRoles', JSON.stringify(user_roles));
      // }

      // Redirect based on role
      sessionStorage.setItem('userRoles', JSON.stringify(user_roles));

      if (
        userRole === 'organization_super_admin' ||
        userRole === 'organization_admin'
      ) {
        const organizationUsers = resultData.organizationUsers;
        const organizationId = organizationUsers[0].organization_id;
        sessionStorage.setItem('organizationId', organizationId.toString());
        if (resultData?.is_agency_admin) {
          const roleObject = user_roles[0];
          roleObject.name = 'agency_admin';
          sessionStorage.setItem('userRoles', JSON.stringify([roleObject]));
        }
      } else if (userRole === 'branch_admin') {
        const organizationUsers = resultData.organizationUsers;
        const organizationId = organizationUsers[0].organization_id;
        sessionStorage.setItem('organizationId', organizationId.toString());
        console.log('Organization ID', organizationId);
        if (
          organizationUsers.length > 0 &&
          organizationUsers[0].organization_branch_id !== null
        ) {
          const organizationBranchId =
            organizationUsers[0].organization_branch_id;
          sessionStorage.setItem(
            'organizationBranchId',
            organizationBranchId.toString()
          );
          console.log('Organization branch ID', organizationBranchId);
        }
      }
      console.log('User role now is ', userRole);
      signIn('credentials', {
        ...data,
        // onSuccess: () => {
        //   router.push('/');
        // },
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        setLoading(false);
        console.error('Error during login', error);
      } else {
        setErrorMessage(error?.message || 'An unknown error occurred');
      }
    }
    // signIn('credentials', {
    //   ...data,
    //   // onSuccess: () => {
    //   //   router.push('/');
    //   // },
    // });
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
              onFocus={handleFocus}
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
            <Button
              className="w-full bg-[#6c5ce7] hover:bg-[#4c40ae]"
              type="submit"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
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
