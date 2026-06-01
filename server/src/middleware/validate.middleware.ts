import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../types';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse validates body, params, and query simultaneously
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.flatten().fieldErrors;

        const response: ApiResponse = {
          success: false,
          message: 'Validation failed',
          errors,
        };

        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };
}
