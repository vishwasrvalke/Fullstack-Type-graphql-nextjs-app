import { Dictionary, FilterDef } from '../typings';
export declare function Filter<T>(options: FilterDef<T>): <U>(target: U & Dictionary<any>) => U & Dictionary<any>;
