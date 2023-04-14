import { object, string, nativeEnum, boolean, TypeOf } from "zod";

import { AdminRole } from "@prisma/client";

import { validatePasswordComplexity } from "../utils/customValidators";

export const createAdminSchema = object({
  body: object({
    data: object({
      firstname: string(),
      lastname: string(),
      nickname: string().min(3),
      email: string().email(),
      password: string().min(8),
      passwordConfirmation: string().optional(),
      role: nativeEnum(AdminRole).optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.password, 3))
      .refine((data) => data.password === data.passwordConfirmation),
  }).strict(),
});

export const readAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const readAdminsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      firstname: string().optional(),
      lastname: string().optional(),
      email: string().email().optional(),
      role: nativeEnum(AdminRole).optional(),
      isActive: boolean().optional(),
    })
      .strict()
      .optional(),
  }).strict(),
});

export const updateCurrentAdminSchema = object({
  body: object({
    data: object({
      lastname: string().optional(),
      firstname: string().optional(),
      nickname: string().optional(),
    }).strict(),
  }).strict(),
});

export const updateCurrentAdminEmailSchema = object({
  body: object({
    data: object({
      email: string().email(),
    }).strict(),
  }).strict(),
});

export const updateCurrentAdminPasswordSchema = object({
  body: object({
    data: object({
      password: string(),
      newPassword: string().min(8),
      newPasswordConfirmation: string().optional(),
    })
      .strict()
      .refine((data) => data.password !== data.newPassword)
      .refine((data) => validatePasswordComplexity(data.newPassword, 3))
      .refine((data) => data.newPassword === data.newPasswordConfirmation),
  }).strict(),
});

export const updateAdminRoleSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      role: nativeEnum(AdminRole),
    }).strict(),
  }).strict(),
});

export const disableAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const deleteAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateAdminInput = TypeOf<typeof createAdminSchema>;
export type ReadAdminInput = TypeOf<typeof readAdminSchema>;
export type ReadAdminsInput = TypeOf<typeof readAdminsSchema>;
export type UpdateCurrentAdminInput = TypeOf<typeof updateCurrentAdminSchema>;
export type UpdateCurrentAdminEmailInput = TypeOf<
  typeof updateCurrentAdminEmailSchema
>;
export type UpdateCurrentAdminPasswordInput = TypeOf<
  typeof updateCurrentAdminPasswordSchema
>;
export type UpdateAdminRoleInput = TypeOf<typeof updateAdminRoleSchema>;
export type DisableAdminInput = TypeOf<typeof disableAdminSchema>;
export type DeleteAdminInput = TypeOf<typeof deleteAdminSchema>;
