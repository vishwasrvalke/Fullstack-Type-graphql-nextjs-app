"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheAdapter = void 0;
class MemoryCacheAdapter {
    constructor(options) {
        this.options = options;
        this.data = new Map();
    }
    /**
     * @inheritdoc
     */
    async get(name) {
        const data = this.data.get(name);
        if (data) {
            if (data.expiration < Date.now()) {
                this.data.delete(name);
            }
            else {
                return data.data;
            }
        }
        return undefined;
    }
    /**
     * @inheritdoc
     */
    async set(name, data, origin, expiration) {
        this.data.set(name, { data, expiration: Date.now() + (expiration !== null && expiration !== void 0 ? expiration : this.options.expiration) });
    }
    /**
     * @inheritdoc
     */
    async clear() {
        this.data.clear();
    }
}
exports.MemoryCacheAdapter = MemoryCacheAdapter;
