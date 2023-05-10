import type { Request, Response } from "express";

import { handleError } from "../utils/errors.util";
import { checkAdminClearance } from "../utils/checkPermissions.util";

import {
  readSession,
  readSessions,
  deleteSessions,
} from "../services/session.service";

import type { ReadSessionsInput } from "../schemas/session.schema";

export const findOwnSessionController = async (
  req: Request<{}, {}, ReadSessionsInput["body"]>,
  res: Response
) => {
  try {
    const findOwnSessionOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        userAgent: true,
        admin: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            firstname: true,
            lastname: true,
            nickname: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        ownerId: true,
      },
    };
    const foundOwnSession = await readSession(
      { ownerId: res.locals?.account?.id, isActive: true },
      findOwnSessionOptions
    );
    return res.send(foundOwnSession);
  } catch (error) {
    return handleError(error, res);
  }
};

export const findSessionsController = async (
  req: Request<{}, {}, ReadSessionsInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    const findOwnSessionsOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        userAgent: true,
        admin: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            firstname: true,
            lastname: true,
            nickname: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        ownerId: true,
      },
    };
    const foundOwnSessions = await readSessions(
      { ownerId: req.body.params?.ownerId },
      findOwnSessionsOptions
    );
    if (foundOwnSessions.length === 0) return res.status(204).send();
    return res.send(foundOwnSessions);
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteInactiveSessionsController = async (
  req: Request,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    const deletedInactiveSessions = await deleteSessions({ isActive: false });
    return res.send(deletedInactiveSessions);
  } catch (error) {
    return handleError(error, res);
  }
};
