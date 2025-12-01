import { ConsoleLogger } from '@nestjs/common';
export declare class CustomLogger extends ConsoleLogger {
    error(message: any, trace?: string, context?: string): void;
}
