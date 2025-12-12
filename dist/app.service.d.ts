export declare class AppService {
    getHealth(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
        environment: string;
    };
    getHealthCheck(): {
        status: string;
        service: string;
        database: string;
        timestamp: string;
        uptime: number;
        routes: string;
    };
    getApiHealth(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
    };
}
