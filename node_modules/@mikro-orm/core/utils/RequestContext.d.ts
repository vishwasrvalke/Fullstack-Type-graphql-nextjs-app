/// <reference types="node" />
import { Domain } from 'domain';
import { EntityManager } from '../EntityManager';
export declare type ORMDomain = Domain & {
    __mikro_orm_context?: RequestContext;
};
/**
 * For node 14 and above it is suggested to use `AsyncLocalStorage` instead,
 * @see https://mikro-orm.io/docs/async-local-storage/
 */
export declare class RequestContext {
    readonly map: Map<string, EntityManager>;
    private static counter;
    readonly id: number;
    constructor(map: Map<string, EntityManager>);
    /**
     * Returns default EntityManager.
     */
    get em(): EntityManager | undefined;
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     */
    static create(em: EntityManager | EntityManager[], next: (...args: any[]) => void): void;
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     * Async variant, when the `next` handler needs to be awaited (like in Koa).
     */
    static createAsync(em: EntityManager | EntityManager[], next: (...args: any[]) => Promise<void>): Promise<void>;
    /**
     * Returns current RequestContext (if available).
     */
    static currentRequestContext(): RequestContext | undefined;
    /**
     * Returns current EntityManager (if available).
     */
    static getEntityManager(name?: string): EntityManager | undefined;
    private static createDomain;
}
