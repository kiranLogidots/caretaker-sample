import { z } from 'zod';
import { messages } from '@/config/messages';

export const positionCategoryFormSchema = z.object({
  name: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().min(1, { message: messages.descIsRequired }),
});
export type PositionsCategoryFormInput = z.infer<typeof positionCategoryFormSchema>;
