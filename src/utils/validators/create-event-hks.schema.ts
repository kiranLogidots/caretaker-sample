import { z } from 'zod';
import { messages } from '@/config/messages';

export const eventHKSFormSchema = z.object({
  name: z.string().min(1, { message: messages.nameIsRequired }),
  expense: z.string().min(1, { message: messages.expenseIsRequired }),
  date: z.string()
  // ({
  //   required_error: messages.dateIsRequired,
  // }),
});
export type EventHKSFormInput = z.infer<typeof eventHKSFormSchema>;
