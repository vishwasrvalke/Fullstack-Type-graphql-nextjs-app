"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullCacheAdapter = void 0;
class NullCacheAdapter {
    /**
     * @inheritdoc
     */
    async get(name) {
        return null;
    }
    /**
     * @inheritdoc
     */
    async set(name, data, origin) {
        // ignore
    }
    /**
     * @inheritdoc
     */
    async clear() {
        // ignore
    }
}
exports.NullCacheAdapter = NullCacheAdapter;
