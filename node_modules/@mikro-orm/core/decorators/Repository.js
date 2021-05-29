"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const metadata_1 = require("../metadata");
function Repository(entity) {
    return function (target) {
        const meta = metadata_1.MetadataStorage.getMetadata(entity.name, entity.__path);
        meta.customRepository = () => target;
    };
}
exports.Repository = Repository;
