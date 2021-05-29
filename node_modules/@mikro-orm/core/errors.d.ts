import { AnyEntity, Constructor, Dictionary, EntityMetadata, EntityProperty, IPrimaryKey } from './typings';
export declare class ValidationError<T extends AnyEntity = AnyEntity> extends Error {
    private readonly entity?;
    constructor(message: string, entity?: T | undefined);
    /**
     * Gets instance of entity that caused this error.
     */
    getEntity(): AnyEntity | undefined;
    static fromWrongPropertyType(entity: AnyEntity, property: string, expectedType: string, givenType: string, givenValue: string): ValidationError;
    static fromCollectionNotInitialized(entity: AnyEntity, prop: EntityProperty): ValidationError;
    static fromMergeWithoutPK(meta: EntityMetadata): void;
    static transactionRequired(): ValidationError;
    static entityNotManaged(entity: AnyEntity): ValidationError;
    static notEntity(owner: AnyEntity, prop: EntityProperty, data: any): ValidationError;
    static notDiscoveredEntity(data: any, meta?: EntityMetadata): ValidationError;
    static invalidPropertyName(entityName: string, invalid: string): ValidationError;
    static invalidType(type: Constructor<any>, value: any, mode: string): ValidationError;
    static cannotModifyInverseCollection(owner: AnyEntity, property: EntityProperty): ValidationError;
    static cannotModifyReadonlyCollection(owner: AnyEntity, property: EntityProperty): ValidationError;
    static invalidCompositeIdentifier(meta: EntityMetadata): ValidationError;
    static cannotCommit(): ValidationError;
    static cannotUseOperatorsInsideEmbeddables(className: string, propName: string, payload: Dictionary): ValidationError;
    static invalidEmbeddableQuery(className: string, propName: string, embeddableType: string): ValidationError;
}
export declare class OptimisticLockError<T extends AnyEntity = AnyEntity> extends ValidationError<T> {
    static notVersioned(meta: EntityMetadata): OptimisticLockError;
    static lockFailed(entityOrName: AnyEntity | string): OptimisticLockError;
    static lockFailedVersionMismatch(entity: AnyEntity, expectedLockVersion: number | Date, actualLockVersion: number | Date): OptimisticLockError;
}
export declare class MetadataError<T extends AnyEntity = AnyEntity> extends ValidationError<T> {
    static fromMissingPrimaryKey(meta: EntityMetadata): MetadataError;
    static fromWrongReference(meta: EntityMetadata, prop: EntityProperty, key: keyof EntityProperty, owner?: EntityProperty): MetadataError;
    static fromWrongTypeDefinition(meta: EntityMetadata, prop: EntityProperty): MetadataError;
    static fromWrongOwnership(meta: EntityMetadata, prop: EntityProperty, key: keyof EntityProperty): MetadataError;
    static fromWrongReferenceType(meta: EntityMetadata, owner: EntityProperty, prop: EntityProperty): MetadataError;
    static entityNotFound(name: string, path: string): MetadataError;
    static unknownIndexProperty(meta: EntityMetadata, prop: string, type: string): MetadataError;
    static multipleVersionFields(meta: EntityMetadata, fields: string[]): MetadataError;
    static invalidVersionFieldType(meta: EntityMetadata): MetadataError;
    static fromUnknownEntity(className: string, source: string): MetadataError;
    static noEntityDiscovered(): MetadataError;
    static onlyAbstractEntitiesDiscovered(): MetadataError;
    static duplicateEntityDiscovered(paths: string[]): MetadataError;
    static multipleDecorators(entityName: string, propertyName: string): MetadataError;
    static missingMetadata(entity: string): MetadataError;
    static conflictingPropertyName(className: string, name: string, embeddedName: string): MetadataError;
    private static fromMessage;
}
export declare class NotFoundError<T extends AnyEntity = AnyEntity> extends ValidationError<T> {
    static findOneFailed(name: string, where: Dictionary | IPrimaryKey): NotFoundError;
}
