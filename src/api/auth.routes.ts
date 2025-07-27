import { Router } from 'express';
import AuthService from '../service/auth.service';
import { ValidateCreateUser } from '../schema/CreateUser';
import { Controller } from '../decorator/controller';

@Controller('/auth')
export default class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  SetRouter(router: Router) {
    // Create user
    router.post('/', ValidateCreateUser, this.authService.CreateUser);

    // Update user
    router.put('/', this.authService.UpdateUser);

    // Get user
    router.get('/:userId', this.authService.GetUserById);
  }
}
