"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriteriaNode = void 0;
const util_1 = require("util");
const core_1 = require("@mikro-orm/core");
/**
 * Helper for working with deeply nested where/orderBy/having criteria. Uses composite pattern to build tree from the payload.
 * Auto-joins relations and converts payload from { books: { publisher: { name: '...' } } } to { 'publisher_alias.name': '...' }
 */
class CriteriaNode {
    constructor(metadata, entityName, parent, key, validate = true) {
        this.metadata = metadata;
        this.entityName = entityName;
        this.parent = parent;
        this.key = key;
        const meta = parent && metadata.find(parent.entityName);
        if (meta && key) {
            core_1.Utils.splitPrimaryKeys(key).forEach(k => {
                this.prop = meta.props.find(prop => prop.name === k || (prop.fieldNames || []).includes(k));
                if (validate && !this.prop && !k.includes('.') && !core_1.Utils.isOperator(k) && !CriteriaNode.isCustomExpression(k)) {
                    throw new Error(`Trying to query by not existing property ${entityName}.${k}`);
                }
            });
        }
    }
    process(qb, alias) {
        return this.payload;
    }
    shouldInline(payload) {
        return false;
    }
    willAutoJoin(qb, alias) {
        return false;
    }
    shouldRename(payload) {
        var _a;
        const type = this.prop ? this.prop.reference : null;
        const composite = /* istanbul ignore next */ ((_a = this.prop) === null || _a === void 0 ? void 0 : _a.joinColumns) ? this.prop.joinColumns.length > 1 : false;
        const customExpression = CriteriaNode.isCustomExpression(this.key);
        const scalar = payload === null || core_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        const operator = core_1.Utils.isPlainObject(payload) && Object.keys(payload).every(k => core_1.Utils.isOperator(k, false));
        if (composite) {
            return true;
        }
        switch (type) {
            case core_1.ReferenceType.MANY_TO_ONE: return false;
            case core_1.ReferenceType.ONE_TO_ONE: return !this.prop.owner;
            case core_1.ReferenceType.ONE_TO_MANY: return scalar || operator;
            case core_1.ReferenceType.MANY_TO_MANY: return scalar || operator;
            default: return false;
        }
    }
    renameFieldToPK(qb) {
        const alias = qb.getAliasForJoinPath(this.getPath());
        if (this.prop.reference === core_1.ReferenceType.MANY_TO_MANY) {
            return core_1.Utils.getPrimaryKeyHash(this.prop.inverseJoinColumns.map(col => `${alias}.${col}`));
        }
        if (this.prop.joinColumns.length > 1) {
            return core_1.Utils.getPrimaryKeyHash(this.prop.joinColumns);
        }
        return core_1.Utils.getPrimaryKeyHash(this.prop.referencedColumnNames.map(col => `${alias}.${col}`));
    }
    getPath() {
        var _a, _b, _c;
        const parentPath = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getPath();
        let ret = this.parent && this.prop ? this.prop.name : this.entityName;
        if (parentPath && ((_b = this.prop) === null || _b === void 0 ? void 0 : _b.reference) === core_1.ReferenceType.SCALAR) {
            return parentPath;
        }
        if (this.parent && Array.isArray(this.parent.payload) && this.parent.parent && !this.key) {
            ret = this.parent.parent.key;
        }
        if (parentPath) {
            ret = parentPath + '.' + ret;
        }
        else if (((_c = this.parent) === null || _c === void 0 ? void 0 : _c.entityName) && ret && this.prop) {
            ret = this.parent.entityName + '.' + ret;
        }
        if (this.isPivotJoin()) {
            return this.getPivotPath(ret);
        }
        return ret !== null && ret !== void 0 ? ret : '';
    }
    isPivotJoin() {
        if (!this.key || !this.prop) {
            return false;
        }
        const customExpression = CriteriaNode.isCustomExpression(this.key);
        const scalar = this.payload === null || core_1.Utils.isPrimaryKey(this.payload) || this.payload instanceof RegExp || this.payload instanceof Date || customExpression;
        const operator = core_1.Utils.isObject(this.payload) && Object.keys(this.payload).every(k => core_1.Utils.isOperator(k, false));
        return this.prop.reference === core_1.ReferenceType.MANY_TO_MANY && (scalar || operator);
    }
    getPivotPath(path) {
        return `${path}[pivot]`;
    }
    [util_1.inspect.custom]() {
        return `${this.constructor.name} ${util_1.inspect({ entityName: this.entityName, key: this.key, payload: this.payload })}`;
    }
    static isCustomExpression(field) {
        return !!field.match(/[ ?<>=()]|^\d/);
    }
}
exports.CriteriaNode = CriteriaNode;
