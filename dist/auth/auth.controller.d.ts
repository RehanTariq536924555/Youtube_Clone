import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            isEmailVerified: boolean;
        };
        error?: undefined;
        statusCode?: undefined;
    } | {
        error: string;
        message: any;
        statusCode: number;
        user?: undefined;
    }>;
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            googleId: string;
            isEmailVerified: boolean;
            createdAt: Date;
        };
    } | {
        error: string;
        message: string;
        statusCode: number;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        redirectUrl: string;
    } | {
        message: string;
        redirectUrl?: undefined;
    }>;
    getProtectedData(): Promise<{
        data: string;
    }>;
    testEmail(body: {
        email: string;
    }): Promise<{
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
    }>;
    manualVerifyEmail(body: {
        email: string;
    }): Promise<{
        error: string;
        message?: undefined;
        details?: undefined;
    } | {
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
    }>;
    getCurrentUser(req: any): Promise<{
        error: string;
        user?: undefined;
        details?: undefined;
    } | {
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            googleId: string;
            isEmailVerified: boolean;
            createdAt: Date;
        };
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        user?: undefined;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
    googleVerifyCredential(body: {
        credential: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            googleId: string;
            isEmailVerified: boolean;
        };
        access_token: string;
        error?: undefined;
        statusCode?: undefined;
    } | {
        error: string;
        message: any;
        statusCode: number;
        user?: undefined;
        access_token?: undefined;
    }>;
    googleMockAuth(body: {
        email: string;
        name: string;
        picture?: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            googleId: string;
            isEmailVerified: boolean;
        };
        access_token: string;
        error?: undefined;
        statusCode?: undefined;
    } | {
        error: string;
        message: any;
        statusCode: number;
        user?: undefined;
        access_token?: undefined;
    }>;
}
