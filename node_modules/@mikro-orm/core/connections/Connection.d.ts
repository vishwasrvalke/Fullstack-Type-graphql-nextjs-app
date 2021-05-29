import { Configuration, ConnectionOptions } from '../utils';
import { MetadataStorage } from '../metadata';
import { Dictionary } from '../typings';
import { Platform } from '../platforms/Platform';
import { TransactionEventBroadcaster } from '../events/TransactionEventBroadcaster';
export declare abstract class Connection {
    protected readonly config: Configuration;
    protected readonly options?: ConnectionOptions | undefined;
    protected readonly type: 'read' | 'write';
    protected metadata: MetadataStorage;
    protected platform: Platform;
    protected abstract client: any;
    constructor(config: Configuration, options?: ConnectionOptions | undefined, type?: 'read' | 'write');
    /**
     * Establishes connection to database
     */
    abstract connect(): Promise<void>;
    /**
     * Are we connected to the database
     */
    abstract isConnected(): Promise<boolean>;
    /**
     * Closes the database connection (aka disconnect)
     */
    abstract close(force?: boolean): Promise<void>;
    /**
     * Returns default client url for given driver (e.g. mongodb://127.0.0.1:27017 for mongodb)
     */
    abstract getDefaultClientUrl(): string;
    transactional<T>(cb: (trx: Transaction) => Promise<T>, ctx?: Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<T>;
    begin(ctx?: Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<unknown>;
    commit(ctx: Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    rollback(ctx: Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    abstract execute(query: string, params?: any[], method?: 'all' | 'get' | 'run', ctx?: Transaction): Promise<QueryResult | any | any[]>;
    getConnectionOptions(): ConnectionConfig;
    getClientUrl(): string;
    setMetadata(metadata: MetadataStorage): void;
    setPlatform(platform: Platform): void;
    protected executeQuery<T>(query: string, cb: () => Promise<T>): Promise<T>;
    protected logQuery(query: string, took?: number): void;
}
export interface QueryResult {
    affectedRows: number;
    insertId: number;
    row?: Dictionary;
    rows?: Dictionary[];
}
export interface ConnectionConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
}
export declare type Transaction<T = any> = T;
