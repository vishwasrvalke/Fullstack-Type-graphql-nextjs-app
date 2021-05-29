"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const entity_1 = require("../entity");
const naming_strategy_1 = require("../naming-strategy");
const ExceptionConverter_1 = require("./ExceptionConverter");
class Platform {
    constructor() {
        this.exceptionConverter = new ExceptionConverter_1.ExceptionConverter();
    }
    usesPivotTable() {
        return false;
    }
    supportsTransactions() {
        return true;
    }
    usesImplicitTransactions() {
        return true;
    }
    getNamingStrategy() {
        return naming_strategy_1.UnderscoreNamingStrategy;
    }
    usesReturningStatement() {
        return false;
    }
    usesCascadeStatement() {
        return false;
    }
    getSchemaHelper() {
        return undefined;
    }
    requiresNullableForAlteringColumn() {
        return false;
    }
    allowsMultiInsert() {
        return true;
    }
    /**
     * Whether or not the driver supports retuning list of created PKs back when multi-inserting
     */
    usesBatchInserts() {
        return true;
    }
    /**
     * Whether or not the driver supports updating many records at once
     */
    usesBatchUpdates() {
        return true;
    }
    usesDefaultKeyword() {
        return true;
    }
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey(data) {
        return data;
    }
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data) {
        return data;
    }
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field) {
        return field;
    }
    usesDifferentSerializedPrimaryKey() {
        return false;
    }
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length) {
        return 'current_timestamp' + (length ? `(${length})` : '');
    }
    getDateTypeDeclarationSQL(length) {
        return 'date' + (length ? `(${length})` : '');
    }
    getTimeTypeDeclarationSQL(length) {
        return 'time' + (length ? `(${length})` : '');
    }
    getRegExpOperator() {
        return 'regexp';
    }
    quoteVersionValue(value, prop) {
        return value;
    }
    requiresValuesKeyword() {
        return false;
    }
    allowsComparingTuples() {
        return true;
    }
    allowsUniqueBatchUpdates() {
        return true;
    }
    isBigIntProperty(prop) {
        return prop.columnTypes && prop.columnTypes[0] === 'bigint';
    }
    isRaw(value) {
        return typeof value === 'object' && value !== null && '__raw' in value;
    }
    getBigIntTypeDeclarationSQL() {
        return 'bigint';
    }
    getArrayDeclarationSQL() {
        return 'text';
    }
    marshallArray(values) {
        return values.join(',');
    }
    unmarshallArray(value) {
        if (value === '') {
            return [];
        }
        return value.split(',');
    }
    getBlobDeclarationSQL() {
        return 'blob';
    }
    getJsonDeclarationSQL() {
        return 'json';
    }
    getSearchJsonPropertySQL(path, type) {
        return path;
    }
    getSearchJsonPropertyKey(path, type) {
        return path.join('.');
    }
    convertsJsonAutomatically(marshall = false) {
        return !marshall;
    }
    getRepositoryClass() {
        return entity_1.EntityRepository;
    }
    getDefaultCharset() {
        return 'utf8';
    }
    getExceptionConverter() {
        return this.exceptionConverter;
    }
    getSchemaGenerator(em) {
        throw new Error(`${this.constructor.name} does not support SchemaGenerator`);
    }
    getEntityGenerator(em) {
        throw new Error(`${this.constructor.name} does not support EntityGenerator`);
    }
    getMigrator(em) {
        throw new Error(`${this.constructor.name} does not support Migrator`);
    }
    processDateProperty(value) {
        return value;
    }
    quoteIdentifier(id, quote = '`') {
        return `${quote}${id.replace('.', `${quote}.${quote}`)}${quote}`;
    }
    quoteValue(value) {
        return value;
    }
    cloneEmbeddable(data) {
        return JSON.parse(JSON.stringify(data));
    }
    setConfig(config) {
        this.config = config;
        if (this.config.get('forceUtcTimezone')) {
            this.timezone = 'Z';
        }
        else {
            this.timezone = this.config.get('timezone');
        }
    }
}
exports.Platform = Platform;
