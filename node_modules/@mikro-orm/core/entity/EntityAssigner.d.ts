import { EntityManager } from '../EntityManager';
import { AnyEntity, EntityData, EntityProperty } from '../typings';
export declare class EntityAssigner {
    static assign<T extends AnyEntity<T>>(entity: T, data: EntityData<T>, options?: AssignOptions): T;
    static assign<T extends AnyEntity<T>>(entity: T, data: EntityData<T>, onlyProperties?: boolean): T;
    /**
     * auto-wire 1:1 inverse side with owner as in no-sql drivers it can't be joined
     * also makes sure the link is bidirectional when creating new entities from nested structures
     * @internal
     */
    static autoWireOneToOne<T extends AnyEntity<T>>(prop: EntityProperty, entity: T): void;
    private static validateEM;
    private static assignReference;
    private static assignCollection;
    private static assignEmbeddable;
    private static createCollectionItem;
}
export declare const assign: typeof EntityAssigner.assign;
export interface AssignOptions {
    updateNestedEntities?: boolean;
    onlyProperties?: boolean;
    convertCustomTypes?: boolean;
    mergeObjects?: boolean;
    merge?: boolean;
    em?: EntityManager;
}
