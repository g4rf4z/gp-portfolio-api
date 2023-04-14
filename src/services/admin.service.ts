import type { Prisma } from "@prisma/client";

import { prisma } from "../utils/prisma";
import { handlePrismaError } from "../utils/errors";

export const createAdmin = async (
  data: Prisma.AdminCreateArgs["data"],
  options: Omit<Prisma.AdminCreateArgs, "data"> = {}
) => {
  try {
    return await prisma.admin.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, "admin");
  }
};

export const readAdmin = async (
  params: Prisma.AdminFindUniqueOrThrowArgs["where"],
  options: Omit<Prisma.AdminFindUniqueOrThrowArgs, "where"> = {}
) => {
  try {
    return await prisma.admin.findUniqueOrThrow({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "admin");
  }
};

export const readAdmins = async (
  params: Prisma.AdminFindManyArgs["where"],
  options: Omit<Prisma.AdminFindManyArgs, "where"> = {}
) => {
  try {
    return await prisma.admin.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "admin");
  }
};

export const updateAdmin = async (
  params: Prisma.AdminUpdateArgs["where"],
  data: Prisma.AdminUpdateArgs["data"],
  options: Omit<Prisma.AdminUpdateArgs, "where" | "data"> = {}
) => {
  try {
    return await prisma.admin.update({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "admin");
  }
};

export const deleteAdmin = async (
  params: Prisma.AdminDeleteArgs["where"],
  options: Omit<Prisma.AdminDeleteArgs, "where">
) => {
  try {
    return await prisma.admin.delete({
      where: params,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "admin");
  }
};
