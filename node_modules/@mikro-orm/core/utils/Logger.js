"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
class Logger {
    constructor(logger, debugMode = false) {
        this.logger = logger;
        this.debugMode = debugMode;
    }
    /**
     * Logs a message inside given namespace.
     */
    log(namespace, message) {
        if (!this.isEnabled(namespace)) {
            return;
        }
        // clean up the whitespace
        message = message.replace(/\n/g, '').replace(/ +/g, ' ').trim();
        this.logger(ansi_colors_1.default.grey(`[${namespace}] `) + message);
    }
    /**
     * Sets active namespaces. Pass `true` to enable all logging.
     */
    setDebugMode(debugMode) {
        this.debugMode = debugMode;
    }
    isEnabled(namespace) {
        return this.debugMode && (!Array.isArray(this.debugMode) || this.debugMode.includes(namespace));
    }
}
exports.Logger = Logger;
