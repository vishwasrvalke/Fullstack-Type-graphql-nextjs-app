"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expr = exports.QueryHelper = void 0;
const Reference_1 = require("../entity/Reference");
const Utils_1 = require("./Utils");
const enums_1 = require("../enums");
const types_1 = require("../types");
class QueryHelper {
    static processParams(params) {
        if (Reference_1.Reference.isReference(params)) {
            params = params.unwrap();
        }
        if (Utils_1.Utils.isEntity(params)) {
            return params.__helper.__primaryKeyCond;
        }
        if (params === undefined) {
            return null;
        }
        if (Array.isArray(params)) {
            return params.map(item => QueryHelper.processParams(item));
        }
        if (Utils_1.Utils.isPlainObject(params)) {
            QueryHelper.processObjectParams(params);
        }
        return params;
    }
    static processObjectParams(params = {}) {
        Object.keys(params).forEach(k => {
            params[k] = QueryHelper.processParams(params[k]);
        });
        return params;
    }
    static inlinePrimaryKeyObjects(where, meta, metadata, key) {
        if (Array.isArray(where)) {
            where.forEach((item, i) => {
                if (this.inlinePrimaryKeyObjects(item, meta, metadata, key)) {
                    where[i] = Utils_1.Utils.getPrimaryKeyValues(item, meta.primaryKeys, false);
                }
            });
        }
        if (!Utils_1.Utils.isPlainObject(where)) {
            return false;
        }
        if (meta.primaryKeys.every(pk => pk in where) && Utils_1.Utils.getObjectKeysSize(where) === meta.primaryKeys.length) {
            return !enums_1.GroupOperator[key] && Object.keys(where).every(k => !Utils_1.Utils.isPlainObject(where[k]) || Object.keys(where[k]).every(v => !Utils_1.Utils.isOperator(v, false)));
        }
        Object.keys(where).forEach(k => {
            var _a;
            const meta2 = metadata.find((_a = meta.properties[k]) === null || _a === void 0 ? void 0 : _a.type) || meta;
            if (this.inlinePrimaryKeyObjects(where[k], meta2, metadata, k)) {
                where[k] = Utils_1.Utils.getPrimaryKeyValues(where[k], meta2.primaryKeys, true);
            }
        });
        return false;
    }
    static processWhere(where, entityName, metadata, platform, convertCustomTypes = true, root = true) {
        const meta = metadata.find(entityName);
        // inline PK-only objects in M:N queries so we don't join the target entity when not needed
        if (meta && root) {
            QueryHelper.inlinePrimaryKeyObjects(where, meta, metadata);
        }
        where = QueryHelper.processParams(where) || {};
        if (!root && Utils_1.Utils.isPrimaryKey(where)) {
            return where;
        }
        if (meta && Utils_1.Utils.isPrimaryKey(where, meta.compositePK)) {
            where = { [Utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys)]: where };
        }
        if (Array.isArray(where) && root) {
            const rootPrimaryKey = meta ? Utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys) : entityName;
            return { [rootPrimaryKey]: { $in: where.map(sub => QueryHelper.processWhere(sub, entityName, metadata, platform, convertCustomTypes, false)) } };
        }
        if (!Utils_1.Utils.isPlainObject(where)) {
            return where;
        }
        return Object.keys(where).reduce((o, key) => {
            var _a, _b, _c;
            let value = where[key];
            const prop = meta === null || meta === void 0 ? void 0 : meta.properties[key];
            const keys = (_b = (_a = prop === null || prop === void 0 ? void 0 : prop.joinColumns) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            const composite = keys > 1;
            if (key in enums_1.GroupOperator) {
                o[key] = value.map((sub) => QueryHelper.processWhere(sub, entityName, metadata, platform, convertCustomTypes, false));
                return o;
            }
            // wrap top level operators (except $not) with PK
            if (Utils_1.Utils.isOperator(key) && root && meta && key !== '$not') {
                const rootPrimaryKey = Utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys);
                o[rootPrimaryKey] = { [key]: QueryHelper.processWhere(value, entityName, metadata, platform, convertCustomTypes, false) };
                return o;
            }
            if ((prop === null || prop === void 0 ? void 0 : prop.customType) && convertCustomTypes && !platform.isRaw(value)) {
                value = QueryHelper.processCustomType(prop, value, platform, undefined, true);
            }
            if ((prop === null || prop === void 0 ? void 0 : prop.customType) instanceof types_1.JsonType && Utils_1.Utils.isPlainObject(value) && !platform.isRaw(value)) {
                return this.processJsonCondition(o, value, [prop.fieldNames[0]], platform);
            }
            if (Array.isArray(value) && !Utils_1.Utils.isOperator(key) && !QueryHelper.isSupportedOperator(key) && !key.includes('?')) {
                if (platform.allowsComparingTuples()) {
                    // comparing single composite key - use $eq instead of $in
                    const op = !value.every(v => Array.isArray(v)) && composite ? '$eq' : '$in';
                    o[key] = { [op]: value };
                }
                else {
                    if (!value.every(v => Array.isArray(v)) && composite) {
                        o[key] = { $in: [value] };
                    }
                    else {
                        o[key] = { $in: value };
                    }
                }
                return o;
            }
            const re = '[^:]+(' + this.SUPPORTED_OPERATORS.filter(op => op.startsWith(':')).map(op => `${op}`).join('|') + ')$';
            const operatorExpression = new RegExp(re).exec(key);
            if (Utils_1.Utils.isPlainObject(value)) {
                o[key] = QueryHelper.processWhere(value, (_c = prop === null || prop === void 0 ? void 0 : prop.type) !== null && _c !== void 0 ? _c : entityName, metadata, platform, convertCustomTypes, false);
            }
            else if (!QueryHelper.isSupportedOperator(key)) {
                o[key] = value;
            }
            else if (operatorExpression) {
                const [k, expr] = key.split(':');
                o[k] = QueryHelper.processExpression(expr, value);
            }
            else {
                const m = key.match(/([\w-]+) ?([<>=!]+)$/);
                if (m) {
                    o[m[1]] = QueryHelper.processExpression(m[2], value);
                }
                else {
                    o[key] = value;
                }
            }
            return o;
        }, {});
    }
    static getActiveFilters(entityName, options, filters) {
        if (options === false) {
            return [];
        }
        const opts = {};
        if (Array.isArray(options)) {
            options.forEach(filter => opts[filter] = true);
        }
        else if (Utils_1.Utils.isPlainObject(options)) {
            Object.keys(options).forEach(filter => opts[filter] = options[filter]);
        }
        return Object.keys(filters)
            .filter(f => QueryHelper.isFilterActive(entityName, f, filters[f], opts))
            .map(f => {
            filters[f].name = f;
            return filters[f];
        });
    }
    static isFilterActive(entityName, filterName, filter, options) {
        if (filter.entity && !filter.entity.includes(entityName)) {
            return false;
        }
        if (options[filterName] === false) {
            return false;
        }
        return filter.default || filterName in options;
    }
    static processCustomType(prop, cond, platform, key, fromQuery) {
        if (Utils_1.Utils.isPlainObject(cond)) {
            return Object.keys(cond).reduce((o, k) => {
                var _a;
                if (Utils_1.Utils.isOperator(k, true) || ((_a = prop.referencedPKs) === null || _a === void 0 ? void 0 : _a.includes(k))) {
                    o[k] = QueryHelper.processCustomType(prop, cond[k], platform, k, fromQuery);
                }
                else {
                    o[k] = cond[k];
                }
                return o;
            }, {});
        }
        if (Array.isArray(cond) && !(key && enums_1.ARRAY_OPERATORS.includes(key))) {
            return cond.map(v => QueryHelper.processCustomType(prop, v, platform, key, fromQuery));
        }
        return prop.customType.convertToDatabaseValue(cond, platform, fromQuery);
    }
    static processExpression(expr, value) {
        switch (expr) {
            case '>': return { $gt: value };
            case '<': return { $lt: value };
            case '>=': return { $gte: value };
            case '<=': return { $lte: value };
            case '!=': return { $ne: value };
            case '!': return { $not: value };
            default: return { ['$' + expr]: value };
        }
    }
    static isSupportedOperator(key) {
        return !!QueryHelper.SUPPORTED_OPERATORS.find(op => key.includes(op));
    }
    static processJsonCondition(o, value, path, platform) {
        if (Utils_1.Utils.isPlainObject(value) && !Object.keys(value).some(k => Utils_1.Utils.isOperator(k))) {
            Object.keys(value).forEach(k => {
                this.processJsonCondition(o, value[k], [...path, k], platform);
            });
            return o;
        }
        const operatorObject = Utils_1.Utils.isPlainObject(value) && Object.keys(value).every(k => Utils_1.Utils.isOperator(k));
        const type = operatorObject ? typeof Object.values(value)[0] : typeof value;
        const k = platform.getSearchJsonPropertyKey(path, type);
        o[k] = value;
        return o;
    }
}
exports.QueryHelper = QueryHelper;
QueryHelper.SUPPORTED_OPERATORS = ['>', '<', '<=', '>=', '!', '!=', ':in', ':nin', ':gt', ':gte', ':lt', ':lte', ':ne', ':not'];
const expr = (sql) => sql;
exports.expr = expr;
