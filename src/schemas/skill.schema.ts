import { object, string, number, TypeOf } from 'zod';

export const createSkillSchema = object({
  body: object({
    data: object({
      name: string(),
      image: string(),
      progress: number(),
    }).strict(),
  }).strict(),
});

export const readSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const readSkillsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      name: string(),
      image: string(),
      progress: number(),
    })
      .strict()
      .optional(),
  }).strict(),
});

export const updateSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      name: string(),
      image: string(),
      progress: number(),
    }).strict(),
  }).strict(),
});

export const deleteSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateSkillInput = TypeOf<typeof createSkillSchema>;
export type ReadSkillInput = TypeOf<typeof readSkillSchema>;
export type ReadSkillsInput = TypeOf<typeof readSkillsSchema>;
export type UpdateSkillInput = TypeOf<typeof updateSkillSchema>;
export type DeleteSkillInput = TypeOf<typeof deleteSkillSchema>;
