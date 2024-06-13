import { messages } from '@/config/messages';
import { z } from 'zod';
import { validateEmail } from './common-rules';

// form zod validation schema
export const createPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((data) => /[0-9]/.test(data), {
      message: 'Password must contain at least one numeric character',
    })
    .refine((data) => /[a-zA-Z]/.test(data), {
      message: 'Password must contain at least one alphabetic character',
    })
    .refine((data) => data.length > 0, { message: messages.passwordRequired }),
});

// generate form types from zod validation schema
export type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;
