"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileCacheAdapter = void 0;
const globby_1 = __importDefault(require("globby"));
const fs_extra_1 = require("fs-extra");
const Utils_1 = require("../utils/Utils");
class FileCacheAdapter {
    constructor(options, baseDir, pretty = false) {
        this.options = options;
        this.baseDir = baseDir;
        this.pretty = pretty;
        this.VERSION = Utils_1.Utils.getORMVersion();
    }
    /**
     * @inheritdoc
     */
    async get(name) {
        const path = await this.path(name);
        if (!await fs_extra_1.pathExists(path)) {
            return null;
        }
        const payload = await fs_extra_1.readJSON(path);
        const hash = await this.getHash(payload.origin);
        if (!hash || payload.hash !== hash) {
            return null;
        }
        return payload.data;
    }
    /**
     * @inheritdoc
     */
    async set(name, data, origin) {
        const [path, hash] = await Promise.all([
            this.path(name),
            this.getHash(origin),
        ]);
        const opts = this.pretty ? { spaces: 2 } : {};
        await fs_extra_1.writeJSON(path, { data, origin, hash, version: this.VERSION }, opts);
    }
    /**
     * @inheritdoc
     */
    async clear() {
        const path = await this.path('*');
        const files = await globby_1.default(path);
        await Promise.all(files.map(file => fs_extra_1.unlink(file)));
    }
    async path(name) {
        await fs_extra_1.ensureDir(this.options.cacheDir);
        return `${this.options.cacheDir}/${name}.json`;
    }
    async getHash(origin) {
        origin = Utils_1.Utils.absolutePath(origin, this.baseDir);
        if (!await fs_extra_1.pathExists(origin)) {
            return null;
        }
        const contents = await fs_extra_1.readFile(origin);
        return Utils_1.Utils.hash(contents.toString() + this.VERSION);
    }
}
exports.FileCacheAdapter = FileCacheAdapter;
