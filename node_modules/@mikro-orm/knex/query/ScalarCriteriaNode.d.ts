import { CriteriaNode } from './CriteriaNode';
import { IQueryBuilder } from '../typings';
export declare class ScalarCriteriaNode extends CriteriaNode {
    process<T>(qb: IQueryBuilder<T>, alias?: string): any;
    shouldJoin(): boolean;
}
