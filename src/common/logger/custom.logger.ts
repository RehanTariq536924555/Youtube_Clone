import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(message: any, trace?: string, context?: string): void {
    // Filter out premature close errors from StreamableFile
    if (typeof message === 'string' && message.includes('Premature close')) {
      // Log as debug instead of error
      this.debug(message, context);
      return;
    }
    
    // Log other errors normally
    super.error(message, trace, context);
  }
}