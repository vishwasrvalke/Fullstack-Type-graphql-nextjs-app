import { QueryBuilder as KnexQueryBuilder, Raw } from 'knex';
import { AnyEntity, EntityData, EntityManager, EntityName, EntityRepository, GetRepository, QueryResult } from '@mikro-orm/core';
import { AbstractSqlDriver } from './AbstractSqlDriver';
import { QueryBuilder } from './query';
import { SqlEntityRepository } from './SqlEntityRepository';
/**
 * @inheritDoc
 */
export declare class SqlEntityManager<D extends AbstractSqlDriver = AbstractSqlDriver> extends EntityManager<D> {
    /**
     * Creates a QueryBuilder instance
     */
    createQueryBuilder<T>(entityName: EntityName<T>, alias?: string, type?: 'read' | 'write'): QueryBuilder<T>;
    /**
     * Returns configured knex instance.
     */
    getKnex(type?: 'read' | 'write'): import("knex")<any, unknown[]>;
    execute<T extends QueryResult | EntityData<AnyEntity> | EntityData<AnyEntity>[] = EntityData<AnyEntity>[]>(queryOrKnex: string | KnexQueryBuilder | Raw, params?: any[], method?: 'all' | 'get' | 'run'): Promise<T>;
    getRepository<T extends AnyEntity<T>, U extends EntityRepository<T> = SqlEntityRepository<T>>(entityName: EntityName<T>): GetRepository<T, U>;
}
