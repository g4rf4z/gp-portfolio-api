import { Request, Response } from 'express';

import {
  createExperienceService,
  readExperienceService,
  readExperiencesService,
  updateExperienceService,
  deleteExperienceService,
} from '../services/experience.service';

import type {
  CreateExperienceInput,
  ReadExperienceInput,
  ReadExperiencesInput,
  UpdateExperienceInput,
  DeleteExperienceInput,
} from '../schemas/experience.schema';

import { handleError } from '../utils/errors.util';

export const createExperienceController = async (
  req: Request<{}, {}, CreateExperienceInput['body']>,
  res: Response
) => {
  try {
    const createExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
        technologies: true,
      },
    };

    const createdExperience = await createExperienceService(
      req.body.data,
      createExperienceOptions
    );

    return res.send(createdExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readExperienceController = async (
  req: Request<ReadExperienceInput['params'], {}, {}>,
  res: Response
) => {
  try {
    const readExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
        technologies: true,
      },
    };

    const foundExperience = await readExperienceService(
      req.params,
      readExperienceOptions
    );

    return res.send(foundExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readExperiencesController = async (
  req: Request<{}, {}, ReadExperiencesInput['body']>,
  res: Response
) => {
  try {
    const readExperiencesOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
        technologies: true,
      },
    };

    const foundExperiences = await readExperiencesService(
      req.params,
      readExperiencesOptions
    );

    if (foundExperiences.length === 0) return res.status(204).send();

    return res.send(foundExperiences);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateExperienceController = async (
  req: Request<
    UpdateExperienceInput['params'],
    {},
    UpdateExperienceInput['body']
  >,
  res: Response
) => {
  try {
    const updateExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
        technologies: true,
      },
    };

    const updatedExperience = await updateExperienceService(
      { id: req.params.id },
      req.body.data,
      updateExperienceOptions
    );

    return res.send(updatedExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteExperienceController = async (
  req: Request<DeleteExperienceInput['params'], {}, {}>,
  res: Response
) => {
  try {
    const deleteExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
        technologies: true,
      },
    };

    const deletedExperience = await deleteExperienceService(
      { id: req.params.id },
      deleteExperienceOptions
    );

    return res.send(deletedExperience);
  } catch (error) {
    return handleError(error, res);
  }
};
