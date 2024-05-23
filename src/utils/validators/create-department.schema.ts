import { z } from 'zod';
import { messages } from '@/config/messages';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().min(1, { message: messages.descIsRequired }),
  organization_branch_id: z
    .number()
    .min(1, { message: messages.positionCatIsRequired }),
});
export type DepartmentFormInput = z.infer<typeof createDepartmentSchema>;
