import { z } from 'zod';
import { messages } from '@/config/messages';

export const pickupReqFormSchema = z.object({
  // collection_point_id: z.string().min(1, { message: messages.LSGIsRequired }),
  collection_point_id: z.number().min(1, { message: messages.LSGIsRequired }),
  driver_id: z.number().min(1, { message: messages.driverIdIsRequired }),
  materialType: z.string().min(1, { message: messages.materialTypeRequired }),
  // date: z.string(),
  date: z.string().refine((value) => !!value.trim(), {
    message: messages.dateIsRequired,
  }),
  approximateWeight: z.string().min(1,{message:messages.weightRequired}),
});
export type PickupReqFormInput = z.infer<typeof pickupReqFormSchema>;
