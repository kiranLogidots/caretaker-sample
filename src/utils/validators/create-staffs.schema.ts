import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

const positionSchema = z.object({
  position_id: z.number().min(1),
  hourly_rate: z.string().optional(),
  is_primary: z.number(),
});

export const createStaffsSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameIsRequired }),
  last_name: z.string().min(1, { message: messages.lastNameIsRequired }),
  email: validateEmail,
  phone: z.string().min(1, { message: messages.phoneNumberIsRequired }),
  primary_location: z.string(),
  employee_id: z.string(),
  employee_start_date: z.string(),
  employment_status: z.string(),
  dob: z.string().min(1, { message: messages.dobIsRequired }),
  // dob: z.string().min(1, { message: messages.dobIsRequired }),
  // dob: z.string(),
  primary_positions: z.array(positionSchema),
  positions: z.array(positionSchema).optional(),
});

export type CreateStaffsInput = z.infer<typeof createStaffsSchema>;
