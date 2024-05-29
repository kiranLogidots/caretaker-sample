import { z } from 'zod';
import { messages } from '@/config/messages';

// export const positionsUnderOrgSchema = z.object({
// //   name: z.string().min(1, { message: messages.nameIsRequired }),
//   description: z.string().min(1, { message: messages.descIsRequired }),
//   position_id: z.number().min(1, { message: messages.positionCatIsRequired }),
//   hourly_rate: z.number().min(1, { message: messages.hourlyRateIsRequired }),
// });

export const positionsUnderOrgSchema = z.object({
  organization_positions: z
    .array(
      z.object({
        // organization_id: z.number().min(1, { message: messages.positionCatIsRequired }),
        // description: z.string().min(1, { message: messages.descIsRequired }),
        position_id: z
          .number()
          .min(1, { message: messages.positionCatIsRequired }),
        hourly_rate: z
          .number()
          .min(1, { message: messages.hourlyRateIsRequired }),
      })
    )
    .min(1, { message: messages.positionCatIsRequired }),
});

export type PositionsUnderOrgInput = z.infer<typeof positionsUnderOrgSchema>;
