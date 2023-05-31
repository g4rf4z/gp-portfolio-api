import { object, string, TypeOf } from 'zod';

import { validatePasswordComplexity } from '../utils/customValidators.util';

export const loginSchema = object({
  body: object({
    data: object({
      email: string().email(),
      password: string(),
    }).strict(),
  }).strict(),
});

export const resetPasswordSchema = object({
  body: object({
    data: object({
      email: string().email(),
    }).strict(),
  }).strict(),
});

export const setPasswordSchema = object({
  params: object({
    id: string(),
    token: string(),
  }).strict(),
  body: object({
    data: object({
      password: string().min(8),
      passwordConfirmation: string().optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.password, 3))
      .refine((data) => data.password === data.passwordConfirmation),
  }).strict(),
});

export type LoginInput = TypeOf<typeof loginSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type SetPasswordInput = TypeOf<typeof setPasswordSchema>;
