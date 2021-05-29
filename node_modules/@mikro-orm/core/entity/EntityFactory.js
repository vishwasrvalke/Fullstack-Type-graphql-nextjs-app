"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityFactory = void 0;
const Utils_1 = require("../utils/Utils");
const enums_1 = require("../enums");
class EntityFactory {
    constructor(unitOfWork, em) {
        this.unitOfWork = unitOfWork;
        this.em = em;
        this.driver = this.em.getDriver();
        this.platform = this.driver.getPlatform();
        this.config = this.em.config;
        this.metadata = this.em.getMetadata();
        this.hydrator = this.config.getHydrator(this.metadata);
        this.eventManager = this.em.getEventManager();
    }
    create(entityName, data, options = {}) {
        var _a;
        options.initialized = (_a = options.initialized) !== null && _a !== void 0 ? _a : true;
        if (data.__entity) {
            return data;
        }
        entityName = Utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        if (this.platform.usesDifferentSerializedPrimaryKey()) {
            meta.primaryKeys.forEach(pk => this.denormalizePrimaryKey(data, pk, meta.properties[pk]));
        }
        const meta2 = this.processDiscriminatorColumn(meta, data);
        const exists = this.findEntity(data, meta2, options.convertCustomTypes);
        if (exists && exists.__helper.__initialized && !options.refresh) {
            return exists;
        }
        data = Object.assign({}, data);
        const entity = exists !== null && exists !== void 0 ? exists : this.createEntity(data, meta2, options);
        entity.__helper.__initialized = options.initialized;
        this.hydrate(entity, meta2, data, options);
        if (options.merge && entity.__helper.hasPrimaryKey()) {
            this.unitOfWork.registerManaged(entity, data, options.refresh && options.initialized, options.newEntity);
        }
        if (this.eventManager.hasListeners(enums_1.EventType.onInit, meta2)) {
            this.eventManager.dispatchEvent(enums_1.EventType.onInit, { entity, em: this.em });
        }
        return entity;
    }
    createReference(entityName, id, options = {}) {
        var _a;
        options.convertCustomTypes = (_a = options.convertCustomTypes) !== null && _a !== void 0 ? _a : true;
        entityName = Utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        if (Array.isArray(id)) {
            id = Utils_1.Utils.getPrimaryKeyCondFromArray(id, meta.primaryKeys);
        }
        const pks = Utils_1.Utils.getOrderedPrimaryKeys(id, meta, this.platform, options.convertCustomTypes);
        if (Utils_1.Utils.isPrimaryKey(id)) {
            id = { [meta.primaryKeys[0]]: id };
        }
        const exists = this.unitOfWork.getById(entityName, pks);
        if (exists) {
            return exists;
        }
        return this.create(entityName, id, Object.assign(Object.assign({}, options), { initialized: false }));
    }
    createEntity(data, meta, options) {
        if (options.newEntity || meta.forceConstructor) {
            const params = this.extractConstructorParams(meta, data);
            const Entity = meta.class;
            meta.constructorParams.forEach(prop => delete data[prop]);
            // creates new instance via constructor as this is the new entity
            return new Entity(...params);
        }
        // creates new entity instance, bypassing constructor call as its already persisted entity
        const entity = Object.create(meta.class.prototype);
        entity.__helper.__managed = true;
        if (meta.selfReferencing && !options.newEntity) {
            this.hydrator.hydrateReference(entity, meta, data, this, options.convertCustomTypes);
            this.unitOfWork.registerManaged(entity);
        }
        return entity;
    }
    hydrate(entity, meta, data, options) {
        if (options.initialized) {
            this.hydrator.hydrate(entity, meta, data, this, 'full', options.newEntity, options.convertCustomTypes);
        }
        else {
            this.hydrator.hydrateReference(entity, meta, data, this, options.convertCustomTypes);
        }
    }
    findEntity(data, meta, convertCustomTypes) {
        if (!meta.compositePK && !meta.properties[meta.primaryKeys[0]].customType) {
            return this.unitOfWork.getById(meta.name, data[meta.primaryKeys[0]]);
        }
        if (meta.primaryKeys.some(pk => !Utils_1.Utils.isDefined(data[pk], true))) {
            return undefined;
        }
        const pks = Utils_1.Utils.getOrderedPrimaryKeys(data, meta, this.platform, convertCustomTypes);
        return this.unitOfWork.getById(meta.name, pks);
    }
    processDiscriminatorColumn(meta, data) {
        if (!meta.root.discriminatorColumn) {
            return meta;
        }
        const prop = meta.properties[meta.root.discriminatorColumn];
        const value = data[prop.name];
        const type = meta.root.discriminatorMap[value];
        meta = type ? this.metadata.find(type) : meta;
        // `prop.userDefined` is either `undefined` or `false`
        if (prop.userDefined === false) {
            delete data[prop.name];
        }
        return meta;
    }
    /**
     * denormalize PK to value required by driver (e.g. ObjectId)
     */
    denormalizePrimaryKey(data, primaryKey, prop) {
        const pk = this.platform.getSerializedPrimaryKeyField(primaryKey);
        if (Utils_1.Utils.isDefined(data[pk], true) || Utils_1.Utils.isDefined(data[primaryKey], true)) {
            let id = data[pk] || data[primaryKey];
            if (prop.type.toLowerCase() === 'objectid') {
                id = this.platform.denormalizePrimaryKey(id);
            }
            delete data[pk];
            data[primaryKey] = id;
        }
    }
    /**
     * returns parameters for entity constructor, creating references from plain ids
     */
    extractConstructorParams(meta, data) {
        return meta.constructorParams.map(k => {
            if (meta.properties[k] && [enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(meta.properties[k].reference) && data[k]) {
                const entity = this.unitOfWork.getById(meta.properties[k].type, data[k]);
                if (entity) {
                    return entity;
                }
                if (Utils_1.Utils.isEntity(data[k])) {
                    return data[k];
                }
                return this.createReference(meta.properties[k].type, data[k]);
            }
            if (!meta.properties[k]) {
                return data;
            }
            return data[k];
        });
    }
}
exports.EntityFactory = EntityFactory;
