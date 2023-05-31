import { AdminRole } from '@prisma/client';

import { object, string, boolean, nativeEnum, TypeOf } from 'zod';

export const readSessionsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      isActive: boolean().optional(),
      userAgent: string().optional(),
      admin: nativeEnum(AdminRole).optional(),
      ownerId: string().optional(),
    })
      .strict()
      .optional(),
  }).strict(),
});

export type ReadSessionsInput = TypeOf<typeof readSessionsSchema>;
