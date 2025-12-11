import { Controller, Post, Body, UseGuards, Request, Get, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from '../users/users.service';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      
      // Provide different messages based on verification status
      const message = user.isEmailVerified 
        ? 'User registered successfully and email auto-verified for development. You can now login.'
        : 'User registered successfully. Please check your email to verify your account.';
      
      return {
        message,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      };
    } catch (error) {
      if (error.status === 409) { // ConflictException
        return {
          error: 'Registration failed',
          message: error.message,
          statusCode: 409
        };
      }
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // Check if email is verified
    if (!req.user.isEmailVerified) {
      return {
        error: 'Email not verified',
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        statusCode: 403
      };
    }
    return this.authService.login(req.user);
  }
  

  @UseGuards()
  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    const user = await this.usersService.verifyEmail(token);
    if (user) {
      return { 
        message: 'Email verified successfully',
        redirectUrl: `${process.env.FRONTEND_URL}/profile`, // Add redirect URL
       };
      
    } else {
      return { message: 'Invalid or expired verification token' };
    }
  }

@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@Get('protected-route')
async getProtectedData() {
  return { data: 'This is protected data' };
}

@Post('test-email')
async testEmail(@Body() body: { email: string }) {
  try {
    await this.usersService.testEmailService(body.email);
    return { message: 'Test email sent successfully' };
  } catch (error) {
    return { error: 'Failed to send test email', details: error.message };
  }
}

@Post('manual-verify')
async manualVerifyEmail(@Body() body: { email: string }) {
  try {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      return { error: 'User not found' };
    }
    
    if (user.isEmailVerified) {
      return { message: 'Email is already verified' };
    }
    
    // Manually verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.usersService.manualVerifyUser(user);
    
    return { message: 'Email verified manually for development' };
  } catch (error) {
    return { error: 'Failed to verify email manually', details: error.message };
  }
}

@UseGuards(JwtAuthGuard)
@Get('me')
async getCurrentUser(@Request() req) {
  try {
    // JWT strategy returns 'id', not 'sub'
    const userId = req.user.id || req.user.sub;
    console.log('GET /auth/me - User ID from token:', userId);
    console.log('GET /auth/me - Full req.user:', req.user);
    
    const user = await this.usersService.findById(userId);
    if (!user) {
      console.error('GET /auth/me - User not found:', userId);
      return { error: 'User not found' };
    }
    
    console.log('GET /auth/me - User found:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.googleId,
        isEmailVerified: user.isEmailVerified,
        role: user.role || 'user',
        createdAt: user.createdAt
      }
    };
    
    console.log('GET /auth/me - Sending response:', JSON.stringify(responseData));
    
    return responseData;
  } catch (error) {
    console.error('GET /auth/me - Error:', error.message);
    return { error: 'Failed to get user info', details: error.message };
  }
}

// Google OAuth Routes
@Get('google')
@UseGuards(GoogleAuthGuard)
async googleAuth(@Request() req) {
  // This route initiates Google OAuth flow
  // The guard will redirect to Google
}

@Get('google/callback')
@UseGuards(GoogleAuthGuard)
async googleAuthCallback(@Request() req, @Res() res: Response) {
  try {
    // Generate JWT token for the authenticated user
    const loginResult = await this.authService.login(req.user);
    
    // Redirect to frontend with token and user data
    // Using hash router format: /#/auth/callback
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
      googleId: req.user.googleId,
      isEmailVerified: req.user.isEmailVerified,
      role: req.user.role || 'user'
    };
    
    res.redirect(`${frontendUrl}/#/auth/callback?token=${loginResult.access_token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/#/auth/error?message=${encodeURIComponent('Authentication failed')}`);
  }
}

// YouTube-style: Verify Google credential token
@Post('google/verify')
async googleVerifyCredential(@Body() body: { credential: string }) {
  try {
    // Decode and verify the Google JWT credential
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];
    
    // Check if user exists by Google ID
    let user = await this.usersService.findByGoogleId(googleId);
    
    if (!user) {
      // Check if user exists by email
      user = await this.usersService.findByEmail(email);
      
      if (user) {
        // Link existing account with Google
        user = await this.usersService.linkGoogleAccount(user.id, googleId, picture);
      } else {
        // Create new user
        user = await this.usersService.createGoogleUser({
          email,
          name,
          googleId,
          picture,
          isEmailVerified: true,
        });
      }
    } else {
      // Update user info from Google (in case they changed their profile)
      user.name = name;
      user.picture = picture;
      await this.usersService.updateUser(user.id, { name: user.name, picture: user.picture });
    }
    
    // Generate JWT token
    const loginResult = await this.authService.login(user);
    
    return {
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.googleId,
        isEmailVerified: user.isEmailVerified,
        role: user.role || 'user'
      },
      access_token: loginResult.access_token
    };
  } catch (error) {
    console.error('Google credential verification failed:', error);
    return {
      error: 'Google authentication failed',
      message: error.message || 'Invalid credential',
      statusCode: 400
    };
  }
}

// Development-only: Mock Google Auth for testing
@Post('google/mock')
async googleMockAuth(@Body() body: { email: string; name: string; picture?: string }) {
  try {
    // Check if user already exists
    let user = await this.usersService.findByEmail(body.email);
    
    if (!user) {
      // Create new user with Google data
      user = await this.usersService.createGoogleUser({
        email: body.email,
        name: body.name,
        googleId: 'mock-' + Date.now(),
        picture: body.picture || `https://ui-avatars.com/api/?background=random&name=${body.name}`,
        isEmailVerified: true,
      });
    }
    
    // Generate JWT token
    const loginResult = await this.authService.login(user);
    
    return {
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.googleId,
        isEmailVerified: user.isEmailVerified,
        role: user.role || 'user'
      },
      access_token: loginResult.access_token
    };
  } catch (error) {
    return {
      error: 'Google authentication failed',
      message: error.message,
      statusCode: 400
    };
  }
}
}
