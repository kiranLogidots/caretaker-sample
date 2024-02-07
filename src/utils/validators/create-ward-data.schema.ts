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
  shop_visited: z.string().min(1, { message: messages.shopVisitedRequired }),
  shop_paid: z.string().min(1, { message: messages.shopPaid }),
  shop_vacant: z.string().min(1, { message: messages.shopVacant }),
  house_visited: z.string().min(1, { message: messages.houseVisitedRequired }),
  house_paid: z.string().min(1, { message: messages.housePaid }),
  house_denied: z.string().min(1, { message: messages.houseDenied }),
  house_vacant: z.string().min(1, { message: messages.houseVacant }),
  house_not_intrested: z
    .string()
    .min(1, { message: messages.houeNoInterest }),
  house_w_no_money: z.string().min(1, { message: messages.houseNoMoney }),

  collection_amt: z.string().min(1, { message: messages.collectionAmountIsReq }),
  hks_incentive: z.string().min(1, { message: messages.hksIncentiveReq }),

  shops_not_cooperate: z.string().min(1, { message: messages.shopsDenied }),
  shops_with_no_money: z.string().min(1, { message: messages.shopsNoMoney }),
  shops_with_no_interest: z.string().min(1, { message: messages.shopsNoInterest }),
  //   organised_by: z.string().min(1, { message: messages.organizedByIsRequired })
  //   .refine((value) => validOrganisers.includes(value), {
  //     message: messages.invalidOrganizer,
  //   }),
  // ({
  //   required_error: messages.dateIsRequired,
  // }),
})
export type WardDataFormInput = z.infer<typeof wardDataFormSchema>;
