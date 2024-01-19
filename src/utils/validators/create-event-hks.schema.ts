import { z } from 'zod';
import { messages } from '@/config/messages';
const validOrganisers = ['greenworms', 'lsg', 'other'];
export const eventHKSFormSchema = z.object({
  name: z.string().min(1, { message: messages.nameIsRequired }),
  expense: z.string().min(1, { message: messages.expenseIsRequired }),
  date: z.string(),
  no_of_participants: z.string().min(1, { message: messages.noOfParticipantsIsRequired }),
  description: z.string(),
  other_description: z.string(),
  organised_by: z.string().min(1, { message: messages.organizedByIsRequired })
  .refine((value) => validOrganisers.includes(value), {
    message: messages.invalidOrganizer,
  }),
  // ({
  //   required_error: messages.dateIsRequired,
  // }),
});
export type EventHKSFormInput = z.infer<typeof eventHKSFormSchema>;
