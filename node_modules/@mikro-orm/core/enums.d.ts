export declare enum GroupOperator {
    $and = "and",
    $or = "or"
}
export declare enum QueryOperator {
    $eq = "=",
    $in = "in",
    $nin = "not in",
    $gt = ">",
    $gte = ">=",
    $lt = "<",
    $lte = "<=",
    $ne = "!=",
    $not = "not",
    $like = "like",
    $re = "regexp",
    $ilike = "ilike",
    $overlap = "&&",
    $contains = "@>",
    $contained = "<@"
}
export declare const ARRAY_OPERATORS: string[];
export declare enum QueryOrder {
    ASC = "ASC",
    ASC_NULLS_LAST = "ASC NULLS LAST",
    ASC_NULLS_FIRST = "ASC NULLS FIRST",
    DESC = "DESC",
    DESC_NULLS_LAST = "DESC NULLS LAST",
    DESC_NULLS_FIRST = "DESC NULLS FIRST",
    asc = "asc",
    asc_nulls_last = "asc nulls last",
    asc_nulls_first = "asc nulls first",
    desc = "desc",
    desc_nulls_last = "desc nulls last",
    desc_nulls_first = "desc nulls first"
}
export declare enum QueryOrderNumeric {
    ASC = 1,
    DESC = -1
}
export declare type QueryOrderKeysFlat = QueryOrder | QueryOrderNumeric | keyof typeof QueryOrder;
export declare type QueryOrderKeys = QueryOrderKeysFlat | QueryOrderMap;
export interface QueryOrderMap {
    [x: string]: QueryOrderKeys;
}
export interface FlatQueryOrderMap {
    [x: string]: QueryOrderKeysFlat;
}
export declare enum QueryFlag {
    DISTINCT = "DISTINCT",
    PAGINATE = "PAGINATE",
    UPDATE_SUB_QUERY = "UPDATE_SUB_QUERY",
    DELETE_SUB_QUERY = "DELETE_SUB_QUERY",
    CONVERT_CUSTOM_TYPES = "CONVERT_CUSTOM_TYPES",
    INCLUDE_LAZY_FORMULAS = "INCLUDE_LAZY_FORMULAS",
    AUTO_JOIN_ONE_TO_ONE_OWNER = "AUTO_JOIN_ONE_TO_ONE_OWNER"
}
export declare const SCALAR_TYPES: string[];
export declare enum ReferenceType {
    SCALAR = "scalar",
    ONE_TO_ONE = "1:1",
    ONE_TO_MANY = "1:m",
    MANY_TO_ONE = "m:1",
    MANY_TO_MANY = "m:n",
    EMBEDDED = "embedded"
}
export declare enum Cascade {
    PERSIST = "persist",
    MERGE = "merge",
    REMOVE = "remove",
    ALL = "all"
}
export declare enum LoadStrategy {
    SELECT_IN = "select-in",
    JOINED = "joined"
}
export declare enum LockMode {
    NONE = 0,
    OPTIMISTIC = 1,
    PESSIMISTIC_READ = 2,
    PESSIMISTIC_WRITE = 3
}
export declare enum EventType {
    onInit = "onInit",
    beforeCreate = "beforeCreate",
    afterCreate = "afterCreate",
    beforeUpdate = "beforeUpdate",
    afterUpdate = "afterUpdate",
    beforeDelete = "beforeDelete",
    afterDelete = "afterDelete",
    beforeFlush = "beforeFlush",
    onFlush = "onFlush",
    afterFlush = "afterFlush",
    beforeTransactionStart = "beforeTransactionStart",
    afterTransactionStart = "afterTransactionStart",
    beforeTransactionCommit = "beforeTransactionCommit",
    afterTransactionCommit = "afterTransactionCommit",
    beforeTransactionRollback = "beforeTransactionRollback",
    afterTransactionRollback = "afterTransactionRollback"
}
export declare type TransactionEventType = EventType.beforeTransactionStart | EventType.afterTransactionStart | EventType.beforeTransactionCommit | EventType.afterTransactionCommit | EventType.beforeTransactionRollback | EventType.afterTransactionRollback;
