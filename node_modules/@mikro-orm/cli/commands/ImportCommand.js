"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const CLIHelper_1 = require("../CLIHelper");
class ImportCommand {
    constructor() {
        this.command = 'database:import <file>';
        this.describe = 'Imports the SQL file to the database';
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const orm = await CLIHelper_1.CLIHelper.getORM();
        await orm.em.getConnection().loadFile(args.file);
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green(`File ${args.file} successfully imported`));
        await orm.close(true);
    }
}
exports.ImportCommand = ImportCommand;
