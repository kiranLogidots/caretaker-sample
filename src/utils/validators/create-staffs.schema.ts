import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

export const createStaffsSchema = z.object({
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
  onboarded_by: z.string().min(1, { message: messages.onboardedByIsRequired }),
  // primary_location: z.number().min(1, { message: messages.primaryLocationIsRequired }),
  // organization_id: z.number().min(1, { message: messages.organizationIdIsRequired }),
  // organization_branch_id: z.number().min(1, { message: messages.organizationBranchIdIsRequired }),
  primary_position_id: z.string().min(1, { message: messages.primaryPositionIdIsRequired }),
  primary_location: z.string(),
  hourly_rate: z.string().min(1, { message: messages.hourlyRateIsRequired }),
});

export type CreateStaffsInput = z.infer<typeof createStaffsSchema>;
