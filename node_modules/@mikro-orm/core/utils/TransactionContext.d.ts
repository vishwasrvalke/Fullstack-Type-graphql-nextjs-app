/// <reference types="node" />
import { Domain } from 'domain';
import { EntityManager } from '../EntityManager';
export declare type TXDomain = Domain & {
    __mikro_orm_tx_context?: TransactionContext;
};
export declare class TransactionContext {
    readonly em: EntityManager;
    readonly id: number;
    constructor(em: EntityManager);
    /**
     * Creates new TransactionContext instance and runs the code inside its domain.
     */
    static createAsync<T>(em: EntityManager, next: (...args: any[]) => Promise<T>): Promise<T>;
    /**
     * Returns current TransactionContext (if available).
     */
    static currentTransactionContext(): TransactionContext | undefined;
    /**
     * Returns current EntityManager (if available).
     */
    static getEntityManager(): EntityManager | undefined;
}
