import { CacheAdapter } from './CacheAdapter';
export declare class MemoryCacheAdapter implements CacheAdapter {
    private readonly options;
    private readonly data;
    constructor(options: {
        expiration: number;
    });
    /**
     * @inheritdoc
     */
    get<T = any>(name: string): Promise<T | undefined>;
    /**
     * @inheritdoc
     */
    set(name: string, data: any, origin: string, expiration?: number): Promise<void>;
    /**
     * @inheritdoc
     */
    clear(): Promise<void>;
}
