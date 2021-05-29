"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaHelper = void 0;
const core_1 = require("@mikro-orm/core");
class SchemaHelper {
    getSchemaBeginning(charset) {
        return '';
    }
    getSchemaEnd() {
        return '';
    }
    finalizeTable(table, charset, collate) {
        //
    }
    getTypeDefinition(prop, types = {}, lengths = {}, allowZero = false) {
        var _a;
        let t = prop.type.toLowerCase();
        if (prop.enum) {
            t = ((_a = prop.items) === null || _a === void 0 ? void 0 : _a.every(item => core_1.Utils.isString(item))) ? 'enum' : 'tinyint';
        }
        let type = (types[t] || types.json || types.text || [t])[0];
        if (type.includes('(?)')) {
            type = this.processTypeWildCard(prop, lengths, t, allowZero, type);
        }
        return type;
    }
    isSame(prop, column, idx = 0, types = {}, defaultValues = {}) {
        const sameTypes = this.hasSameType(prop.columnTypes[idx], column.type, types);
        const sameEnums = this.hasSameEnumDefinition(prop, column);
        const sameNullable = column.nullable === !!prop.nullable;
        const sameDefault = this.hasSameDefaultValue(column, prop, defaultValues);
        const sameIndex = this.hasSameIndex(prop, column);
        const all = sameTypes && sameNullable && sameDefault && sameIndex && sameEnums;
        return { all, sameTypes, sameEnums, sameNullable, sameDefault, sameIndex };
    }
    supportsSchemaConstraints() {
        return true;
    }
    indexForeignKeys() {
        return true;
    }
    /**
     * Implicit indexes will be ignored when diffing
     */
    isImplicitIndex(name) {
        return false;
    }
    getTypeFromDefinition(type, defaultType, types) {
        type = type.replace(/\(.+\)/, '');
        const found = Object.entries(types)
            .filter(([, tt]) => tt.find(ttt => ttt.replace(/\(.+\)/, '') === type))
            .map(([t]) => t)[0];
        return found || defaultType;
    }
    async getPrimaryKeys(connection, indexes, tableName, schemaName) {
        return indexes.filter(i => i.primary).map(i => i.columnName);
    }
    async getForeignKeys(connection, tableName, schemaName) {
        const fks = await connection.execute(this.getForeignKeysSQL(tableName, schemaName));
        return this.mapForeignKeys(fks);
    }
    async getEnumDefinitions(connection, tableName, schemaName) {
        return {};
    }
    getListTablesSQL() {
        throw new Error('Not supported by given driver');
    }
    getRenameColumnSQL(tableName, from, to, idx = 0, quote = '"') {
        return `alter table ${quote}${tableName}${quote} rename column ${quote}${from.name}${quote} to ${quote}${to.fieldNames[0]}${quote}`;
    }
    async getColumns(connection, tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    async getIndexes(connection, tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    getForeignKeysSQL(tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    /**
     * Returns the default name of index for the given columns
     */
    getIndexName(tableName, columns, type) {
        if (tableName.includes('.')) {
            tableName = tableName.substr(tableName.indexOf('.') + 1);
        }
        return `${tableName}_${columns.join('_')}_${type}`;
    }
    mapForeignKeys(fks) {
        return fks.reduce((ret, fk) => {
            ret[fk.column_name] = {
                columnName: fk.column_name,
                constraintName: fk.constraint_name,
                referencedTableName: fk.referenced_table_name,
                referencedColumnName: fk.referenced_column_name,
                updateRule: fk.update_rule,
                deleteRule: fk.delete_rule,
            };
            return ret;
        }, {});
    }
    processTypeWildCard(prop, lengths, propType, allowZero, type) {
        let length = prop.length || lengths[propType];
        if (allowZero) {
            length = '' + length;
        }
        type = length ? type.replace('?', length) : type.replace('(?)', '');
        return type;
    }
    supportsColumnAlter() {
        return true;
    }
    normalizeDefaultValue(defaultValue, length, defaultValues = {}) {
        const genericValue = defaultValue.replace(/\(\d+\)/, '(?)').toLowerCase();
        const norm = defaultValues[genericValue];
        if (!norm) {
            return defaultValue;
        }
        return norm[0].replace('(?)', `(${length})`);
    }
    getCreateDatabaseSQL(name) {
        return `create database ${name}`;
    }
    getDropDatabaseSQL(name) {
        return `drop database if exists ${name}`;
    }
    getDatabaseExistsSQL(name) {
        return `select 1 from information_schema.schemata where schema_name = '${name}'`;
    }
    getDatabaseNotExistsError(dbName) {
        return `Unknown database '${dbName}'`;
    }
    getManagementDbName() {
        return 'information_schema';
    }
    getDefaultEmptyString() {
        return "''";
    }
    async databaseExists(connection, name) {
        try {
            const res = await connection.execute(this.getDatabaseExistsSQL(name));
            return res.length > 0;
        }
        catch (e) {
            if (e.message.includes(this.getDatabaseNotExistsError(name))) {
                return false;
            }
            throw e;
        }
    }
    hasSameType(columnType, infoType, types) {
        columnType = columnType.replace(/\([,?\d]+\)/, '').toLowerCase();
        infoType = infoType.replace(/\([,?\d]+\)/, '').toLowerCase();
        if (columnType === infoType) {
            return true;
        }
        const type = Object.values(types).find(t => t.some(tt => tt.replace(/\([,?\d]+\)/, '').toLowerCase() === infoType));
        if (!type) {
            return false;
        }
        const propTypes = type.map(t => t.replace(/\([,?\d]+\)/, '').toLowerCase());
        return propTypes.includes(columnType);
    }
    hasSameDefaultValue(info, prop, defaultValues) {
        if (info.defaultValue === null || info.defaultValue.toString().toLowerCase() === 'null' || info.defaultValue.toString().startsWith('nextval(')) {
            return !core_1.Utils.isDefined(prop.defaultRaw, true) || prop.defaultRaw.toLowerCase() === 'null';
        }
        if (prop.type === 'boolean') {
            const defaultValue = !['0', 'false', 'f', 'n', 'no', 'off'].includes(info.defaultValue);
            return '' + defaultValue === prop.defaultRaw;
        }
        if (info.defaultValue && prop.defaultRaw) {
            const defaultValue = info.defaultValue.toString().replace(/\([?\d]+\)/, '').toLowerCase();
            const propDefault = prop.defaultRaw.toString().toLowerCase();
            const same = propDefault === info.defaultValue.toString().toLowerCase();
            const equal = same || propDefault === defaultValue;
            return equal || Object.keys(defaultValues).map(t => t.replace(/\([?\d]+\)/, '').toLowerCase()).includes(defaultValue);
        }
        if (['', this.getDefaultEmptyString()].includes(prop.defaultRaw)) {
            return ['', this.getDefaultEmptyString()].includes(info.defaultValue.toString());
        }
        // eslint-disable-next-line eqeqeq
        return info.defaultValue == prop.defaultRaw; // == intentionally
    }
    hasSameIndex(prop, column) {
        if ([core_1.ReferenceType.SCALAR, core_1.ReferenceType.EMBEDDED].includes(prop.reference)) {
            return true;
        }
        return prop.referencedColumnNames.some(referencedColumnName => {
            return !!column.fk && referencedColumnName === column.fk.referencedColumnName && prop.referencedTableName === column.fk.referencedTableName;
        });
    }
    hasSameEnumDefinition(prop, column) {
        if (!prop.enum || !prop.items) {
            return true;
        }
        if (prop.items.every(item => typeof item === 'number')) {
            return true;
        }
        return core_1.Utils.equals(prop.items, column.enumItems);
    }
}
exports.SchemaHelper = SchemaHelper;
