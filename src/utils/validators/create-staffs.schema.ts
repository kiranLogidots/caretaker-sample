import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

const positionSchema = z.object({
  position_id: z.string().min(1),
  hourly_rate: z.string().min(1, { message: messages.hourlyRateIsRequired }),
  is_primary: z.number().min(0).max(1),
});

export const createStaffsSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameIsRequired }),
  last_name: z.string().min(1, { message: messages.lastNameIsRequired }),
  email: validateEmail,
  phone: z.string().min(1, { message: messages.phoneNumberIsRequired }),
  primary_location: z.string(),
  employee_id: z.string(),
  employee_start_date: z.string(),
  employment_status: z.enum(['full_time', 'part_time', 'casual', 'flex'], { message: messages.employmentStatusIsRequired }),  dob: z.string().min(1, { message: messages.dobIsRequired }),
  positions: z.array(positionSchema),
  secondary_positions: z.array(positionSchema), 
  // onboarded_by: z.string().min(1, { message: messages.onboardedByIsRequired }),
  // organization_id: z.number().min(1, { message: messages.organizationIdIsRequired }),
  // organization_branch_id: z.number().min(1, { message: messages.organizationBranchIdIsRequired }),
  position_id: z.string().min(1, { message: messages.primaryPositionIdIsRequired }),
  hourly_rate: z.string().min(1, { message: messages.hourlyRateIsRequired }),

});

export type CreateStaffsInput = z.infer<typeof createStaffsSchema>;
