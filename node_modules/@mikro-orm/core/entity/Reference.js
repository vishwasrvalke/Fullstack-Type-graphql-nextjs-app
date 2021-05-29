"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
const wrap_1 = require("./wrap");
class Reference {
    constructor(entity) {
        this.entity = entity;
        this.set(entity);
        const meta = this.entity.__meta;
        Object.defineProperty(this, '__reference', { value: true });
        meta.primaryKeys.forEach(primaryKey => {
            Object.defineProperty(this, primaryKey, {
                get() {
                    return this.entity[primaryKey];
                },
            });
        });
        if (meta.serializedPrimaryKey && meta.primaryKeys[0] !== meta.serializedPrimaryKey) {
            Object.defineProperty(this, meta.serializedPrimaryKey, {
                get() {
                    return this.entity.__helper.getSerializedPrimaryKey();
                },
            });
        }
    }
    static create(entity) {
        if (Reference.isReference(entity)) {
            return entity;
        }
        return new Reference(entity);
    }
    /**
     * Checks whether the argument is instance or `Reference` wrapper.
     */
    static isReference(data) {
        return data && !!data.__reference;
    }
    /**
     * Wraps the entity in a `Reference` wrapper if the property is defined as `wrappedReference`.
     */
    static wrapReference(entity, prop) {
        if (entity && prop.wrappedReference && !Reference.isReference(entity)) {
            return Reference.create(entity);
        }
        return entity;
    }
    /**
     * Returns wrapped entity.
     */
    static unwrapReference(ref) {
        return Reference.isReference(ref) ? ref.unwrap() : ref;
    }
    /**
     * Ensures the underlying entity is loaded first (without reloading it if it already is loaded).
     * Returns either the whole entity, or the requested property.
     */
    async load(prop) {
        if (!this.isInitialized()) {
            await this.entity.__helper.init();
        }
        if (prop) {
            return this.entity[prop];
        }
        return this.entity;
    }
    set(entity) {
        if (entity instanceof Reference) {
            entity = entity.unwrap();
        }
        this.entity = entity;
        Object.defineProperty(this, '__meta', { value: this.entity.__meta, writable: true });
        Object.defineProperty(this, '__platform', { value: this.entity.__platform, writable: true });
        Object.defineProperty(this, '__helper', { value: this.entity.__helper, writable: true });
        Object.defineProperty(this, '$', { value: this.entity, writable: true });
        Object.defineProperty(this, 'get', { value: () => this.entity, writable: true });
    }
    unwrap() {
        return this.entity;
    }
    getEntity() {
        if (!this.isInitialized()) {
            throw new Error(`Reference<${this.entity.__meta.name}> ${this.entity.__helper.getPrimaryKey()} not initialized`);
        }
        return this.entity;
    }
    getProperty(prop) {
        return this.getEntity()[prop];
    }
    isInitialized() {
        return this.entity.__helper.__initialized;
    }
    populated(populated) {
        this.entity.__helper.populated(populated);
    }
    toJSON(...args) {
        return wrap_1.wrap(this.entity).toJSON(...args);
    }
}
exports.Reference = Reference;
