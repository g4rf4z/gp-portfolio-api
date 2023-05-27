import { array, object, string, TypeOf } from 'zod';

export const createExperienceSchema = object({
  body: object({
    data: object({
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
      technologies: array(string()),
    }).strict(),
  }).strict(),
});

export const readExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const readExperiencesSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
      technologies: array(string()),
    })
      .strict()
      .optional(),
  }).strict(),
});

export const updateExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
      technologies: array(string()),
    }).strict(),
  }).strict(),
});

export const deleteExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateExperienceInput = TypeOf<typeof createExperienceSchema>;
export type ReadExperienceInput = TypeOf<typeof readExperienceSchema>;
export type ReadExperiencesInput = TypeOf<typeof readExperiencesSchema>;
export type UpdateExperienceInput = TypeOf<typeof updateExperienceSchema>;
export type DeleteExperienceInput = TypeOf<typeof deleteExperienceSchema>;
