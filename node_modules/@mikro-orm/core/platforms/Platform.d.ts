import { EntityRepository } from '../entity';
import { NamingStrategy } from '../naming-strategy';
import { Constructor, Dictionary, EntityProperty, IEntityGenerator, IMigrator, IPrimaryKey, ISchemaGenerator, Primary } from '../typings';
import { ExceptionConverter } from './ExceptionConverter';
import { EntityManager } from '../EntityManager';
import { Configuration } from '../utils/Configuration';
export declare abstract class Platform {
    protected readonly exceptionConverter: ExceptionConverter;
    protected config: Configuration;
    protected timezone?: string;
    usesPivotTable(): boolean;
    supportsTransactions(): boolean;
    usesImplicitTransactions(): boolean;
    getNamingStrategy(): {
        new (): NamingStrategy;
    };
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    getSchemaHelper(): {
        getTypeDefinition(prop: EntityProperty, types?: Dictionary<string[]>, lengths?: Dictionary<number>, allowZero?: boolean): string;
    } | undefined;
    requiresNullableForAlteringColumn(): boolean;
    allowsMultiInsert(): boolean;
    /**
     * Whether or not the driver supports retuning list of created PKs back when multi-inserting
     */
    usesBatchInserts(): boolean;
    /**
     * Whether or not the driver supports updating many records at once
     */
    usesBatchUpdates(): boolean;
    usesDefaultKeyword(): boolean;
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey<T extends number | string = number | string>(data: Primary<T> | IPrimaryKey): T;
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data: IPrimaryKey): IPrimaryKey;
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field: string): string;
    usesDifferentSerializedPrimaryKey(): boolean;
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length: number): string;
    getDateTypeDeclarationSQL(length: number): string;
    getTimeTypeDeclarationSQL(length: number): string;
    getRegExpOperator(): string;
    quoteVersionValue(value: Date | number, prop: EntityProperty): Date | string | number;
    requiresValuesKeyword(): boolean;
    allowsComparingTuples(): boolean;
    allowsUniqueBatchUpdates(): boolean;
    isBigIntProperty(prop: EntityProperty): boolean;
    isRaw(value: any): boolean;
    getBigIntTypeDeclarationSQL(): string;
    getArrayDeclarationSQL(): string;
    marshallArray(values: string[]): string;
    unmarshallArray(value: string): string[];
    getBlobDeclarationSQL(): string;
    getJsonDeclarationSQL(): string;
    getSearchJsonPropertySQL(path: string, type: string): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    convertsJsonAutomatically(marshall?: boolean): boolean;
    getRepositoryClass<T>(): Constructor<EntityRepository<T>>;
    getDefaultCharset(): string;
    getExceptionConverter(): ExceptionConverter;
    getSchemaGenerator(em: EntityManager): ISchemaGenerator;
    getEntityGenerator(em: EntityManager): IEntityGenerator;
    getMigrator(em: EntityManager): IMigrator;
    processDateProperty(value: unknown): string | number | Date;
    quoteIdentifier(id: string, quote?: string): string;
    quoteValue(value: any): string;
    cloneEmbeddable<T>(data: T): T;
    setConfig(config: Configuration): void;
}
