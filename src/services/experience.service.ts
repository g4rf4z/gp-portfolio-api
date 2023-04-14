import type { Prisma } from "@prisma/client";

import { prisma } from "../utils/prisma";
import { handlePrismaError } from "../utils/errors";

export const createExperience = async (
  data: Prisma.ExperienceCreateArgs["data"],
  options: Omit<Prisma.ExperienceCreateArgs, "data"> = {}
) => {
  try {
    return await prisma.experience.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, "experience");
  }
};

export const readExperience = async (
  params: Prisma.ExperienceFindUniqueOrThrowArgs["where"],
  options: Omit<Prisma.ExperienceFindUniqueOrThrowArgs, "where"> = {}
) => {
  try {
    return await prisma.experience.findUniqueOrThrow({
      where: params,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "experience");
  }
};

export const readExperiences = async (
  params: Prisma.ExperienceFindManyArgs["where"],
  options: Omit<Prisma.ExperienceFindManyArgs, "where"> = {}
) => {
  try {
    return await prisma.experience.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "experience");
  }
};

export const updateExperience = async (
  params: Prisma.ExperienceUpdateArgs["where"],
  data: Prisma.ExperienceUpdateArgs["data"],
  options: Omit<Prisma.ExperienceUpdateArgs, "where" | "data"> = {}
) => {
  try {
    return await prisma.experience.update({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "experience");
  }
};

export const deleteExperience = async (
  params: Prisma.ExperienceDeleteArgs["where"],
  options: Omit<Prisma.ExperienceDeleteArgs, "where">
) => {
  try {
    return await prisma.experience.delete({
      where: params,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "experience");
  }
};
