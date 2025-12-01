import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly emailService;
    constructor(userRepository: UserRepository, emailService: EmailService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User | undefined>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
    deleteUserById(userId: string): Promise<void>;
    findByEmail(email: string): Promise<User | undefined>;
    validateUser(email: string, password: string): Promise<User | null>;
    verifyEmail(token: string): Promise<User | null>;
    testEmailService(email: string): Promise<void>;
    manualVerifyUser(user: User): Promise<User>;
    createGoogleUser(googleData: {
        email: string;
        name: string;
        googleId: string;
        picture: string;
        isEmailVerified: boolean;
    }): Promise<User>;
    linkGoogleAccount(userId: string, googleId: string, picture: string): Promise<User>;
    findByGoogleId(googleId: string): Promise<User | undefined>;
    updateUser(userId: string, updateData: Partial<User>): Promise<User>;
}
