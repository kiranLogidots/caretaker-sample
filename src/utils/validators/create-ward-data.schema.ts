import { z } from 'zod';
import { messages } from '@/config/messages';

// const validOrganisers = ['greenworms', 'lsg', 'other'];

export const wardDataFormSchema = z.object({
  date: z.string(),
  collection_point_id: z
    .number()
    .min(1, { message: messages.collectionPointIdReq }),
  ward_no: z.string().min(1, { message: messages.wardNoReq }),
  hks_team_name: z.string().min(1, { message: messages.HKSTeamnameReq }),
  shop_visited: z.string(),
  shop_paid: z.string().min(1, { message: messages.expenseIsRequired }),
  shop_vacant: z.string().min(1, { message: messages.expenseIsRequired }),
  house_visited: z.string().min(1, { message: messages.expenseIsRequired }),
  house_paid: z.string().min(1, { message: messages.expenseIsRequired }),
  house_denied: z.string().min(1, { message: messages.expenseIsRequired }),
  house_vacant: z.string().min(1, { message: messages.expenseIsRequired }),
  house_not_intrested: z
    .string()
    .min(1, { message: messages.expenseIsRequired }),
  house_w_no_money: z.string().min(1, { message: messages.expenseIsRequired }),
  collection_amt: z.string().min(1, { message: messages.expenseIsRequired }),
  hks_incentive: z.string().min(1, { message: messages.expenseIsRequired }),
  shops_not_cooperate: z.string().min(1, { message: messages.expenseIsRequired }),
  shops_with_no_money: z.string().min(1, { message: messages.expenseIsRequired }),
  shops_with_no_interest: z.string().min(1, { message: messages.expenseIsRequired }),
  //   organised_by: z.string().min(1, { message: messages.organizedByIsRequired })
  //   .refine((value) => validOrganisers.includes(value), {
  //     message: messages.invalidOrganizer,
  //   }),
  // ({
  //   required_error: messages.dateIsRequired,
  // }),
});
export type WardDataFormInput = z.infer<typeof wardDataFormSchema>;
