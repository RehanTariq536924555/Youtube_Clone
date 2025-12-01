import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class StreamExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(StreamExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // List of common streaming errors that should be ignored (client disconnections)
    const ignoredStreamErrors = [
      'ERR_STREAM_PREMATURE_CLOSE',
      'ECONNRESET',
      'ECONNABORTED',
      'EPIPE',
      'ERR_STREAM_DESTROYED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];

    // Handle common streaming errors gracefully
    if (ignoredStreamErrors.includes(exception.code)) {
      // This is normal behavior when clients disconnect during streaming
      // Don't log these as errors to reduce console noise
      return;
    }

    // Handle other stream-related errors
    if (exception.code && exception.code.startsWith('ERR_STREAM_')) {
      this.logger.warn(`Stream error for ${request.url}: ${exception.message}`);
      
      // Try to send error response if connection is still open
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

    // Handle other exceptions normally
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';

    this.logger.error(`Exception: ${message}`, exception.stack);

    if (!response.headersSent) {
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}