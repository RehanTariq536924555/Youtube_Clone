export declare class StreamLogger {
    private static readonly logger;
    static logStreamError(error: any, context?: string): void;
    static isIgnoredStreamError(error: any): boolean;
}
