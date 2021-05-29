"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationStorage = void 0;
class MigrationStorage {
    constructor(driver, options) {
        this.driver = driver;
        this.options = options;
        this.connection = this.driver.getConnection();
        this.knex = this.connection.getKnex();
        this.helper = this.driver.getPlatform().getSchemaHelper();
    }
    async executed() {
        const migrations = await this.getExecutedMigrations();
        return migrations.map(row => row.name);
    }
    async logMigration(name) {
        await this.driver.nativeInsert(this.options.tableName, { name }, this.masterTransaction);
    }
    async unlogMigration(name) {
        await this.driver.nativeDelete(this.options.tableName, { name }, this.masterTransaction);
    }
    async getExecutedMigrations() {
        const qb = this.knex.select('*').from(this.options.tableName).orderBy('id', 'asc');
        if (this.masterTransaction) {
            qb.transacting(this.masterTransaction);
        }
        return this.connection.execute(qb);
    }
    async ensureTable() {
        const tables = await this.connection.execute(this.helper.getListTablesSQL(), [], 'all', this.masterTransaction);
        if (tables.find(t => t.table_name === this.options.tableName)) {
            return;
        }
        await this.knex.schema.createTable(this.options.tableName, table => {
            table.increments();
            table.string('name');
            table.dateTime('executed_at').defaultTo(this.knex.fn.now());
        });
    }
    setMasterMigration(trx) {
        this.masterTransaction = trx;
    }
    unsetMasterMigration() {
        delete this.masterTransaction;
    }
}
exports.MigrationStorage = MigrationStorage;
