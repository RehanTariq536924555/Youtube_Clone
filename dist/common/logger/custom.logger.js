"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
const common_1 = require("@nestjs/common");
class CustomLogger extends common_1.ConsoleLogger {
    error(message, trace, context) {
        if (typeof message === 'string' && message.includes('Premature close')) {
            this.debug(message, context);
            return;
        }
        super.error(message, trace, context);
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=custom.logger.js.map