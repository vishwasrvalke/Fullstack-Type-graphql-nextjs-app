"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const Reference_1 = require("./Reference");
const EntityAssigner_1 = require("./EntityAssigner");
class BaseEntity {
    constructor() {
        Object.defineProperty(this, '__baseEntity', { value: true });
    }
    isInitialized() {
        return this.__helper.__initialized;
    }
    populated(populated = true) {
        this.__helper.populated(populated);
    }
    toReference() {
        return Reference_1.Reference.create(this); // maintain the type from IWrappedEntity
    }
    toObject(ignoreFields = []) {
        return this.__helper.toObject(ignoreFields);
    }
    toJSON(...args) {
        return this.toObject(...args);
    }
    toPOJO() {
        return this.__helper.toPOJO();
    }
    assign(data, options) {
        return EntityAssigner_1.EntityAssigner.assign(this, data, options);
    }
    init(populated = true) {
        return this.__helper.init(populated);
    }
}
exports.BaseEntity = BaseEntity;
