import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from '@/utils/validators/common-rules';

// form zod validation schema
export const createUserSchema = z.object({
  fullName: z.string().min(1, { message: messages.fullNameIsRequired }),
  email: validateEmail,
  age: z.string().min(1, { message: messages.ageIsRequired }),
  address: z.string().min(1, { message: messages.addressIsRequired }),
  phone: z.string().min(1, { message: messages.phoneNumberIsRequired }),
  password: z
    .string()
    .min(6, { message: messages.passwordLengthMin })
    .max(32, { message: messages.passwordLengthMax })
    .refine((data) => /[A-Z]/.test(data), {
      message: messages.passwordOneUppercase,
    })
    .refine((data) => /[a-z]/.test(data), {
      message: messages.passwordOneLowercase,
    })
    .refine((data) => /\d/.test(data), { message: messages.passwordOneNumeric })
    .refine((data) => data.length > 0, { message: messages.passwordRequired }),
  confirmPassword: z.string(),
  // confirmPassword: z
  // .string()
  // .refine((data) => data === data.password, { message: messages.passwordsDidNotMatch
  // }),
  // permissions: z.string().min(1, { message: messages.permissionIsRequired }),
  // status: z.string().min(1, { message: messages.statusIsRequired }),
});
// Add a cross-field validation for confirm_password
createUserSchema.refine((data) => data.password === data.confirmPassword, {
  message: messages.passwordsDidNotMatch,
});


// generate form types from zod validation schema
// export type CreateUserInput = z.infer<typeof createUserSchema>;

export const collectionPointsSchema = z.array(z.object({
  label: z.string(),
  value: z.number(),
}))

// export type CollectionPointsInput = z.infer<typeof collectionPointsSchema>;
export const combinedSchema = createUserSchema.extend({
  collectionPoints: collectionPointsSchema,
});

// generate form types from combined validation schema
export type CreateUserInput = z.infer<typeof combinedSchema>;