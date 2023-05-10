import { Request, Response } from "express";

import { handleError } from "../utils/errors.util";

import {
  createExperience,
  readExperience,
  readExperiences,
  updateExperience,
  deleteExperience,
} from "../services/experience.service";

import type {
  CreateExperienceInput,
  ReadExperienceInput,
  ReadExperiencesInput,
  UpdateExperienceInput,
  DeleteExperienceInput,
} from "../schemas/experience.schema";

export const createExperienceController = async (
  req: Request<{}, {}, CreateExperienceInput["body"]>,
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
      },
    };
    const createdExperience = await createExperience(
      req.body.data,
      createExperienceOptions
    );
    return res.send(createdExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readExperienceController = async (
  req: Request<ReadExperienceInput["params"], {}, {}>,
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
      },
    };
    const foundExperience = await readExperience(
      req.params,
      readExperienceOptions
    );
    return res.send(foundExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readExperiencesController = async (
  req: Request<{}, {}, ReadExperiencesInput["body"]>,
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
      },
    };
    const foundExperiences = await readExperiences(
      req.body.params,
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
    UpdateExperienceInput["params"],
    {},
    UpdateExperienceInput["body"]
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
      },
    };
    const updatedExperience = await updateExperience(
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
  req: Request<DeleteExperienceInput["params"], {}, {}>,
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
      },
    };
    const deletedExperience = await deleteExperience(
      { id: req.params.id },
      deleteExperienceOptions
    );
    return res.send(deletedExperience);
  } catch (error) {
    return handleError(error, res);
  }
};
