"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSchema = void 0;
const DatabaseTable_1 = require("./DatabaseTable");
class DatabaseSchema {
    constructor() {
        this.tables = [];
    }
    addTable(name, schema) {
        const table = new DatabaseTable_1.DatabaseTable(name, schema !== null && schema !== void 0 ? schema : undefined);
        this.tables.push(table);
        return table;
    }
    getTables() {
        return this.tables;
    }
    getTable(name) {
        return this.tables.find(t => t.name === name || `${t.schema}.${t.name}` === name);
    }
    static async create(connection, helper, config) {
        const schema = new DatabaseSchema();
        const tables = await connection.execute(helper.getListTablesSQL());
        for (const t of tables) {
            if (t.table_name === config.get('migrations').tableName) {
                continue;
            }
            const table = schema.addTable(t.table_name, t.schema_name);
            const cols = await helper.getColumns(connection, table.name, table.schema);
            const indexes = await helper.getIndexes(connection, table.name, table.schema);
            const pks = await helper.getPrimaryKeys(connection, indexes, table.name, table.schema);
            const fks = await helper.getForeignKeys(connection, table.name, table.schema);
            const enums = await helper.getEnumDefinitions(connection, table.name, table.schema);
            table.init(cols, indexes, pks, fks, enums);
        }
        return schema;
    }
}
exports.DatabaseSchema = DatabaseSchema;
