import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

export const createBranchesSchema = z.object({
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
  branch_name: z.string().min(1, { message: messages.branchNameIsRequired }),
  location_address_line_one: z
    .string()
    .min(1, { message: messages.locationaddressIsRequired }),
  location_address_line_two: z.string(),
  country: z.string().min(1, { message: messages.countryIsRequired }),
  postal_code: z.string().min(1, { message: messages.zipCodeRequired }),
  organization_id: z.number(),
});

export type CreateBranchesInput = z.infer<typeof createBranchesSchema>;
