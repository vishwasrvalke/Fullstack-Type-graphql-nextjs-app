import { EntityManager } from '../EntityManager';
import { EntityData, EntityName, AnyEntity, Primary, Populate, Loaded, New, FilterQuery } from '../typings';
import { QueryOrderMap } from '../enums';
import { CountOptions, DeleteOptions, FindOneOptions, FindOneOrFailOptions, FindOptions, UpdateOptions } from '../drivers/IDatabaseDriver';
import { IdentifiedReference } from './Reference';
export declare class EntityRepository<T extends AnyEntity<T>> {
    protected readonly _em: EntityManager;
    protected readonly entityName: EntityName<T>;
    constructor(_em: EntityManager, entityName: EntityName<T>);
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     */
    persist(entity: AnyEntity | AnyEntity[]): EntityManager;
    /**
     * Persists your entity immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.persist(e).flush()`.
     */
    persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `persist()`
     */
    persistLater(entity: AnyEntity | AnyEntity[]): void;
    /**
     * Finds first entity matching your `where` query.
     */
    findOne<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap): Promise<Loaded<T, P> | null>;
    /**
     * Finds first entity matching your `where` query.
     */
    findOne<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: FindOneOptions<T, P>, orderBy?: QueryOrderMap): Promise<Loaded<T, P> | null>;
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    findOneOrFail<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap): Promise<Loaded<T, P>>;
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    findOneOrFail<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: FindOneOrFailOptions<T, P>, orderBy?: QueryOrderMap): Promise<Loaded<T, P>>;
    /**
     * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
     */
    find<P extends Populate<T> = any>(where: FilterQuery<T>, options?: FindOptions<T, P>): Promise<Loaded<T, P>[]>;
    /**
     * Finds all entities matching your `where` query.
     */
    find<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<Loaded<T, P>[]>;
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    findAndCount<P extends Populate<T> = any>(where: FilterQuery<T>, options?: FindOptions<T>): Promise<[Loaded<T, P>[], number]>;
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    findAndCount<P extends Populate<T> = any>(where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<[Loaded<T, P>[], number]>;
    /**
     * Finds all entities of given type. You can pass additional options via the `options` parameter.
     */
    findAll<P extends Populate<T> = any>(options?: FindOptions<T, P>): Promise<Loaded<T, P>[]>;
    /**
     * Finds all entities of given type.
     */
    findAll<P extends Populate<T> = any>(populate?: P, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<Loaded<T, P>[]>;
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * To remove entities by condition, use `em.nativeDelete()`.
     */
    remove(entity: AnyEntity): EntityManager;
    /**
     * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.remove(e).flush()`
     */
    removeAndFlush(entity: AnyEntity): Promise<void>;
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `remove()`
     */
    removeLater(entity: AnyEntity): void;
    /**
     * Flushes all changes to objects that have been queued up to now to the database.
     * This effectively synchronizes the in-memory state of managed objects with the database.
     * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
     * not just entities registered via this particular repository.
     */
    flush(): Promise<void>;
    /**
     * Fires native insert query. Calling this has no side effects on the context (identity map).
     */
    nativeInsert(data: EntityData<T>): Promise<Primary<T>>;
    /**
     * Fires native update query. Calling this has no side effects on the context (identity map).
     */
    nativeUpdate(where: FilterQuery<T>, data: EntityData<T>, options?: UpdateOptions<T>): Promise<number>;
    /**
     * Fires native delete query. Calling this has no side effects on the context (identity map).
     */
    nativeDelete(where: FilterQuery<T>, options?: DeleteOptions<T>): Promise<number>;
    /**
     * Maps raw database result to an entity and merges it to this EntityManager.
     */
    map(result: EntityData<T>): T;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<PK extends keyof T>(id: Primary<T>, wrapped: true): IdentifiedReference<T, PK>;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<PK extends keyof T = keyof T>(id: Primary<T>): T;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<PK extends keyof T = keyof T>(id: Primary<T>, wrapped: false): T;
    /**
     * Checks whether given property can be populated on the entity.
     */
    canPopulate(property: string): boolean;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<P extends string | keyof T | Populate<T>>(entities: T, populate: P, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<Loaded<T, P>>;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<P extends string | keyof T | Populate<T>>(entities: T[], populate: P, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<Loaded<T, P>[]>;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<P extends string | keyof T | Populate<T>>(entities: T | T[], populate: P, where?: FilterQuery<T>, orderBy?: QueryOrderMap, refresh?: boolean, validate?: boolean): Promise<Loaded<T, P> | Loaded<T, P>[]>;
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create<P extends Populate<T> = string[]>(data: EntityData<T>): New<T, P>;
    /**
     * Shortcut for `wrap(entity).assign(data, { em })`
     */
    assign(entity: T, data: EntityData<T>): T;
    /**
     * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
     * via second parameter. By default it will return already loaded entities without modifying them.
     */
    merge(data: T | EntityData<T>, refresh?: boolean, convertCustomTypes?: boolean): T;
    /**
     * Returns total number of entities matching your `where` query.
     */
    count(where?: FilterQuery<T>, options?: CountOptions<T>): Promise<number>;
    protected get em(): EntityManager;
}
