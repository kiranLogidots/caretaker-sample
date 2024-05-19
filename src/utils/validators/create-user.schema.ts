import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

export const createUserSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameIsRequired }),
  last_name: z.string().min(1, { message: messages.lastNameIsRequired }),
  email: validateEmail,
  work_email: validateEmail,
  company_name: z.string().min(1, { message: messages.companyIsRequired }),
  company_address_line_one: z
    .string()
    .min(1, { message: messages.companyaddressIsRequired }),
  company_address_line_two: z
    .string(),
  country: z.string().min(1, { message: messages.countryIsRequired }),
  postal_code: z.string().min(1, { message: messages.zipCodeRequired }),
  work_phone: z.string(),
  industry_type_id: z
    .number()
    .min(1, { message: messages.IndustryTypeIdRequired }),
  account_type_id: z
    .number()
    .min(1, { message: messages.AccountTypeIdRequired }),
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
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
