import { Request, Response } from "express";

import { handleError } from "../utils/errors.util";

import {
  createSkill,
  readSkill,
  readSkills,
  updateSkill,
  deleteSkill,
} from "../services/skill.service";

import type {
  CreateSkillInput,
  ReadSkillInput,
  ReadSkillsInput,
  UpdateSkillInput,
  DeleteSkillInput,
} from "../schemas/skill.schema";

export const createSkillController = async (
  req: Request<{}, {}, CreateSkillInput["body"]>,
  res: Response
) => {
  try {
    const createSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        progress: true,
      },
    };
    const createdSkill = await createSkill(req.body.data, createSkillOptions);
    return res.send(createdSkill);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readSkillController = async (
  req: Request<ReadSkillInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const readSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        progress: true,
      },
    };
    const foundSkill = await readSkill(req.params, readSkillOptions);
    return res.send(foundSkill);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readSkillsController = async (
  req: Request<{}, {}, ReadSkillsInput["body"]>,
  res: Response
) => {
  try {
    const readSkillsOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        progress: true,
      },
    };
    const foundSkills = await readSkills(req.body.params, readSkillsOptions);
    if (foundSkills.length === 0) return res.status(204).send();

    return res.send(foundSkills);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateSkillController = async (
  req: Request<UpdateSkillInput["params"], {}, UpdateSkillInput["body"]>,
  res: Response
) => {
  try {
    const updateSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        progress: true,
      },
    };
    const updatedSkill = await updateSkill(
      { id: req.params.id },
      req.body.data,
      updateSkillOptions
    );
    return res.send(updatedSkill);
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteSkillController = async (
  req: Request<DeleteSkillInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const deleteSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        image: true,
        progress: true,
      },
    };
    const deletedSkill = await deleteSkill(
      { id: req.params.id },
      deleteSkillOptions
    );
    return res.send(deletedSkill);
  } catch (error) {
    return handleError(error, res);
  }
};
