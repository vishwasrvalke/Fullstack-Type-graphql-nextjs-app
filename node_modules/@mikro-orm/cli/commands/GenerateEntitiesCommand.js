"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateEntitiesCommand = void 0;
const yargs_1 = __importDefault(require("yargs"));
const entity_generator_1 = require("@mikro-orm/entity-generator");
const CLIHelper_1 = require("../CLIHelper");
class GenerateEntitiesCommand {
    constructor() {
        this.command = 'generate-entities';
        this.describe = 'Generate entities based on current database schema';
    }
    /**
     * @inheritdoc
     */
    builder(args) {
        args.option('s', {
            alias: 'save',
            type: 'boolean',
            desc: 'Saves entities to directory defined by --path',
        });
        args.option('d', {
            alias: 'dump',
            type: 'boolean',
            desc: 'Dumps all entities to console',
        });
        args.option('p', {
            alias: 'path',
            type: 'string',
            desc: 'Sets path to directory where to save entities',
        });
        return args;
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        if (!args.save && !args.dump) {
            return void yargs_1.default.showHelp();
        }
        const orm = await CLIHelper_1.CLIHelper.getORM(false);
        const generator = new entity_generator_1.EntityGenerator(orm.em);
        const dump = await generator.generate({ save: args.save, baseDir: args.path });
        if (args.dump) {
            CLIHelper_1.CLIHelper.dump(dump.join('\n\n'));
        }
        await orm.close(true);
    }
}
exports.GenerateEntitiesCommand = GenerateEntitiesCommand;
