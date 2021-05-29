import { AnyEntity, EntityData, EntityMetadata, EntityProperty, IHydrator } from '../typings';
import { EntityFactory } from '../entity';
import { Platform } from '../platforms/Platform';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { Configuration } from '../utils/Configuration';
export declare abstract class Hydrator implements IHydrator {
    protected readonly metadata: MetadataStorage;
    protected readonly platform: Platform;
    protected readonly config: Configuration;
    constructor(metadata: MetadataStorage, platform: Platform, config: Configuration);
    /**
     * @inheritDoc
     */
    hydrate<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, type: 'full' | 'returning' | 'reference', newEntity?: boolean, convertCustomTypes?: boolean): void;
    /**
     * @inheritDoc
     */
    hydrateReference<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, convertCustomTypes?: boolean): void;
    protected getProperties<T extends AnyEntity<T>>(meta: EntityMetadata<T>, type: 'full' | 'returning' | 'reference'): EntityProperty<T>[];
    protected hydrateProperty<T extends AnyEntity<T>>(entity: T, prop: EntityProperty, data: EntityData<T>, factory: EntityFactory, newEntity?: boolean, convertCustomTypes?: boolean): void;
}
