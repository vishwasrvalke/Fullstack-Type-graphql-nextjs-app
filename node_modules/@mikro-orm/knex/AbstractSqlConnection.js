"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSqlConnection = void 0;
const knex_1 = __importStar(require("knex"));
const fs_extra_1 = require("fs-extra");
const core_1 = require("@mikro-orm/core");
const parentTransactionSymbol = Symbol('parentTransaction');
function isRootTransaction(trx) {
    return !Object.getOwnPropertySymbols(trx).includes(parentTransactionSymbol);
}
class AbstractSqlConnection extends core_1.Connection {
    constructor(config, options, type) {
        super(config, options, type);
        this.patchKnexClient();
    }
    getKnex() {
        return this.client;
    }
    async close(force) {
        await this.client.destroy();
    }
    async isConnected() {
        try {
            await this.client.raw('select 1');
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async transactional(cb, ctx, eventBroadcaster) {
        const trx = await this.begin(ctx, eventBroadcaster);
        try {
            const ret = await cb(trx);
            await this.commit(trx, eventBroadcaster);
            return ret;
        }
        catch (error) {
            await this.rollback(trx, eventBroadcaster);
            throw error;
        }
    }
    async begin(ctx, eventBroadcaster) {
        if (!ctx) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionStart));
        }
        const trx = await (ctx || this.client).transaction();
        if (!ctx) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionStart, trx));
        }
        else {
            trx[parentTransactionSymbol] = ctx;
        }
        return trx;
    }
    async commit(ctx, eventBroadcaster) {
        const runTrxHooks = isRootTransaction(ctx);
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionCommit, ctx));
        }
        ctx.commit();
        await ctx.executionPromise; // https://github.com/knex/knex/issues/3847#issuecomment-626330453
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionCommit, ctx));
        }
    }
    async rollback(ctx, eventBroadcaster) {
        const runTrxHooks = isRootTransaction(ctx);
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionRollback, ctx));
        }
        await ctx.rollback();
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionRollback, ctx));
        }
    }
    async execute(queryOrKnex, params = [], method = 'all', ctx) {
        if (core_1.Utils.isObject(queryOrKnex)) {
            ctx = ctx !== null && ctx !== void 0 ? ctx : (queryOrKnex.client.transacting ? queryOrKnex : null);
            const q = queryOrKnex.toSQL();
            queryOrKnex = q.sql;
            params = q.bindings;
        }
        const formatted = this.platform.formatQuery(queryOrKnex, params);
        const sql = this.getSql(queryOrKnex, formatted);
        const res = await this.executeQuery(sql, () => {
            const query = this.client.raw(formatted);
            if (ctx) {
                query.transacting(ctx);
            }
            return query;
        });
        return this.transformRawResult(res, method);
    }
    /**
     * Execute raw SQL queries from file
     */
    async loadFile(path) {
        const buf = await fs_extra_1.readFile(path);
        await this.client.raw(buf.toString());
    }
    logQuery(query, took) {
        super.logQuery(query, took);
    }
    createKnexClient(type) {
        return knex_1.default(this.getKnexOptions(type))
            .on('query', data => {
            if (!data.__knexQueryUid) {
                this.logQuery(data.sql.toLowerCase().replace(/;$/, ''));
            }
        });
    }
    getKnexOptions(type) {
        return core_1.Utils.merge({
            client: type,
            connection: this.getConnectionOptions(),
            pool: this.config.get('pool'),
        }, this.config.get('driverOptions'));
    }
    getSql(query, formatted) {
        const logger = this.config.getLogger();
        if (!logger.isEnabled('query')) {
            return query;
        }
        if (logger.isEnabled('query-params')) {
            return formatted;
        }
        return this.client.client.positionBindings(query);
    }
    /**
     * do not call `positionBindings` when there are no bindings - it was messing up with
     * already interpolated strings containing `?`, and escaping that was not enough to
     * support edge cases like `\\?` strings (as `positionBindings` was removing the `\\`)
     */
    patchKnexClient() {
        const query = knex_1.Client.prototype.query;
        /* istanbul ignore next */
        knex_1.Client.prototype.query = function (connection, obj) {
            var _a;
            if (typeof obj === 'string') {
                obj = { sql: obj };
            }
            if (((_a = obj.bindings) !== null && _a !== void 0 ? _a : []).length > 0) {
                return query.call(this, connection, obj);
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { __knexUid, __knexTxId } = connection;
            this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
            return this._query(connection, obj).catch((err) => {
                err.message = this._formatQuery(obj.sql, obj.bindings) + ' - ' + err.message;
                this.emit('query-error', err, Object.assign({ __knexUid, __knexTxId }, obj));
                throw err;
            });
        };
    }
}
exports.AbstractSqlConnection = AbstractSqlConnection;
