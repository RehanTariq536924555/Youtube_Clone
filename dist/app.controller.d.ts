import { Response } from 'express';
import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
export declare class AppController {
    private readonly appService;
    private userRepository;
    private readonly logger;
    constructor(appService: AppService, userRepository: Repository<User>);
    getHealth(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
        environment: string;
    };
    headHealth(res: Response): void;
    getHealthCheck(): {
        status: string;
        service: string;
        database: string;
        timestamp: string;
        uptime: number;
        routes: string;
    };
    headHealthCheck(res: Response): void;
    getApiHealth(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
    };
    promoteToAdmin(email: string): Promise<{
        error: string;
        statusCode: number;
        message?: undefined;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
        error?: undefined;
        statusCode?: undefined;
    } | {
        error: string;
        message: any;
        statusCode: number;
        user?: undefined;
    }>;
    setUserPassword(email: string, password: string): Promise<{
        error: string;
        statusCode: number;
        message?: undefined;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            hasPassword: boolean;
        };
        error?: undefined;
        statusCode?: undefined;
    } | {
        error: string;
        message: any;
        statusCode: number;
        user?: undefined;
    }>;
    getFavicon(res: Response): void;
    headFavicon(res: Response): void;
}
