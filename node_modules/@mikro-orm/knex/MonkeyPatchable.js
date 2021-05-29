"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonkeyPatchable = void 0;
// @ts-ignore
const mysql_1 = __importDefault(require("knex/lib/dialects/mysql"));
// @ts-ignore
const tablecompiler_1 = __importDefault(require("knex/lib/dialects/postgres/schema/tablecompiler"));
// @ts-ignore
const sqlite3_1 = __importDefault(require("knex/lib/dialects/sqlite3"));
// @ts-ignore
const tablecompiler_2 = __importDefault(require("knex/lib/schema/tablecompiler"));
// These specific portions of knex are overridden by the different
// database packages. We need to be sure the knex files they get to
// monkey patch are the same version as our overall knex instance
// which is why we need to import them in this package.
exports.MonkeyPatchable = {
    MySqlDialect: mysql_1.default,
    PostgresDialectTableCompiler: tablecompiler_1.default,
    Sqlite3Dialect: sqlite3_1.default,
    TableCompiler: tablecompiler_2.default,
};
