import { z } from 'zod';
import { messages } from '@/config/messages';

export const positionsFormSchema = z.object({
  name: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().min(1, { message: messages.descIsRequired }),
  position_category_id: z.number().min(1, { message: messages.positionCatIsRequired }),
  hourly_rate: z.number().min(1, { message: messages.hourlyRateIsRequired }),
});
export type PositionsFormInput = z.infer<typeof positionsFormSchema>;
