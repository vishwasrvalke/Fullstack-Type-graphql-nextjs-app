import Knex, { QueryBuilder as KnexQueryBuilder, Raw } from 'knex';
import { Dictionary, EntityMetadata, EntityProperty, FlatQueryOrderMap, LockMode, MetadataStorage, Platform } from '@mikro-orm/core';
import { QueryType } from './enums';
import { JoinOptions } from '../typings';
export declare class QueryBuilderHelper {
    private readonly entityName;
    private readonly alias;
    private readonly aliasMap;
    private readonly subQueries;
    private readonly metadata;
    private readonly knex;
    private readonly platform;
    constructor(entityName: string, alias: string, aliasMap: Dictionary<string>, subQueries: Dictionary<string>, metadata: MetadataStorage, knex: Knex, platform: Platform);
    mapper(field: string, type?: QueryType): string;
    mapper(field: string, type?: QueryType, value?: any, alias?: string | null): string;
    processData(data: Dictionary, convertCustomTypes: boolean, multi?: boolean): any;
    joinOneToReference(prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    joinManyToOneReference(prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    joinManyToManyReference(prop: EntityProperty, ownerAlias: string, alias: string, pivotAlias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond: Dictionary, path: string): Dictionary<JoinOptions>;
    joinPivotTable(field: string, prop: EntityProperty, ownerAlias: string, alias: string, type: 'leftJoin' | 'innerJoin' | 'pivotJoin', cond?: Dictionary): JoinOptions;
    processJoins(qb: KnexQueryBuilder, joins: Dictionary<JoinOptions>): void;
    mapJoinColumns(type: QueryType, join: JoinOptions): (string | Raw)[];
    isOneToOneInverse(field: string): boolean;
    getTableName(entityName: string): string;
    /**
     * Checks whether the RE can be rewritten to simple LIKE query
     */
    isSimpleRegExp(re: any): boolean;
    getRegExpParam(re: RegExp): string;
    appendQueryCondition(type: QueryType, cond: any, qb: KnexQueryBuilder, operator?: '$and' | '$or', method?: 'where' | 'having'): void;
    private appendQuerySubCondition;
    private processCustomExpression;
    private processObjectSubCondition;
    private getOperatorReplacement;
    private appendJoinClause;
    private appendJoinSubClause;
    private processObjectSubClause;
    getQueryOrder(type: QueryType, orderBy: FlatQueryOrderMap, populate: Dictionary<string>): string;
    finalize(type: QueryType, qb: KnexQueryBuilder, meta?: EntityMetadata): void;
    splitField(field: string): [string, string];
    getLockSQL(qb: KnexQueryBuilder, lockMode?: LockMode): void;
    updateVersionProperty(qb: KnexQueryBuilder, data: Dictionary): void;
    static isCustomExpression(field: string): boolean;
    private prefix;
    private appendGroupCondition;
    private isPrefixed;
    private fieldName;
    private getProperty;
    isTableNameAliasRequired(type: QueryType): boolean;
}
