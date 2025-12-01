import { Logger } from '@nestjs/common';

export class StreamLogger {
  private static readonly logger = new Logger('StreamService');

  static logStreamError(error: any, context: string = 'Stream') {
    // List of errors to ignore (common client disconnection errors)
    const ignoredErrors = [
      'ERR_STREAM_PREMATURE_CLOSE',
      'ECONNRESET',
      'ECONNABORTED',
      'EPIPE',
      'ERR_STREAM_DESTROYED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];

    if (ignoredErrors.includes(error.code)) {
      // Silently ignore these common streaming errors
      return;
    }

    // Log other errors as warnings or errors
    if (error.code && error.code.startsWith('ERR_STREAM_')) {
      this.logger.warn(`${context} - Stream error: ${error.message}`);
    } else {
      this.logger.error(`${context} - Unexpected error: ${error.message}`, error.stack);
    }
  }

  static isIgnoredStreamError(error: any): boolean {
    const ignoredErrors = [
      'ERR_STREAM_PREMATURE_CLOSE',
      'ECONNRESET',
      'ECONNABORTED',
      'EPIPE',
      'ERR_STREAM_DESTROYED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];

    return ignoredErrors.includes(error.code);
  }
}