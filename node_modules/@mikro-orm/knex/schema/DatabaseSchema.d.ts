import { Configuration } from '@mikro-orm/core';
import { DatabaseTable } from './DatabaseTable';
import { SchemaHelper } from './SchemaHelper';
import { AbstractSqlConnection } from '../AbstractSqlConnection';
export declare class DatabaseSchema {
    private readonly tables;
    addTable(name: string, schema: string | undefined | null): DatabaseTable;
    getTables(): DatabaseTable[];
    getTable(name: string): DatabaseTable | undefined;
    static create(connection: AbstractSqlConnection, helper: SchemaHelper, config: Configuration): Promise<DatabaseSchema>;
}
