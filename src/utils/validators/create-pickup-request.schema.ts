import { z } from 'zod';
import { messages } from '@/config/messages';

export const pickupReqFormSchema = z.object({
  // collection_point_id: z.string().min(1, { message: messages.LSGIsRequired }),
  collection_point_id: z.number().min(1, { message: messages.LSGIsRequired }),
  driver_id: z.string().min(1, { message: messages.driverIdIsRequired }),
  materialType: z.string().min(1, { message: messages.materialTypeRequired }),
  date: z.string(),
  approximateWeight: z.string(),
});
export type PickupReqFormInput = z.infer<typeof pickupReqFormSchema>;
