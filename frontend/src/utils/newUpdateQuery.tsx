import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function newUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  func: (r: Result, q: Query) => Query
) {
  cache.updateQuery(queryInput, (data) => func(result, data as any) as any);
}
