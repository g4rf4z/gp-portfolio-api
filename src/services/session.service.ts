import type { Prisma } from '@prisma/client';

import { prisma } from '../utils/prisma.util';
import { handlePrismaError } from '../utils/errors.util';

export const createSessionService = async (
  data: Prisma.SessionCreateArgs['data'],
  options: Omit<Prisma.SessionCreateArgs, 'data'> = {}
) => {
  try {
    return await prisma.session.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};

export const readSessionService = async (
  params: Prisma.SessionFindFirstOrThrowArgs['where'],
  options: Omit<Prisma.SessionFindFirstOrThrowArgs, 'where'> = {}
) => {
  try {
    return await prisma.session.findFirstOrThrow({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};

export const readSessionsService = async (
  params: Prisma.SessionFindManyArgs['where'],
  options: Omit<Prisma.SessionFindManyArgs, 'where'> = {}
) => {
  try {
    return await prisma.session.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};

export const updateSessionsService = async (
  params: Prisma.SessionUpdateManyArgs['where'],
  data: Prisma.SessionUpdateManyArgs['data']
) => {
  try {
    return await prisma.session.updateMany({ where: params, data });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};

export const deleteSessionService = async (
  params: Prisma.SessionDeleteArgs['where'],
  options: Omit<Prisma.SessionDeleteArgs, 'where'>
) => {
  try {
    return await prisma.session.delete({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};

export const deleteSessionsService = async (
  params: Prisma.SessionDeleteManyArgs['where'],
  options: Omit<Prisma.SessionDeleteManyArgs, 'where'> = {}
) => {
  try {
    return await prisma.session.deleteMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'session');
  }
};
