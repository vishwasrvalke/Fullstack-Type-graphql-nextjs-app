import { SqlEntityManager } from '../SqlEntityManager';
export declare class SchemaGenerator {
    private readonly em;
    private readonly config;
    private readonly driver;
    private readonly metadata;
    private readonly platform;
    private readonly helper;
    private readonly connection;
    private readonly knex;
    constructor(em: SqlEntityManager);
    generate(): Promise<string>;
    createSchema(wrap?: boolean): Promise<void>;
    ensureDatabase(): Promise<void>;
    getCreateSchemaSQL(wrap?: boolean): Promise<string>;
    dropSchema(wrap?: boolean, dropMigrationsTable?: boolean, dropDb?: boolean): Promise<void>;
    getDropSchemaSQL(wrap?: boolean, dropMigrationsTable?: boolean): Promise<string>;
    updateSchema(wrap?: boolean, safe?: boolean, dropTables?: boolean): Promise<void>;
    getUpdateSchemaSQL(wrap?: boolean, safe?: boolean, dropTables?: boolean): Promise<string>;
    /**
     * creates new database and connects to it
     */
    createDatabase(name: string): Promise<void>;
    dropDatabase(name: string): Promise<void>;
    execute(sql: string): Promise<void>;
    private getUpdateTableSQL;
    private getUpdateTableFKsSQL;
    private getUpdateTableIndexesSQL;
    private wrapSchema;
    private createTable;
    private createIndex;
    private updateTable;
    private computeTableDifference;
    private computeColumnDifference;
    private dropTable;
    private shouldHaveColumn;
    private createTableColumn;
    private createSimpleTableColumn;
    private updateTableColumn;
    private dropTableColumn;
    private configureColumn;
    private getIndexName;
    private createForeignKeys;
    private createForeignKey;
    private createForeignKeyReference;
    private findRenamedColumns;
    private findIndexDifference;
    private getOrderedMetadata;
    private dump;
}
