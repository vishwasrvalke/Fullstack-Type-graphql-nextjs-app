"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const url_1 = require("url");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const utils_1 = require("../utils");
class Connection {
    constructor(config, options, type = 'write') {
        this.config = config;
        this.options = options;
        this.type = type;
        if (!this.options) {
            const props = ['dbName', 'clientUrl', 'host', 'port', 'user', 'password', 'multipleStatements', 'pool'];
            this.options = props.reduce((o, i) => { o[i] = this.config.get(i); return o; }, {});
        }
    }
    async transactional(cb, ctx, eventBroadcaster) {
        throw new Error(`Transactions are not supported by current driver`);
    }
    async begin(ctx, eventBroadcaster) {
        throw new Error(`Transactions are not supported by current driver`);
    }
    async commit(ctx, eventBroadcaster) {
        throw new Error(`Transactions are not supported by current driver`);
    }
    async rollback(ctx, eventBroadcaster) {
        throw new Error(`Transactions are not supported by current driver`);
    }
    getConnectionOptions() {
        const ret = {};
        const url = new url_1.URL(this.options.clientUrl || this.config.getClientUrl());
        this.options.host = ret.host = this.config.get('host', url.hostname);
        this.options.port = ret.port = this.config.get('port', +url.port);
        this.options.user = ret.user = this.config.get('user', url.username);
        this.options.password = ret.password = this.config.get('password', url.password);
        this.options.dbName = ret.database = this.config.get('dbName', url.pathname.replace(/^\//, ''));
        return ret;
    }
    getClientUrl() {
        const options = this.getConnectionOptions();
        const url = new url_1.URL(this.config.getClientUrl(true));
        return `${url.protocol}//${options.user}${options.password ? ':*****' : ''}@${options.host}:${options.port}`;
    }
    setMetadata(metadata) {
        this.metadata = metadata;
    }
    setPlatform(platform) {
        this.platform = platform;
    }
    async executeQuery(query, cb) {
        const now = Date.now();
        try {
            const res = await cb();
            this.logQuery(query, Date.now() - now);
            return res;
        }
        catch (e) {
            this.logQuery(ansi_colors_1.default.red(query), Date.now() - now);
            throw e;
        }
    }
    logQuery(query, took) {
        const logger = this.config.getLogger();
        // We only actually log something when debugMode is enabled. If it's not enabled,
        // we can jump out here as a performance optimization and save ourselves some cycles
        // preparing a message that won't get used.
        if (!logger.isEnabled('query')) {
            return;
        }
        query = this.config.get('highlighter').highlight(query);
        let msg = query + (utils_1.Utils.isDefined(took) ? ansi_colors_1.default.grey(` [took ${took} ms]`) : '');
        if (this.config.get('replicas', []).length > 0) {
            msg += ansi_colors_1.default.cyan(` (via ${this.type} connection '${this.options.name || this.config.get('name') || this.options.host}')`);
        }
        logger.log('query', msg);
    }
}
exports.Connection = Connection;
