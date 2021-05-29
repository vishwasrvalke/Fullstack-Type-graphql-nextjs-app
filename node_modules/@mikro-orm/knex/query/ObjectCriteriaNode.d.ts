import { CriteriaNode } from './CriteriaNode';
import { IQueryBuilder } from '../typings';
export declare class ObjectCriteriaNode extends CriteriaNode {
    process<T>(qb: IQueryBuilder<T>, alias?: string): any;
    willAutoJoin<T>(qb: IQueryBuilder<T>, alias?: string): boolean;
    shouldInline(payload: any): boolean;
    private inlineChildPayload;
    private shouldAutoJoin;
    private autoJoin;
    private isPrefixed;
}
