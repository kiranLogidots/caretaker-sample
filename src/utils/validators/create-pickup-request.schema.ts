import { z } from 'zod';
import { messages } from '@/config/messages';

export const pickupReqFormSchema = z.object({
  collection_point_id: z.string().min(1, { message: messages.LSGIsRequired }),
  driver_id: z.string().min(1, { message: messages.driverIdIsRequired }),
  materialType: z.string().min(1, { message: messages.materialTypeRequired }),
  date: z.string(),
  approximateWeight: z.string(),
  // materialType: z.array(
  //   z.object({
  //     label: z.string(),
  //     value: z.string(),
  //   })
  // ),
});
export type PickupReqFormInput = z.infer<typeof pickupReqFormSchema>;
