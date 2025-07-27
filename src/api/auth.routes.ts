import { Router } from 'express';
import AuthService from '../service/auth.service';
import { ValidateCreateUser } from '../schema/CreateUser';
import { Controller } from '../decorator/controller';
import { authenticate } from '../middleware/authenticate';

@Controller('/auth')
export default class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  SetRouter(router: Router) {
    router.post('/login', this.authService.Login);

    router.post('/refresh-token', this.authService.RefreshToken);
    router.post('/', ValidateCreateUser, this.authService.CreateUser);

    router.put('/', authenticate, this.authService.UpdateUser);

    router.get('/:userId', authenticate, this.authService.GetUserById);
  }
}
