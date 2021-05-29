import Knex from 'knex';
import { EntityRepository, EntityName } from '@mikro-orm/core';
import { SqlEntityManager } from './SqlEntityManager';
import { QueryBuilder } from './query';
export declare class SqlEntityRepository<T> extends EntityRepository<T> {
    protected readonly _em: SqlEntityManager;
    protected readonly entityName: EntityName<T>;
    constructor(_em: SqlEntityManager, entityName: EntityName<T>);
    /**
     * Creates a QueryBuilder instance
     */
    createQueryBuilder(alias?: string): QueryBuilder<T>;
    /**
     * Returns configured knex instance.
     */
    getKnex(type?: 'read' | 'write'): Knex;
    protected get em(): SqlEntityManager;
}
