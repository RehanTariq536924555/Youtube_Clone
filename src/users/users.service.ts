import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const user = this.userRepository.create(createUserDto);
      user.emailVerificationToken = randomUUID();
      await this.userRepository.save(user);
      
      // In development mode with auto-verify enabled, skip email and auto-verify
      if (process.env.NODE_ENV === 'development' && process.env.AUTO_VERIFY_EMAIL === 'true') {
        console.log('Development mode: Auto-verifying user email (skipping email send)');
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        await this.userRepository.save(user);
        console.log(`User ${user.email} auto-verified for development`);
      } else {
        // Send verification email in production or when auto-verify is disabled
        try {
          await this.emailService.sendVerificationEmail(user.email, user.emailVerificationToken);
          console.log(`Verification email sent to ${user.email}`);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          throw new Error('Failed to send verification email. Please try again or contact support.');
        }
      }
      
      return user;
    } catch (error) {
      // Handle database constraint violations
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }


   findAll(){
    return this.userRepository.find();
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
  
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async deleteUserById(userId: string): Promise<void> {
    const result = await this.userRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password comparison result:', isMatch);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
  


  async verifyEmail(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { emailVerificationToken: token }});
    if (user) {
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      await this.userRepository.save(user);
      return user;
    }
    return null;
  }

  async testEmailService(email: string): Promise<void> {
    await this.emailService.sendVerificationEmail(email, 'test-token-123');
  }

  async manualVerifyUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async createGoogleUser(googleData: {
    email: string;
    name: string;
    googleId: string;
    picture: string;
    isEmailVerified: boolean;
  }): Promise<User> {
    const user = this.userRepository.create({
      ...googleData,
      password: null, // Google users don't have passwords
    });
    
    return this.userRepository.save(user);
  }

  async linkGoogleAccount(userId: string, googleId: string, picture: string): Promise<User> {
    await this.userRepository.update(userId, { 
      googleId, 
      picture,
      isEmailVerified: true 
    });
    
    return this.findById(userId);
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, updateData);
    return this.findById(userId);
  }
}
