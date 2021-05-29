"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTransformer = exports.SerializationContext = void 0;
const wrap_1 = require("./wrap");
const Utils_1 = require("../utils/Utils");
/**
 * Helper that allows to keep track of where we are currently at when serializing complex entity graph with cycles.
 * Before we process a property, we call `visit` that checks if it is not a cycle path (but allows to pass cycles that
 * are defined in populate hint). If not, we proceed and call `leave` afterwards.
 */
class SerializationContext {
    constructor(populate) {
        this.populate = populate;
        this.path = [];
    }
    visit(entityName, prop) {
        if (!this.path.find(([cls, item]) => entityName === cls && prop === item)) {
            this.path.push([entityName, prop]);
            return false;
        }
        // check if the path is explicitly populated
        if (!this.isMarkedAsPopulated(prop)) {
            return true;
        }
        this.path.push([entityName, prop]);
        return false;
    }
    leave(entityName, prop) {
        const last = this.path.pop();
        /* istanbul ignore next */
        if (!last || last[0] !== entityName || last[1] !== prop) {
            throw new Error(`Trying to leave wrong property: ${entityName}.${prop} instead of ${last}`);
        }
    }
    /**
     * When initializing new context, we need to propagate it to the whole entity graph recursively.
     */
    static propagate(root, entity) {
        entity.__helper.__serializationContext.root = root;
        const items = [];
        Object.keys(entity).forEach(key => {
            if (Utils_1.Utils.isEntity(entity[key], true)) {
                items.push(entity[key]);
            }
            else if (Utils_1.Utils.isCollection(entity[key])) {
                items.push(...entity[key].getItems(false));
            }
        });
        items
            .filter(item => !item.__helper.__serializationContext.root)
            .forEach(item => this.propagate(root, item));
    }
    isMarkedAsPopulated(prop) {
        let populate = this.populate;
        for (const segment of this.path) {
            if (!populate) {
                return false;
            }
            const exists = populate.find(p => p.field === segment[1]);
            if (exists) {
                populate = exists.children;
            }
        }
        return !!(populate === null || populate === void 0 ? void 0 : populate.find(p => p.field === prop));
    }
}
exports.SerializationContext = SerializationContext;
class EntityTransformer {
    static toObject(entity, ignoreFields = [], raw = false) {
        var _a;
        const wrapped = entity.__helper;
        let contextCreated = false;
        if (!wrapped.__serializationContext.root) {
            const root = new SerializationContext((_a = wrapped.__serializationContext.populate) !== null && _a !== void 0 ? _a : []);
            SerializationContext.propagate(root, entity);
            contextCreated = true;
        }
        const root = wrapped.__serializationContext.root;
        const meta = entity.__meta;
        const ret = {};
        meta.primaryKeys
            .filter(pk => !Utils_1.Utils.isDefined(entity[pk], true) || !(meta.properties[pk].hidden || ignoreFields.includes(pk)))
            .map(pk => {
            let value;
            if (meta.properties[pk].serializer) {
                value = meta.properties[pk].serializer(entity[pk]);
            }
            else if (Utils_1.Utils.isEntity(entity[pk], true)) {
                value = EntityTransformer.processEntity(pk, entity, entity.__platform, raw);
            }
            else {
                value = entity.__platform.normalizePrimaryKey(entity[pk]);
            }
            return [pk, value];
        })
            .forEach(([pk, value]) => ret[this.propertyName(meta, pk, entity.__platform)] = value);
        if (!wrapped.isInitialized() && wrapped.hasPrimaryKey()) {
            return ret;
        }
        // normal properties
        Object.keys(entity)
            .filter(prop => this.isVisible(meta, prop, ignoreFields))
            .map(prop => {
            const cycle = root.visit(meta.className, prop);
            if (cycle) {
                return [prop, undefined];
            }
            const val = EntityTransformer.processProperty(prop, entity, raw);
            root.leave(meta.className, prop);
            return [prop, val];
        })
            .filter(([, value]) => typeof value !== 'undefined')
            .forEach(([prop, value]) => ret[this.propertyName(meta, prop)] = value);
        // decorated getters
        meta.props
            .filter(prop => prop.getter && !prop.hidden && typeof entity[prop.name] !== 'undefined')
            .forEach(prop => ret[this.propertyName(meta, prop.name)] = entity[prop.name]);
        // decorated get methods
        meta.props
            .filter(prop => prop.getterName && !prop.hidden && entity[prop.getterName] instanceof Function)
            .forEach(prop => ret[this.propertyName(meta, prop.name)] = entity[prop.getterName]());
        if (contextCreated) {
            delete wrapped.__serializationContext.root;
        }
        return ret;
    }
    static isVisible(meta, prop, ignoreFields) {
        const visible = meta.properties[prop] && !meta.properties[prop].hidden;
        return visible && !meta.primaryKeys.includes(prop) && !prop.startsWith('_') && !ignoreFields.includes(prop);
    }
    static propertyName(meta, prop, platform) {
        if (meta.properties[prop].serializedName) {
            return meta.properties[prop].serializedName;
        }
        if (meta.properties[prop].primary && platform) {
            return platform.getSerializedPrimaryKeyField(prop);
        }
        return prop;
    }
    static processProperty(prop, entity, raw) {
        const property = entity.__meta.properties[prop];
        /* istanbul ignore next */
        const serializer = property === null || property === void 0 ? void 0 : property.serializer;
        if (serializer) {
            return serializer(entity[prop]);
        }
        if (Utils_1.Utils.isCollection(entity[prop])) {
            return EntityTransformer.processCollection(prop, entity, raw);
        }
        /* istanbul ignore next */
        const customType = property === null || property === void 0 ? void 0 : property.customType;
        if (customType) {
            return customType.toJSON(entity[prop], entity.__platform);
        }
        if (Utils_1.Utils.isEntity(entity[prop], true)) {
            return EntityTransformer.processEntity(prop, entity, entity.__platform, raw);
        }
        return entity[prop];
    }
    static processEntity(prop, entity, platform, raw) {
        const child = entity[prop];
        const wrapped = child.__helper;
        if (raw && wrapped.isInitialized() && child !== entity) {
            return wrapped.toPOJO();
        }
        if (wrapped.isInitialized() && wrapped.__populated && child !== entity && !wrapped.__lazyInitialized) {
            const args = [...wrapped.__meta.toJsonParams.map(() => undefined)];
            return wrap_1.wrap(child).toJSON(...args);
        }
        return platform.normalizePrimaryKey(wrapped.getPrimaryKey());
    }
    static processCollection(prop, entity, raw) {
        const col = entity[prop];
        if (raw && col.isInitialized(true)) {
            return col.getItems().map(item => wrap_1.wrap(item).toPOJO());
        }
        if (col.isInitialized(true) && col.shouldPopulate()) {
            return col.toArray();
        }
        if (col.isInitialized()) {
            return col.getIdentifiers();
        }
    }
}
exports.EntityTransformer = EntityTransformer;
