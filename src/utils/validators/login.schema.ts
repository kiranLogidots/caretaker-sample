import { messages } from '@/config/messages';
import { z } from 'zod';
import { validateEmail } from './common-rules';

// form zod validation schema
export const loginSchema = z.object({
  email: validateEmail,
  password: z
    .string()
    .refine((data) => data.length > 0, { message: messages.passwordRequired })
    .refine((data) => isCorrectPassword(data), { message: messages.invalidPassword }),
  rememberMe: z.boolean().optional(),
});
const isCorrectPassword = (password: string) => {
  // const expectedPassword = 'password';
  // return password === expectedPassword;
  return password;
};

// generate form types from zod validation schema
export type LoginSchema = z.infer<typeof loginSchema>;
