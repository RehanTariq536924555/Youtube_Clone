import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.usersService.validateUser(email, password);
  }

  async login(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      name: user.name,
      picture: user.picture,
      googleId: user.googleId,
      role: user.role || 'user'
    };
    
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }), // Extended to 30 days
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
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      name: user.name,
      picture: user.picture,
      googleId: user.googleId
    };
    
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async validateGoogleUser(profile: any): Promise<User> {
    const { name, emails, photos, id: googleId } = profile;
    const email = emails[0].value;
    const picture = photos[0].value;

    // Check if user exists by Google ID
    let user = await this.usersService.findByGoogleId(googleId);
    
    if (user) {
      // Update user info from Google (in case they changed their profile)
      user.name = name.givenName + ' ' + name.familyName;
      user.picture = picture;
      await this.usersService.updateUser(user.id, { name: user.name, picture: user.picture });
      return user;
    }

    // Check if user exists by email
    user = await this.usersService.findByEmail(email);
    
    if (user) {
      // Link existing account with Google
      return await this.usersService.linkGoogleAccount(user.id, googleId, picture);
    }

    // Create new user
    return await this.usersService.createGoogleUser({
      email,
      name: name.givenName + ' ' + name.familyName,
      googleId,
      picture,
      isEmailVerified: true,
    });
  }
}
