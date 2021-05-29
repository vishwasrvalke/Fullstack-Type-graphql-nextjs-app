"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaGenerator = void 0;
const core_1 = require("@mikro-orm/core");
const DatabaseSchema_1 = require("./DatabaseSchema");
class SchemaGenerator {
    constructor(em) {
        this.em = em;
        this.config = this.em.config;
        this.driver = this.em.getDriver();
        this.metadata = this.em.getMetadata();
        this.platform = this.driver.getPlatform();
        this.helper = this.platform.getSchemaHelper();
        this.connection = this.driver.getConnection();
        this.knex = this.connection.getKnex();
    }
    async generate() {
        const [dropSchema, createSchema] = await Promise.all([
            this.getDropSchemaSQL(false),
            this.getCreateSchemaSQL(false),
        ]);
        return this.wrapSchema(dropSchema + createSchema);
    }
    async createSchema(wrap = true) {
        await this.ensureDatabase();
        const sql = await this.getCreateSchemaSQL(wrap);
        await this.execute(sql);
    }
    async ensureDatabase() {
        const dbName = this.config.get('dbName');
        const exists = await this.helper.databaseExists(this.connection, dbName);
        if (!exists) {
            this.config.set('dbName', this.helper.getManagementDbName());
            await this.driver.reconnect();
            await this.createDatabase(dbName);
        }
    }
    async getCreateSchemaSQL(wrap = true) {
        const metadata = this.getOrderedMetadata();
        const createdColumns = [];
        let ret = '';
        for (const meta of metadata) {
            ret += this.dump(this.createTable(meta, createdColumns));
        }
        for (const meta of metadata) {
            ret += this.dump(this.knex.schema.alterTable(meta.collection, table => this.createForeignKeys(table, meta, undefined, createdColumns)));
        }
        for (const meta of metadata) {
            ret += this.dump(this.knex.schema.alterTable(meta.collection, table => {
                meta.indexes.forEach(index => this.createIndex(table, meta, index, false));
                meta.uniques.forEach(index => this.createIndex(table, meta, index, true));
            }));
        }
        return this.wrapSchema(ret, wrap);
    }
    async dropSchema(wrap = true, dropMigrationsTable = false, dropDb = false) {
        if (dropDb) {
            const name = this.config.get('dbName');
            return this.dropDatabase(name);
        }
        const sql = await this.getDropSchemaSQL(wrap, dropMigrationsTable);
        await this.execute(sql);
    }
    async getDropSchemaSQL(wrap = true, dropMigrationsTable = false) {
        const metadata = this.getOrderedMetadata().reverse();
        let ret = '';
        for (const meta of metadata) {
            ret += this.dump(this.dropTable(meta.collection), '\n');
        }
        if (dropMigrationsTable) {
            ret += this.dump(this.dropTable(this.config.get('migrations').tableName), '\n');
        }
        return this.wrapSchema(ret + '\n', wrap);
    }
    async updateSchema(wrap = true, safe = false, dropTables = true) {
        const sql = await this.getUpdateSchemaSQL(wrap, safe, dropTables);
        await this.execute(sql);
    }
    async getUpdateSchemaSQL(wrap = true, safe = false, dropTables = true) {
        const metadata = this.getOrderedMetadata();
        const schema = await DatabaseSchema_1.DatabaseSchema.create(this.connection, this.helper, this.config);
        const createdColumns = [];
        let ret = '';
        for (const meta of metadata) {
            ret += this.getUpdateTableSQL(meta, schema, safe, createdColumns);
        }
        for (const meta of metadata) {
            ret += this.getUpdateTableFKsSQL(meta, schema, createdColumns);
        }
        for (const meta of metadata) {
            ret += this.getUpdateTableIndexesSQL(meta, schema);
        }
        if (!dropTables || safe) {
            return this.wrapSchema(ret, wrap);
        }
        const definedTables = metadata.map(meta => meta.collection);
        const remove = schema.getTables().filter(table => !definedTables.includes(table.name) && !definedTables.includes(`${table.schema}.${table.name}`));
        for (const table of remove) {
            ret += this.dump(this.dropTable(table.name, table.schema));
        }
        return this.wrapSchema(ret, wrap);
    }
    /**
     * creates new database and connects to it
     */
    async createDatabase(name) {
        await this.driver.execute(this.helper.getCreateDatabaseSQL('' + this.knex.ref(name)));
        this.config.set('dbName', name);
        await this.driver.reconnect();
    }
    async dropDatabase(name) {
        this.config.set('dbName', this.helper.getManagementDbName());
        await this.driver.reconnect();
        await this.driver.execute(this.helper.getDropDatabaseSQL('' + this.knex.ref(name)));
    }
    async execute(sql) {
        const lines = sql.split('\n').filter(i => i.trim());
        for (const line of lines) {
            await this.driver.execute(line);
        }
    }
    getUpdateTableSQL(meta, schema, safe, createdColumns) {
        const table = schema.getTable(meta.collection);
        if (!table) {
            return this.dump(this.createTable(meta, createdColumns));
        }
        return this.updateTable(meta, table, safe, createdColumns).map(builder => this.dump(builder)).join('\n');
    }
    getUpdateTableFKsSQL(meta, schema, createdColumns) {
        const table = schema.getTable(meta.collection);
        if (!table) {
            return this.dump(this.knex.schema.alterTable(meta.collection, table => this.createForeignKeys(table, meta)));
        }
        const { create } = this.computeTableDifference(meta, table, true);
        if (create.length === 0) {
            return '';
        }
        return this.dump(this.knex.schema.alterTable(meta.collection, table => this.createForeignKeys(table, meta, create, createdColumns)));
    }
    getUpdateTableIndexesSQL(meta, schema) {
        const table = schema.getTable(meta.collection);
        if (!table) {
            return this.dump(this.knex.schema.alterTable(meta.collection, table => {
                meta.indexes.forEach(index => this.createIndex(table, meta, index, false));
                meta.uniques.forEach(index => this.createIndex(table, meta, index, true));
            }));
        }
        let ret = '';
        const { addIndex, dropIndex } = this.computeTableDifference(meta, table, true);
        dropIndex.forEach(index => {
            ret += this.dump(this.knex.schema.alterTable(meta.collection, table => {
                if (index.unique) {
                    table.dropUnique(index.columnNames, index.keyName);
                }
                else {
                    table.dropIndex(index.columnNames, index.keyName);
                }
            }));
        });
        addIndex.forEach(index => {
            ret += this.dump(this.knex.schema.alterTable(meta.collection, table => {
                if (index.unique) {
                    table.unique(index.columnNames, index.keyName);
                }
                else {
                    table.index(index.columnNames, index.keyName);
                }
            }));
        });
        return ret;
    }
    async wrapSchema(sql, wrap = true) {
        if (!wrap) {
            return sql;
        }
        let ret = this.helper.getSchemaBeginning(this.config.get('charset'));
        ret += sql;
        ret += this.helper.getSchemaEnd();
        return ret;
    }
    createTable(meta, createdColumns) {
        return this.knex.schema.createTable(meta.collection, table => {
            meta.props
                .filter(prop => this.shouldHaveColumn(meta, prop))
                .forEach(prop => {
                this.createTableColumn(table, meta, prop);
                createdColumns.push(`${meta.collection}.${prop.name}`);
            });
            if (meta.compositePK) {
                const constraintName = meta.collection.includes('.') ? meta.collection.split('.').pop() + '_pkey' : undefined;
                table.primary(core_1.Utils.flatten(meta.primaryKeys.map(prop => meta.properties[prop].fieldNames)), constraintName);
            }
            if (meta.comment) {
                table.comment(meta.comment);
            }
            this.helper.finalizeTable(table, this.config.get('charset'), this.config.get('collate'));
        });
    }
    createIndex(table, meta, index, unique) {
        const properties = core_1.Utils.flatten(core_1.Utils.asArray(index.properties).map(prop => meta.properties[prop].fieldNames));
        const name = core_1.Utils.isString(index.name) ? index.name : this.helper.getIndexName(meta.collection, properties, unique ? 'unique' : 'index');
        if (unique) {
            table.unique(properties, name);
        }
        else {
            table.index(properties, name, index.type);
        }
    }
    updateTable(meta, table, safe, createdColumns) {
        const { create, update, remove, rename } = this.computeTableDifference(meta, table, safe);
        if (create.length + update.length + remove.length + rename.length === 0) {
            return [];
        }
        const ret = [];
        for (const prop of rename) {
            ret.push(this.knex.schema.raw(this.helper.getRenameColumnSQL(table.name, prop.from, prop.to)));
        }
        ret.push(this.knex.schema.alterTable(meta.collection, t => {
            for (const prop of create) {
                this.createTableColumn(t, meta, prop, {});
                createdColumns.push(`${meta.collection}.${prop.name}`);
            }
            for (const col of update) {
                this.updateTableColumn(t, meta, col.prop, col.column, col.diff, createdColumns);
            }
            for (const column of remove) {
                this.dropTableColumn(t, column);
            }
        }));
        return ret;
    }
    computeTableDifference(meta, table, safe) {
        const props = meta.props.filter(prop => this.shouldHaveColumn(meta, prop, true));
        const columns = table.getColumns();
        const create = [];
        const update = [];
        const remove = columns.filter(col => !props.find(prop => prop.fieldNames.includes(col.name) || (prop.joinColumns || []).includes(col.name)));
        for (const prop of props) {
            this.computeColumnDifference(table, prop, create, update);
        }
        const rename = this.findRenamedColumns(create, remove);
        const ignore = [...remove, ...rename.filter(c => [core_1.ReferenceType.MANY_TO_ONE, core_1.ReferenceType.ONE_TO_ONE].includes(c.to.reference)).map(c => c.from)];
        const { addIndex, dropIndex } = this.findIndexDifference(meta, table, ignore);
        if (safe) {
            return { create, update, rename, remove: [], addIndex, dropIndex };
        }
        return { create, update, rename, remove, addIndex, dropIndex };
    }
    computeColumnDifference(table, prop, create, update, joinColumn, idx = 0) {
        if ([core_1.ReferenceType.MANY_TO_ONE, core_1.ReferenceType.ONE_TO_ONE].includes(prop.reference) && !joinColumn) {
            return prop.joinColumns.forEach((joinColumn, idx) => this.computeColumnDifference(table, prop, create, update, joinColumn, idx));
        }
        if (!joinColumn) {
            return prop.fieldNames.forEach((fieldName, idx) => this.computeColumnDifference(table, prop, create, update, fieldName, idx));
        }
        const column = table.getColumn(joinColumn);
        if (!column) {
            create.push(prop);
            return;
        }
        if (this.helper.supportsColumnAlter() && !this.helper.isSame(prop, column, idx).all) {
            const diff = this.helper.isSame(prop, column, idx);
            update.push({ prop, column, diff });
        }
    }
    dropTable(name, schema) {
        /* istanbul ignore next */
        let builder = this.knex.schema.dropTableIfExists(schema ? `${schema}.${name}` : name);
        if (this.platform.usesCascadeStatement()) {
            builder = this.knex.schema.raw(builder.toQuery() + ' cascade');
        }
        return builder;
    }
    shouldHaveColumn(meta, prop, update = false) {
        if (prop.persist === false || !prop.fieldNames) {
            return false;
        }
        if (meta.pivotTable || (core_1.ReferenceType.EMBEDDED && prop.object)) {
            return true;
        }
        if (prop.reference !== core_1.ReferenceType.SCALAR && !prop.primary && !this.helper.supportsSchemaConstraints() && !update) {
            return false;
        }
        const getRootProperty = (prop) => prop.embedded ? getRootProperty(meta.properties[prop.embedded[0]]) : prop;
        const rootProp = getRootProperty(prop);
        if (rootProp.reference === core_1.ReferenceType.EMBEDDED) {
            return prop === rootProp || !rootProp.object;
        }
        return [core_1.ReferenceType.SCALAR, core_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) || (prop.reference === core_1.ReferenceType.ONE_TO_ONE && prop.owner);
    }
    createTableColumn(table, meta, prop, alter) {
        if (prop.reference === core_1.ReferenceType.SCALAR || (prop.reference === core_1.ReferenceType.EMBEDDED && prop.object)) {
            return [this.createSimpleTableColumn(table, meta, prop, alter)];
        }
        const meta2 = this.metadata.get(prop.type);
        return meta2.primaryKeys.map((pk, idx) => {
            const col = table.specificType(prop.joinColumns[idx], meta2.properties[pk].columnTypes[0]);
            return this.configureColumn(meta, prop, col, prop.joinColumns[idx], meta2.properties[pk], alter);
        });
    }
    createSimpleTableColumn(table, meta, prop, alter) {
        if (prop.primary && !meta.compositePK && this.platform.isBigIntProperty(prop)) {
            return table.bigIncrements(prop.fieldNames[0]);
        }
        if (prop.primary && !meta.compositePK && prop.type === 'number') {
            return table.increments(prop.fieldNames[0]);
        }
        if (prop.enum && prop.items && prop.items.every(item => core_1.Utils.isString(item))) {
            const col = table.enum(prop.fieldNames[0], prop.items);
            return this.configureColumn(meta, prop, col, prop.fieldNames[0], undefined, alter);
        }
        const col = table.specificType(prop.fieldNames[0], prop.columnTypes[0]);
        return this.configureColumn(meta, prop, col, prop.fieldNames[0], undefined, alter);
    }
    updateTableColumn(table, meta, prop, column, diff, createdColumns) {
        const equalDefinition = diff.sameTypes && diff.sameDefault && diff.sameNullable;
        if (column.fk && !diff.sameIndex) {
            table.dropForeign([column.fk.columnName], column.fk.constraintName);
        }
        if (column.indexes.length > 0 && !diff.sameIndex) {
            table.dropIndex(column.indexes.map(index => index.columnName));
        }
        if (column.fk && !diff.sameIndex && equalDefinition) {
            return this.createForeignKey(table, meta, prop, createdColumns, diff);
        }
        this.createTableColumn(table, meta, prop, diff).map(col => col.alter());
    }
    dropTableColumn(table, column) {
        if (column.fk) {
            table.dropForeign([column.fk.columnName], column.fk.constraintName);
        }
        for (const index of column.indexes) {
            if (index.unique) {
                table.dropUnique([index.columnName], index.keyName);
            }
            else {
                table.dropIndex([index.columnName], index.keyName);
            }
        }
        table.dropColumn(column.name);
    }
    configureColumn(meta, prop, col, columnName, pkProp = prop, alter) {
        const nullable = (alter && this.platform.requiresNullableForAlteringColumn()) || prop.nullable;
        const sameNullable = alter && 'sameNullable' in alter && alter.sameNullable;
        const indexed = 'index' in prop ? prop.index : (![core_1.ReferenceType.SCALAR, core_1.ReferenceType.EMBEDDED].includes(prop.reference) && this.helper.indexForeignKeys());
        const index = indexed && !(alter === null || alter === void 0 ? void 0 : alter.sameIndex);
        const indexName = this.getIndexName(meta, prop, 'index', [columnName]);
        const uniqueName = this.getIndexName(meta, prop, 'unique', [columnName]);
        const sameDefault = alter && 'sameDefault' in alter ? alter.sameDefault : !prop.defaultRaw;
        const composite = prop.fieldNames.length > 1;
        core_1.Utils.runIfNotEmpty(() => col.nullable(), !sameNullable && nullable);
        core_1.Utils.runIfNotEmpty(() => col.notNullable(), !sameNullable && !nullable);
        core_1.Utils.runIfNotEmpty(() => col.primary(), prop.primary && !meta.compositePK);
        core_1.Utils.runIfNotEmpty(() => col.unsigned(), pkProp.unsigned);
        core_1.Utils.runIfNotEmpty(() => col.index(indexName), !composite && index);
        core_1.Utils.runIfNotEmpty(() => col.unique(uniqueName), !composite && prop.unique && (!prop.primary || meta.compositePK));
        core_1.Utils.runIfNotEmpty(() => col.defaultTo(prop.defaultRaw ? this.knex.raw(prop.defaultRaw) : null), !sameDefault);
        core_1.Utils.runIfNotEmpty(() => col.comment(prop.comment), prop.comment);
        return col;
    }
    getIndexName(meta, prop, type, columnNames) {
        const value = prop[type];
        if (core_1.Utils.isString(value)) {
            return value;
        }
        return this.helper.getIndexName(meta.collection, columnNames, type);
    }
    createForeignKeys(table, meta, props, createdColumns = []) {
        meta.relations
            .filter(prop => !props || props.includes(prop))
            .filter(prop => prop.reference === core_1.ReferenceType.MANY_TO_ONE || (prop.reference === core_1.ReferenceType.ONE_TO_ONE && prop.owner))
            .forEach(prop => this.createForeignKey(table, meta, prop, createdColumns));
    }
    createForeignKey(table, meta, prop, createdColumns, diff) {
        if (this.helper.supportsSchemaConstraints()) {
            this.createForeignKeyReference(table, prop, meta);
            return;
        }
        if (!meta.pivotTable && !createdColumns.includes(`${meta.collection}.${prop.name}`)) {
            /* istanbul ignore next */
            this.createTableColumn(table, meta, prop, diff !== null && diff !== void 0 ? diff : {});
            createdColumns.push(`${meta.collection}.${prop.name}`);
        }
        // knex does not allow adding new columns with FK in sqlite
        // @see https://github.com/knex/knex/issues/3351
        // const col = this.createSimpleTableColumn(table, meta, prop, true);
        // this.createForeignKeyReference(col, prop);
    }
    createForeignKeyReference(table, prop, meta) {
        const cascade = prop.cascade.includes(core_1.Cascade.REMOVE) || prop.cascade.includes(core_1.Cascade.ALL);
        const col = table.foreign(prop.fieldNames).references(prop.referencedColumnNames).inTable(prop.referencedTableName);
        if (prop.onDelete || cascade || prop.nullable) {
            col.onDelete(prop.onDelete || (cascade ? 'cascade' : 'set null'));
        }
        if (prop.onUpdateIntegrity || prop.cascade.includes(core_1.Cascade.PERSIST) || prop.cascade.includes(core_1.Cascade.ALL)) {
            col.onUpdate(prop.onUpdateIntegrity || 'cascade');
        }
        col.withKeyName(this.helper.getIndexName(meta.collection, prop.fieldNames, 'foreign'));
    }
    findRenamedColumns(create, remove) {
        const renamed = [];
        for (const prop of create) {
            for (const fieldName of prop.fieldNames) {
                const match = remove.find(column => {
                    if (renamed.some(item => item.from === column)) {
                        return false;
                    }
                    const copy = core_1.Utils.copy(column);
                    copy.name = fieldName;
                    return this.helper.isSame(prop, copy).all;
                });
                if (match) {
                    renamed.push({ from: match, to: prop });
                }
            }
        }
        renamed.forEach(prop => {
            create.splice(create.indexOf(prop.to), 1);
            remove.splice(remove.indexOf(prop.from), 1);
        });
        return renamed;
    }
    findIndexDifference(meta, table, remove) {
        const addIndex = [];
        const dropIndex = [];
        const expectedIndexes = new Set();
        const indexes = table.getIndexes();
        const existingIndexes = new Set(Object.keys(indexes));
        const idxName = (name, columns, type) => {
            return core_1.Utils.isString(name) ? name : this.helper.getIndexName(meta.collection, columns, type);
        };
        const expectIndex = (keyName, columnNames, unique, add) => {
            expectedIndexes.add(keyName);
            if (add && !existingIndexes.has(keyName)) {
                addIndex.push({ keyName, columnNames, unique });
            }
        };
        ['indexes', 'uniques'].forEach(type => {
            meta[type].forEach(index => {
                const properties = core_1.Utils.flatten(core_1.Utils.asArray(index.properties).map(prop => meta.properties[prop].fieldNames));
                const name = idxName(index.name, properties, type === 'uniques' ? 'unique' : 'index');
                expectIndex(name, properties, type === 'uniques', true);
            });
        });
        meta.props.forEach(prop => {
            if (prop.index) {
                const name = idxName(prop.index, prop.fieldNames, 'index');
                expectIndex(name, prop.fieldNames, false, prop.reference === core_1.ReferenceType.SCALAR);
            }
            if (prop.unique) {
                const name = idxName(prop.unique, prop.fieldNames, 'unique');
                expectIndex(name, prop.fieldNames, true, prop.reference === core_1.ReferenceType.SCALAR);
            }
            if ([core_1.ReferenceType.ONE_TO_ONE, core_1.ReferenceType.MANY_TO_ONE].includes(prop.reference)) {
                expectedIndexes.add(this.helper.getIndexName(meta.collection, prop.fieldNames, 'index'));
                expectedIndexes.add(this.helper.getIndexName(meta.collection, prop.fieldNames, 'foreign'));
            }
        });
        Object.entries(indexes).forEach(([name, index]) => {
            const willBeRemoved = remove.find(col => index.some(idx => idx.columnName === col.name));
            if (!expectedIndexes.has(name) && !this.helper.isImplicitIndex(name) && !willBeRemoved) {
                dropIndex.push({
                    keyName: name,
                    columnNames: index.map(i => i.columnName),
                    unique: index[0].unique,
                });
            }
        });
        return { addIndex, dropIndex };
    }
    getOrderedMetadata() {
        const metadata = Object.values(this.metadata.getAll()).filter(meta => {
            const isRootEntity = meta.root.className === meta.className;
            return isRootEntity && !meta.embeddable;
        });
        const calc = new core_1.CommitOrderCalculator();
        metadata.forEach(meta => calc.addNode(meta.root.className));
        let meta = metadata.pop();
        while (meta) {
            for (const prop of meta.props) {
                calc.discoverProperty(prop, meta.root.className);
            }
            meta = metadata.pop();
        }
        return calc.sort().map(cls => this.metadata.find(cls));
    }
    dump(builder, append = '\n\n') {
        const sql = builder.toQuery();
        return sql.length > 0 ? `${sql};${append}` : '';
    }
}
exports.SchemaGenerator = SchemaGenerator;
