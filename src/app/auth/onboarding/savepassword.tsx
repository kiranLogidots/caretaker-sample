'use client';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Password } from '@/components/ui/password';
import SuccessPage from './success/page';
import logo from "../../../../../care-taker-app/public/rosterbees-logo.png";

const validationSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof validationSchema>;

export default function SavePasswordForm() {
  const [save, setSave] = useState<FormData>({ password: '', confirmPassword: '' });
  const [isSuccess, setIsSuccess] = useState(false); 
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    setSave(data);
    setIsSuccess(true);
    router.push('/auth/onboarding/success');
  };

  

  return (
    <div className="mt-48 md:mt-56 lg:mt-40 flex justify-center"> 
      <div className="w-full max-w-md p-4 ">
        {!isSuccess && ( 
          <>
            <img src={logo.src} alt="RosterBees Logo" className="h-12 mx-auto mb-2 mt-1" /> 
            <h1 className="text-2xl font-semibold text-center mb-4">Set up your Account</h1> 
          </>
        )}
        {isSuccess ? (
          <SuccessPage />
        ) : (
          <Form<FormData> onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ register, formState: { errors } }) => (
              <div className="space-y-6">
                <div>
                  <Password
                    label="Password"
                    placeholder="Enter your password"
                    size="md"
                    className="[&gt;label&gt;span]:font-medium"
                    inputClassName="text-sm"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                </div>
                <div>
                  <Password
                    label="Confirm Password"
                    placeholder="Enter confirm password"
                    size="md"
                    className="[&gt;label&gt;span]:font-medium"
                    inputClassName="text-sm"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                  {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                </div>
                <button type="submit" className="mt-6 w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-900">
                  Save Password
                </button>
              </div>
            )}
          </Form>
        )}
      </div>
    </div>
  );
}
