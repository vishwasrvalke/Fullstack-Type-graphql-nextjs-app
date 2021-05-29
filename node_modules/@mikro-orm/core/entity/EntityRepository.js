"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepository = void 0;
class EntityRepository {
    constructor(_em, entityName) {
        this._em = _em;
        this.entityName = entityName;
    }
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     */
    persist(entity) {
        return this.em.persist(entity);
    }
    /**
     * Persists your entity immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.persist(e).flush()`.
     */
    async persistAndFlush(entity) {
        await this.em.persistAndFlush(entity);
    }
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `persist()`
     */
    persistLater(entity) {
        this.em.persistLater(entity);
    }
    /**
     * Finds first entity matching your `where` query.
     */
    async findOne(where, populate, orderBy) {
        return this.em.findOne(this.entityName, where, populate, orderBy);
    }
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    async findOneOrFail(where, populate, orderBy) {
        return this.em.findOneOrFail(this.entityName, where, populate, orderBy);
    }
    /**
     * Finds all entities matching your `where` query.
     */
    async find(where, populate, orderBy = {}, limit, offset) {
        return this.em.find(this.entityName, where, populate, orderBy, limit, offset);
    }
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    async findAndCount(where, populate, orderBy = {}, limit, offset) {
        return this.em.findAndCount(this.entityName, where, populate, orderBy, limit, offset);
    }
    /**
     * Finds all entities of given type.
     */
    async findAll(populate, orderBy, limit, offset) {
        return this.em.find(this.entityName, {}, populate, orderBy, limit, offset);
    }
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * To remove entities by condition, use `em.nativeDelete()`.
     */
    remove(entity) {
        return this.em.remove(entity);
    }
    /**
     * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.remove(e).flush()`
     */
    async removeAndFlush(entity) {
        await this.em.removeAndFlush(entity);
    }
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `remove()`
     */
    removeLater(entity) {
        this.em.removeLater(entity);
    }
    /**
     * Flushes all changes to objects that have been queued up to now to the database.
     * This effectively synchronizes the in-memory state of managed objects with the database.
     * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
     * not just entities registered via this particular repository.
     */
    async flush() {
        return this.em.flush();
    }
    /**
     * Fires native insert query. Calling this has no side effects on the context (identity map).
     */
    async nativeInsert(data) {
        return this.em.nativeInsert(this.entityName, data);
    }
    /**
     * Fires native update query. Calling this has no side effects on the context (identity map).
     */
    async nativeUpdate(where, data, options) {
        return this.em.nativeUpdate(this.entityName, where, data, options);
    }
    /**
     * Fires native delete query. Calling this has no side effects on the context (identity map).
     */
    async nativeDelete(where, options) {
        return this.em.nativeDelete(this.entityName, where, options);
    }
    /**
     * Maps raw database result to an entity and merges it to this EntityManager.
     */
    map(result) {
        return this.em.map(this.entityName, result);
    }
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference(id, wrapped = false) {
        return this.em.getReference(this.entityName, id, wrapped);
    }
    /**
     * Checks whether given property can be populated on the entity.
     */
    canPopulate(property) {
        return this.em.canPopulate(this.entityName, property);
    }
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    async populate(entities, populate, where = {}, orderBy = {}, refresh = false, validate = true) {
        return this.em.populate(entities, populate, where, orderBy, refresh, validate);
    }
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create(data) {
        return this.em.create(this.entityName, data);
    }
    /**
     * Shortcut for `wrap(entity).assign(data, { em })`
     */
    assign(entity, data) {
        return this.em.assign(entity, data);
    }
    /**
     * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
     * via second parameter. By default it will return already loaded entities without modifying them.
     */
    merge(data, refresh, convertCustomTypes) {
        return this.em.merge(this.entityName, data, refresh, convertCustomTypes);
    }
    /**
     * Returns total number of entities matching your `where` query.
     */
    async count(where = {}, options = {}) {
        return this.em.count(this.entityName, where, options);
    }
    get em() {
        return this._em.getContext();
    }
}
exports.EntityRepository = EntityRepository;
