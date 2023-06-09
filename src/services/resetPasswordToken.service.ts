import type { Prisma } from '@prisma/client';

import { prisma } from '../utils/prisma.util';
import { handlePrismaError } from '../utils/errors.util';

export const createResetPasswordTokenService = async (
  data: Prisma.ResetPasswordTokenCreateArgs['data'],
  options: Omit<Prisma.ResetPasswordTokenCreateArgs, 'data'> = {}
) => {
  try {
    return await prisma.resetPasswordToken.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, 'resetPasswordToken');
  }
};

export const findResetPasswordTokenService = async (
  params: Prisma.ResetPasswordTokenFindFirstOrThrowArgs['where'],
  options: Omit<Prisma.ResetPasswordTokenFindFirstOrThrowArgs, 'where'> = {}
) => {
  try {
    return await prisma.resetPasswordToken.findFirstOrThrow({
      where: params,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, 'resetPasswordToken');
  }
};

export const updateResetPasswordTokenService = async (
  params: Prisma.ResetPasswordTokenUpdateArgs['where'],
  data: Prisma.ResetPasswordTokenUpdateArgs['data'],
  options: Omit<Prisma.ResetPasswordTokenUpdateArgs, 'where' | 'data'> = {}
) => {
  try {
    return await prisma.resetPasswordToken.update({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, 'resetPasswordToken');
  }
};

export const updateResetPasswordTokensService = async (
  params: Prisma.ResetPasswordTokenUpdateManyArgs['where'],
  data: Prisma.ResetPasswordTokenUpdateManyArgs['data'],
  options: Omit<Prisma.ResetPasswordTokenUpdateManyArgs, 'where' | 'data'> = {}
) => {
  try {
    return await prisma.resetPasswordToken.updateMany({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, 'resetPasswordToken');
  }
};
