import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './jwt';

import { Service } from 'typedi';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { GenerateUUID } from '../lib/commonFunctions';
import AuthDatabaseAccessLayer from '../DatabaseAccessLayer/auth.dal';
import { CreateUserType } from '../schema/CreateUser';

@Service()
export default class AuthService {
  constructor(private readonly authDA: AuthDatabaseAccessLayer) {}

  // In-memory OTP store (email -> { otp, expiresAt })
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  private generateOTP(): string {
    // Generates a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    // Configure nodemailer transport (update as needed)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  }

  // POST: Create a new user using OTP verification.
  // If no OTP is provided, an OTP is generated and emailed.
  // If an OTP is provided, it is verified before user creation.
  CreateUser = async (
    request: Request<any, any, CreateUserType>,
    response: Response
  ) => {
    const { firstName, lastName, email, password, otp } = request.body;

    // Step 1: If no OTP is provided, send one.
    if (!otp) {
      const emailExists = await this.authDA.CheckEmailExists(email);
      if (emailExists != null && emailExists.length > 0) {
        response.status(400).send([{ message: 'Email already exists.' }]);
        return;
      }
      const generatedOtp = this.generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
      this.otpStore.set(email, { otp: generatedOtp, expiresAt });
      try {
        await this.sendOtpEmail(email, generatedOtp);
        response.status(200).send({ message: 'OTP sent to your email.' });
      } catch (error) {
        console.error('Failed to send OTP email:', error);
        response.status(500).send([{ message: 'Failed to send OTP email.' }]);
      }
      return;
    }

    // Step 2: OTP is provided so verify it.
    const stored = this.otpStore.get(email);
    if (!stored) {
      response
        .status(400)
        .send([{ message: 'No OTP request found for this email.' }]);
      return;
    }
    if (stored.expiresAt < Date.now() || stored.otp !== otp) {
      response.status(400).send([{ message: 'Invalid or expired OTP.' }]);
      return;
    }
    // OTP is valid, remove it from storage and create user.
    this.otpStore.delete(email);
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password!, 10);
    const newUserId = GenerateUUID();
    await this.authDA.CreateUser(
      newUserId,
      firstName,
      lastName,
      email,
      hashedPassword
    );
    response.status(200).send({ userId: newUserId });
  };

  // GET: Get user details by user id (expects userId as route parameter)
  GetUserById = async (request: Request, response: Response) => {
    const userId = request.params.userId;
    if (!userId) {
      response.status(400).send([{ message: 'UserId parameter is required.' }]);
      return;
    }
    const user = await this.authDA.GetUserById(userId);
    if (!user || user.length === 0) {
      response.status(404).send([{ message: 'User not found.' }]);
      return;
    }
    response.status(200).send(user[0]);
  };

  // PUT: Update user details after verifying the email exists.
  UpdateUser = async (request: Request, response: Response) => {
    const { userId, firstName, lastName, email } = request.body;
    const userExists = await this.authDA.GetUserById(userId);

    if (!userExists || userExists.length === 0) {
      response.status(404).send([{ message: 'User not found.' }]);
      return;
    }

    await this.authDA.UpdateUser(userId, firstName, lastName, email);
    response.status(200).send({ message: 'User updated successfully.' });
  };

  // POST: Login user and return JWT tokens
  Login = async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const user = await this.authDA.GetUserByEmail(email);
    if (!user || user.length === 0) {
      response.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // user[0] should have a Password field (hashed)
    const hashedPassword = user[0].Password;
    if (!hashedPassword || !password) {
      response.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      response.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const payload = { userId: user[0].User_Id, email: user[0].Email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    response.status(200).json({ accessToken, refreshToken });
    return;
  };

  // POST: Refresh JWT access token
  RefreshToken = async (request: Request, response: Response) => {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      response.status(400).json({ message: 'Refresh token required' });
      return;
    }
    try {
      const decoded = verifyRefreshToken(refreshToken) as any;
      const payload = { userId: decoded.userId, email: decoded.email };
      const accessToken = generateAccessToken(payload);
      response.status(200).json({ accessToken });
      return;
    } catch (err) {
      response
        .status(401)
        .json({ message: 'Invalid or expired refresh token' });
      return;
    }
  };
}
