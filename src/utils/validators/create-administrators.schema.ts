import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

export const createAdministratorsSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameIsRequired }),
  last_name: z.string().min(1, { message: messages.lastNameIsRequired }),
  email: validateEmail,
  password: z
    .string()
    .min(6, { message: messages.passwordLengthMin })
    .max(32, { message: messages.passwordLengthMax })
    .refine((data) => /[A-Z]/.test(data), {
      message: messages.passwordOneUppercase,
    })
    .refine((data) => /[a-z]/.test(data), {
      message: messages.passwordOneLowercase,
    })
    .refine((data) => /\d/.test(data), { message: messages.passwordOneNumeric })
    .refine((data) => data.length > 0, { message: messages.passwordRequired }),
  //----------------------------------------------------------------------------------------
  // branch_name: z.string().min(1, { message: messages.branchNameIsRequired }),
  primary_location: z
    .string()
    .min(1, { message: messages.locationaddressIsRequired }),
  // country: z.string().min(1, { message: messages.countryIsRequired }),
  phone: z.string().min(1, { message: 'Phone required' }),
  branches: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
      })
    )
    .nonempty({ message: 'Branches is required' }),
  // organization_id: z.string(),
});

export type CreateAdministratorsInput = z.infer<
  typeof createAdministratorsSchema
>;
