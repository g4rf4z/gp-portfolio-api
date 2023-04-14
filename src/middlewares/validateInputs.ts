import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body,
    });
    next();
  } catch (error) {
    const validationError = error as ZodError;
    return res.status(400).send(validationError.issues);
  }
};

export default validate;
