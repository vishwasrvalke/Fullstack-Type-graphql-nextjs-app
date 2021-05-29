"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const CLIHelper_1 = require("../CLIHelper");
const core_1 = require("@mikro-orm/core");
class DebugCommand {
    constructor() {
        this.command = 'debug';
        this.describe = 'Debug CLI configuration';
    }
    /**
     * @inheritdoc
     */
    async handler() {
        CLIHelper_1.CLIHelper.dump(`Current ${ansi_colors_1.default.cyan('MikroORM')} CLI configuration`);
        await CLIHelper_1.CLIHelper.dumpDependencies();
        const settings = await core_1.ConfigurationLoader.getSettings();
        if (settings.useTsNode) {
            CLIHelper_1.CLIHelper.dump(' - ts-node ' + ansi_colors_1.default.green('enabled'));
        }
        const configPaths = await CLIHelper_1.CLIHelper.getConfigPaths();
        CLIHelper_1.CLIHelper.dump(' - searched config paths:');
        await DebugCommand.checkPaths(configPaths, 'yellow');
        try {
            const config = await CLIHelper_1.CLIHelper.getConfiguration();
            CLIHelper_1.CLIHelper.dump(` - configuration ${ansi_colors_1.default.green('found')}`);
            const tsNode = config.get('tsNode');
            if ([true, false].includes(tsNode)) {
                const warning = tsNode ? ' (this value should be set to `false` when running compiled code!)' : '';
                CLIHelper_1.CLIHelper.dump(` - \`tsNode\` flag explicitly set to ${tsNode}, will use \`entities${tsNode ? 'Ts' : ''}\` array${warning}`);
            }
            const entities = config.get('entities', []);
            if (entities.length > 0) {
                const refs = entities.filter(p => !core_1.Utils.isString(p));
                const paths = entities.filter(p => core_1.Utils.isString(p));
                const will = !config.get('tsNode') ? 'will' : 'could';
                CLIHelper_1.CLIHelper.dump(` - ${will} use \`entities\` array (contains ${refs.length} references and ${paths.length} paths)`);
                if (paths.length > 0) {
                    await DebugCommand.checkPaths(paths, 'red', config.get('baseDir'));
                }
            }
            const entitiesTs = config.get('entitiesTs', []);
            if (entitiesTs.length > 0) {
                const refs = entitiesTs.filter(p => !core_1.Utils.isString(p));
                const paths = entitiesTs.filter(p => core_1.Utils.isString(p));
                /* istanbul ignore next */
                const will = config.get('tsNode') ? 'will' : 'could';
                CLIHelper_1.CLIHelper.dump(` - ${will} use \`entitiesTs\` array (contains ${refs.length} references and ${paths.length} paths)`);
                /* istanbul ignore else */
                if (paths.length > 0) {
                    await DebugCommand.checkPaths(paths, 'red', config.get('baseDir'));
                }
            }
        }
        catch (e) {
            CLIHelper_1.CLIHelper.dump(`- configuration ${ansi_colors_1.default.red('not found')} ${ansi_colors_1.default.red(`(${e.message})`)}`);
        }
    }
    static async checkPaths(paths, failedColor, baseDir) {
        for (let path of paths) {
            path = core_1.Utils.absolutePath(path, baseDir);
            path = core_1.Utils.normalizePath(path);
            const found = await core_1.Utils.pathExists(path);
            if (found) {
                CLIHelper_1.CLIHelper.dump(`   - ${path} (${ansi_colors_1.default.green('found')})`);
            }
            else {
                CLIHelper_1.CLIHelper.dump(`   - ${path} (${ansi_colors_1.default[failedColor]('not found')})`);
            }
        }
    }
}
exports.DebugCommand = DebugCommand;
