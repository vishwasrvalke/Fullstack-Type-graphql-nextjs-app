"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCriteriaNode = void 0;
const CriteriaNode_1 = require("./CriteriaNode");
class ArrayCriteriaNode extends CriteriaNode_1.CriteriaNode {
    process(qb, alias) {
        return this.payload.map((node) => {
            return node.process(qb, alias);
        });
    }
    willAutoJoin(qb, alias) {
        return this.payload.some((node) => {
            return node.willAutoJoin(qb, alias);
        });
    }
    getPath() {
        var _a, _b, _c;
        /* istanbul ignore next */
        return (_c = (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.getPath()) !== null && _c !== void 0 ? _c : '';
    }
}
exports.ArrayCriteriaNode = ArrayCriteriaNode;
