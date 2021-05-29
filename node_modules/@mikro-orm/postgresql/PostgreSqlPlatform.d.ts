import { EntityProperty } from '@mikro-orm/core';
import { AbstractSqlPlatform } from '@mikro-orm/knex';
import { PostgreSqlSchemaHelper } from './PostgreSqlSchemaHelper';
import { PostgreSqlExceptionConverter } from './PostgreSqlExceptionConverter';
export declare class PostgreSqlPlatform extends AbstractSqlPlatform {
    protected readonly schemaHelper: PostgreSqlSchemaHelper;
    protected readonly exceptionConverter: PostgreSqlExceptionConverter;
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    /**
     * Postgres will complain if we try to batch update uniquely constrained property (moving the value from one entity to another).
     * This flag will result in postponing 1:1 updates (removing them from the batched query).
     * @see https://stackoverflow.com/questions/5403437/atomic-multi-row-update-with-a-unique-constraint
     */
    allowsUniqueBatchUpdates(): boolean;
    getCurrentTimestampSQL(length: number): string;
    getTimeTypeDeclarationSQL(): string;
    getRegExpOperator(): string;
    isBigIntProperty(prop: EntityProperty): boolean;
    getArrayDeclarationSQL(): string;
    marshallArray(values: string[]): string;
    getBlobDeclarationSQL(): string;
    getJsonDeclarationSQL(): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    quoteIdentifier(id: string, quote?: string): string;
    quoteValue(value: any): string;
}
