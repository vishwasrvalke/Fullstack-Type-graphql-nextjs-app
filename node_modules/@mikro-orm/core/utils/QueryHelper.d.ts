import { AnyEntity, Dictionary, EntityMetadata, EntityProperty, FilterDef, FilterQuery } from '../typings';
import { Platform } from '../platforms';
import { MetadataStorage } from '../metadata/MetadataStorage';
export declare class QueryHelper {
    static readonly SUPPORTED_OPERATORS: string[];
    static processParams(params: any): any;
    static processObjectParams(params?: Dictionary): any;
    static inlinePrimaryKeyObjects<T extends AnyEntity<T>>(where: Dictionary, meta: EntityMetadata<T>, metadata: MetadataStorage, key?: string): boolean;
    static processWhere<T extends AnyEntity<T>>(where: FilterQuery<T>, entityName: string, metadata: MetadataStorage, platform: Platform, convertCustomTypes?: boolean, root?: boolean): FilterQuery<T>;
    static getActiveFilters(entityName: string, options: Dictionary<boolean | Dictionary> | string[] | boolean, filters: Dictionary<FilterDef<any>>): FilterDef<any>[];
    static isFilterActive(entityName: string, filterName: string, filter: FilterDef<any>, options: Dictionary<boolean | Dictionary>): boolean;
    static processCustomType<T>(prop: EntityProperty<T>, cond: FilterQuery<T>, platform: Platform, key?: string, fromQuery?: boolean): FilterQuery<T>;
    private static processExpression;
    private static isSupportedOperator;
    private static processJsonCondition;
}
export declare const expr: (sql: string) => string;
