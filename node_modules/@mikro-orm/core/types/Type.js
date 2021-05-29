"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
class Type {
    /**
     * Converts a value from its JS representation to its database representation of this type.
     */
    convertToDatabaseValue(value, platform, fromQuery) {
        return value;
    }
    /**
     * Converts a value from its database representation to its JS representation of this type.
     */
    convertToJSValue(value, platform) {
        return value;
    }
    /**
     * How should the raw database values be compared? Used in `EntityComparator`.
     * Possible values: string | number | boolean | date | any | buffer | array
     */
    compareAsType() {
        return 'any';
    }
    /**
     * Converts a value from its JS representation to its serialized JSON form of this type.
     * By default uses the runtime value.
     */
    toJSON(value, platform) {
        return value;
    }
    /**
     * Gets the SQL declaration snippet for a field of this type.
     */
    getColumnType(prop, platform) {
        var _a;
        /* istanbul ignore next */
        return (_a = prop.columnTypes) === null || _a === void 0 ? void 0 : _a[0];
    }
    static getType(cls) {
        const key = cls.name;
        if (!Type.types.has(key)) {
            Type.types.set(key, new cls());
        }
        return Type.types.get(key);
    }
}
exports.Type = Type;
Type.types = new Map();
