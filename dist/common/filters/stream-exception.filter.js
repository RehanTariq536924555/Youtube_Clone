"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StreamExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let StreamExceptionFilter = StreamExceptionFilter_1 = class StreamExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(StreamExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const ignoredStreamErrors = [
            'ERR_STREAM_PREMATURE_CLOSE',
            'ECONNRESET',
            'ECONNABORTED',
            'EPIPE',
            'ERR_STREAM_DESTROYED',
            'ENOTFOUND',
            'ETIMEDOUT'
        ];
        if (ignoredStreamErrors.includes(exception.code)) {
            return;
        }
        if (exception.code && exception.code.startsWith('ERR_STREAM_')) {
            if (exception.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
                this.logger.warn(`Stream error for ${request.url}: ${exception.message}`);
            }
            if (!response.headersSent) {
                response.status(500).json({
                    statusCode: 500,
                    message: 'Stream error occurred',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
            }
            return;
        }
        const status = exception.getStatus ? exception.getStatus() : 500;
        const message = exception.message || 'Internal server error';
        if (status === 404 && (request.url === '/' || request.url === '/health' || request.url === '/favicon.ico')) {
            if (!response.headersSent) {
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
            }
            return;
        }
        if (message.includes('Video file not found') || message.includes('video not found')) {
            this.logger.warn(`Video not found: ${request.url}`);
        }
        else {
            this.logger.error(`Exception: ${message}`, exception.stack);
        }
        if (!response.headersSent) {
            response.status(status).json({
                statusCode: status,
                message: message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
};
exports.StreamExceptionFilter = StreamExceptionFilter;
exports.StreamExceptionFilter = StreamExceptionFilter = StreamExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], StreamExceptionFilter);
//# sourceMappingURL=stream-exception.filter.js.map