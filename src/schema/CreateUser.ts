import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { String } from './ScemaValidation';

const CreateUserSchema = z.object({
  firstName: String('First Name', true),
  lastName: String('Last Name', true),
  email: String('Email', true).email(),
  otp: z.string().optional(),
});

type CreateUserType = z.infer<typeof CreateUserSchema>;

const ValidateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRequest(req, res, next, CreateUserSchema);
};

export { ValidateCreateUser, CreateUserSchema, CreateUserType };
