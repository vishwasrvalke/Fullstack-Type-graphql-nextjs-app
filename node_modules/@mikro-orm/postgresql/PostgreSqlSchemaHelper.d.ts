import { Dictionary, EntityProperty } from '@mikro-orm/core';
import { AbstractSqlConnection, IsSame, SchemaHelper, Column, Index } from '@mikro-orm/knex';
export declare class PostgreSqlSchemaHelper extends SchemaHelper {
    static readonly TYPES: {
        boolean: string[];
        number: string[];
        string: string[];
        float: string[];
        double: string[];
        tinyint: string[];
        smallint: string[];
        text: string[];
        Date: string[];
        date: string[];
        object: string[];
        json: string[];
        uuid: string[];
        Buffer: string[];
        buffer: string[];
        enum: string[];
    };
    static readonly DEFAULT_TYPE_LENGTHS: {
        string: number;
        date: number;
    };
    static readonly DEFAULT_VALUES: {
        'now()': string[];
        'current_timestamp(?)': string[];
        "('now'::text)::timestamp(?) with time zone": string[];
        "('now'::text)::timestamp(?) without time zone": string[];
        'null::character varying': string[];
        'null::timestamp with time zone': string[];
        'null::timestamp without time zone': string[];
    };
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    getTypeDefinition(prop: EntityProperty): string;
    getTypeFromDefinition(type: string, defaultType: string): string;
    isSame(prop: EntityProperty, column: Column, idx?: number): IsSame;
    indexForeignKeys(): boolean;
    isImplicitIndex(name: string): boolean;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<any[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName: string): Promise<Index[]>;
    getForeignKeysSQL(tableName: string, schemaName?: string): string;
    getEnumDefinitions(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    normalizeDefaultValue(defaultValue: string, length: number): string | number;
    getDatabaseExistsSQL(name: string): string;
    getDatabaseNotExistsError(dbName: string): string;
    getManagementDbName(): string;
    private getIndexesSQL;
}
