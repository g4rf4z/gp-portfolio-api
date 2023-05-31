import { Response } from 'express';
import { AdminRole } from '@prisma/client';

export const checkAdminClearance = (
  res: Response,
  authorizedRoles: AdminRole[]
) => {
  if (authorizedRoles.includes(res.locals?.account?.role)) return true;
  else {
    res.status(403).send();
    return false;
  }
};
