import { z } from 'zod';
import { messages } from '@/config/messages';

export const eventHKSFormSchema = z.object({
  //   id: z.string().optional(),
  name: z.string().min(1, { message: messages.nameIsRequired }),
  expense: z.number().min(1, { message: messages.expenseIsRequired }),
  date: z.date({
    required_error: messages.dateIsRequired,
  }),
});
export type EventHKSFormInput = z.infer<typeof eventHKSFormSchema>;
