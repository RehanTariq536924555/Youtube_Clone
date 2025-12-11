import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            googleId: string;
            isEmailVerified: boolean;
            role: string;
            createdAt: Date;
        };
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
    }>;
    validateGoogleUser(profile: any): Promise<User>;
}
