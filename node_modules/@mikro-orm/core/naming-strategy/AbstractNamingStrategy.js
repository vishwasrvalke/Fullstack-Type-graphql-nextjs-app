"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractNamingStrategy = void 0;
class AbstractNamingStrategy {
    getClassName(file, separator = '-') {
        const name = file.split('.')[0];
        const ret = name.replace(new RegExp(`${separator}+(\\w)`, 'g'), m => m[1].toUpperCase());
        return ret.charAt(0).toUpperCase() + ret.slice(1);
    }
    classToMigrationName(timestamp) {
        return `Migration${timestamp}`;
    }
}
exports.AbstractNamingStrategy = AbstractNamingStrategy;
