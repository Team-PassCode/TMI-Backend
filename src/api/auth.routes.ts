import { Router } from 'express';
import AuthService from '../service/auth.service';
import { ValidateCreateUser } from '../schema/CreateUser';
import { Controller } from '../decorator/controller';
import { authenticate } from '../middleware/authenticate';

@Controller('/auth')
export default class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  SetRouter(router: Router) {
    /**
     * @openapi
     * /auth/login:
     *   post:
     *     summary: Login user and get JWT tokens
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Login successful, returns access and refresh tokens
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                 refreshToken:
     *                   type: string
     *       401:
     *         description: Invalid credentials
     */
    router.post('/login', this.authService.Login);

    /**
     * @openapi
     * /auth/refresh-token:
     *   post:
     *     summary: Refresh JWT access token
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *             required:
     *               - refreshToken
     *     responses:
     *       200:
     *         description: New access token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *       401:
     *         description: Invalid or expired refresh token
     */
    router.post('/refresh-token', this.authService.RefreshToken);
    /**
     * @openapi
     * /auth:
     *   post:
     *     summary: Create a new user
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               otp:
     *                 type: string
     *                 nullable: true
     *             required:
     *               - firstName
     *               - lastName
     *               - email
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Invalid input
     */
    router.post('/', ValidateCreateUser, this.authService.CreateUser);

    /**
     * @openapi
     * /auth:
     *   put:
     *     summary: Update an existing user
     *     tags:
     *       - Auth
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *             required:
     *               - userId
     *     responses:
     *       200:
     *         description: User updated successfully
     *       400:
     *         description: Invalid input
     */
    router.put('/', authenticate, this.authService.UpdateUser);

    /**
     * @openapi
     * /auth/{userId}:
     *   get:
     *     summary: Get user by ID
     *     tags:
     *       - Auth
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 userId:
     *                   type: string
     *                 firstName:
     *                   type: string
     *                 lastName:
     *                   type: string
     *                 email:
     *                   type: string
     *                   format: email
     *       404:
     *         description: User not found
     */
    router.get('/:userId', authenticate, this.authService.GetUserById);
  }
}
