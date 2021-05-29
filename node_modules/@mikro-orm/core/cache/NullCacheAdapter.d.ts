import { CacheAdapter } from './CacheAdapter';
export declare class NullCacheAdapter implements CacheAdapter {
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
}
