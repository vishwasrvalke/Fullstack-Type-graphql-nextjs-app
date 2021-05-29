import { CacheAdapter } from './CacheAdapter';
export declare class FileCacheAdapter implements CacheAdapter {
    private readonly options;
    private readonly baseDir;
    private readonly pretty;
    private readonly VERSION;
    constructor(options: {
        cacheDir: string;
    }, baseDir: string, pretty?: boolean);
    /**
     * @inheritdoc
     */
    get(name: string): Promise<any>;
    /**
     * @inheritdoc
     */
    set(name: string, data: any, origin: string): Promise<void>;
    /**
     * @inheritdoc
     */
    clear(): Promise<void>;
    private path;
    private getHash;
}
