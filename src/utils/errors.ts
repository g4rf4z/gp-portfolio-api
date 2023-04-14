import { Prisma } from "@prisma/client";
import { Response } from "express";

export interface ICustomError {
  type?: string;
  path: string;
  code: number;
  message: string;
}

export class CustomError {
  type?: string;
  path: string;
  code: number;
  message: string;

  constructor(data: ICustomError) {
    this.type = data?.type;
    this.path = data.path;
    this.code = data.code;
    this.message = data.message;
  }
}

export const handlePrismaError = (
  error: any,
  ressource: string
): CustomError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error);
    switch (error.code) {
      case "P2002":
        return new CustomError({
          type: "PrismaKnownError",
          path: (error?.meta?.target as string)?.split("_")[1],
          code: 409,
          message: "taken",
        });
      case "P2023":
      case "P2025":
        return new CustomError({
          type: "PrismaKnownError",
          path: ressource,
          code: 404,
          message: "non_found",
        });
      default:
        return new CustomError({
          type: "PrismaKnownError",
          path: ressource,
          code: 500,
          message: error.code,
        });
    }
  } else {
    if (error.name === "NotFoundError") {
      return new CustomError({
        type: "PrismaClientGenericError",
        path: ressource,
        code: 404,
        message: "not_found",
      });
    }
    return new CustomError({
      type: "PrismaClientGenericError",
      path: ressource,
      code: 500,
      message: "unknown_error",
    });
  }
};

export const handleError = (error: any, res: Response) => {
  console.error({ ...error });

  if (error instanceof CustomError) {
    return res.status(error.code).send({
      path: error.path,
      message: error.message,
    });
  }

  return res.status(500).send(error);
};
