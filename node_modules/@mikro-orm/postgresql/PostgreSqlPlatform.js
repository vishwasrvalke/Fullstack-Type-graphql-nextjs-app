"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSqlPlatform = void 0;
const pg_1 = require("pg");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const PostgreSqlSchemaHelper_1 = require("./PostgreSqlSchemaHelper");
const PostgreSqlExceptionConverter_1 = require("./PostgreSqlExceptionConverter");
class PostgreSqlPlatform extends knex_1.AbstractSqlPlatform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new PostgreSqlSchemaHelper_1.PostgreSqlSchemaHelper();
        this.exceptionConverter = new PostgreSqlExceptionConverter_1.PostgreSqlExceptionConverter();
    }
    usesReturningStatement() {
        return true;
    }
    usesCascadeStatement() {
        return true;
    }
    /**
     * Postgres will complain if we try to batch update uniquely constrained property (moving the value from one entity to another).
     * This flag will result in postponing 1:1 updates (removing them from the batched query).
     * @see https://stackoverflow.com/questions/5403437/atomic-multi-row-update-with-a-unique-constraint
     */
    allowsUniqueBatchUpdates() {
        return false;
    }
    getCurrentTimestampSQL(length) {
        return `current_timestamp(${length})`;
    }
    getTimeTypeDeclarationSQL() {
        return 'time(0)';
    }
    getRegExpOperator() {
        return '~';
    }
    isBigIntProperty(prop) {
        return super.isBigIntProperty(prop) || (prop.columnTypes && prop.columnTypes[0] === 'bigserial');
    }
    getArrayDeclarationSQL() {
        return 'text[]';
    }
    marshallArray(values) {
        return `{${values.join(',')}}`;
    }
    getBlobDeclarationSQL() {
        return 'bytea';
    }
    getJsonDeclarationSQL() {
        return 'jsonb';
    }
    getSearchJsonPropertyKey(path, type) {
        const first = path.shift();
        const last = path.pop();
        const root = this.quoteIdentifier(first);
        const types = {
            number: 'float8',
            boolean: 'bool',
        };
        const cast = (key) => type in types ? `(${key})::${types[type]}` : key;
        if (path.length === 0) {
            return cast(`${root}->>'${last}'`);
        }
        return cast(`${root}->${path.map(a => this.quoteValue(a)).join('->')}->>'${last}'`);
    }
    quoteIdentifier(id, quote = '"') {
        return `${quote}${id.replace('.', `${quote}.${quote}`)}${quote}`;
    }
    quoteValue(value) {
        /* istanbul ignore if */
        if (core_1.Utils.isPlainObject(value)) {
            value = JSON.stringify(value);
        }
        if (typeof value === 'string') {
            return pg_1.Client.prototype.escapeLiteral(value);
        }
        if (value instanceof Date) {
            return `'${value.toISOString()}'`;
        }
        if (ArrayBuffer.isView(value)) {
            return `E'\\\\x${value.toString('hex')}'`;
        }
        return super.quoteValue(value);
    }
}
exports.PostgreSqlPlatform = PostgreSqlPlatform;
