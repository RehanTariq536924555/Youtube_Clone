"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamLogger = void 0;
const common_1 = require("@nestjs/common");
class StreamLogger {
    static logStreamError(error, context = 'Stream') {
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
            return;
        }
        if (error.code && error.code.startsWith('ERR_STREAM_')) {
            this.logger.warn(`${context} - Stream error: ${error.message}`);
        }
        else {
            this.logger.error(`${context} - Unexpected error: ${error.message}`, error.stack);
        }
    }
    static isIgnoredStreamError(error) {
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
exports.StreamLogger = StreamLogger;
StreamLogger.logger = new common_1.Logger('StreamService');
//# sourceMappingURL=logger.util.js.map