import { Response } from 'express';
export declare class AppController {
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
    };
    headHealthCheck(res: Response): void;
    getFavicon(res: Response): void;
    headFavicon(res: Response): void;
}
