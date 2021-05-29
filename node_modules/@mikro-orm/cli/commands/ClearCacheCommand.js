"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCacheCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const CLIHelper_1 = require("../CLIHelper");
class ClearCacheCommand {
    constructor() {
        this.command = 'cache:clear';
        this.describe = 'Clear metadata cache';
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const config = await CLIHelper_1.CLIHelper.getConfiguration(false);
        if (!config.get('cache').enabled) {
            CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.red('Metadata cache is disabled in your configuration. Set cache.enabled to true to use this command.'));
            return;
        }
        const cache = config.getCacheAdapter();
        await cache.clear();
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green('Metadata cache was successfully cleared'));
    }
}
exports.ClearCacheCommand = ClearCacheCommand;
