"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeSetType = exports.ChangeSet = void 0;
class ChangeSet {
    constructor(entity, type, payload, meta) {
        this.entity = entity;
        this.type = type;
        this.payload = payload;
        this.name = meta.className;
        this.rootName = meta.root.className;
        this.collection = meta.root.collection;
    }
    getPrimaryKey() {
        var _a;
        this.primaryKey = (_a = this.primaryKey) !== null && _a !== void 0 ? _a : this.entity.__helper.getPrimaryKey(true);
        return this.primaryKey;
    }
}
exports.ChangeSet = ChangeSet;
var ChangeSetType;
(function (ChangeSetType) {
    ChangeSetType["CREATE"] = "create";
    ChangeSetType["UPDATE"] = "update";
    ChangeSetType["DELETE"] = "delete";
})(ChangeSetType = exports.ChangeSetType || (exports.ChangeSetType = {}));
