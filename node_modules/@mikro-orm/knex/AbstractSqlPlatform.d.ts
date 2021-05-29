import { Constructor, EntityManager, EntityRepository, Platform } from '@mikro-orm/core';
import { SchemaHelper, SchemaGenerator } from './schema';
export declare abstract class AbstractSqlPlatform extends Platform {
    protected readonly schemaHelper?: SchemaHelper;
    usesPivotTable(): boolean;
    getRepositoryClass<T>(): Constructor<EntityRepository<T>>;
    getSchemaHelper(): SchemaHelper | undefined;
    getSchemaGenerator(em: EntityManager): SchemaGenerator;
    getEntityGenerator(em: EntityManager): any;
    getMigrator(em: EntityManager): any;
    quoteValue(value: any): string;
    formatQuery(sql: string, params: readonly any[]): string;
    getSearchJsonPropertySQL(path: string, type: string): string;
    cloneEmbeddable<T>(data: T): T;
    isRaw(value: any): boolean;
}
