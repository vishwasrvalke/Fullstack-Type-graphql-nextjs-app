import { AnyEntity, EntityData, EntityMetadata } from '../typings';
import { Hydrator } from './Hydrator';
import { EntityFactory } from '../entity/EntityFactory';
export declare class ObjectHydrator extends Hydrator {
    private readonly hydrators;
    private tmpIndex;
    /**
     * @inheritDoc
     */
    hydrate<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, type: 'full' | 'returning' | 'reference', newEntity?: boolean, convertCustomTypes?: boolean): void;
    /**
     * @inheritDoc
     */
    hydrateReference<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, convertCustomTypes?: boolean): void;
    /**
     * @internal Highly performance-sensitive method.
     */
    private getEntityHydrator;
    private createCollectionItemMapper;
}
