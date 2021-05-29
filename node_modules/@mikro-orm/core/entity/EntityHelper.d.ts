import { EntityManager } from '../EntityManager';
import { AnyEntity, EntityMetadata } from '../typings';
export declare class EntityHelper {
    static decorate<T extends AnyEntity<T>>(meta: EntityMetadata<T>, em: EntityManager): void;
    /**
     * defines magic id property getter/setter if PK property is `_id` and there is no `id` property defined
     */
    private static defineIdProperty;
    private static defineBaseProperties;
    /**
     * Defines getter and setter for every owning side of m:1 and 1:1 relation. This is then used for propagation of
     * changes to the inverse side of bi-directional relations.
     * First defines a setter on the prototype, once called, actual get/set handlers are registered on the instance rather
     * than on its prototype. Thanks to this we still have those properties enumerable (e.g. part of `Object.keys(entity)`).
     */
    private static defineReferenceProperties;
    private static defineReferenceProperty;
    private static propagate;
    private static propagateOneToOne;
}
