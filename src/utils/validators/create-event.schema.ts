import { z } from 'zod';
import { messages } from '@/config/messages';

export const eventFormSchema = z.object({
  start_time: z.date({
    required_error: messages.startDateIsRequired,
  }),
  end_time: z.date({
    required_error: messages.endDateIsRequired,
  }),
  unpaid_break: z.number()
});

// generate form types from zod validation schema
export type EventFormInput = z.infer<typeof eventFormSchema>;
