import { MetadataStorage } from '../metadata';
import { AnyEntity, IHydrator } from '../typings';
import { EntityFactory } from '../entity';
import { ChangeSet } from './ChangeSet';
import { Transaction } from '../connections';
import { Configuration } from '../utils';
import { IDatabaseDriver } from '../drivers';
export declare class ChangeSetPersister {
    private readonly driver;
    private readonly metadata;
    private readonly hydrator;
    private readonly factory;
    private readonly config;
    private readonly platform;
    constructor(driver: IDatabaseDriver, metadata: MetadataStorage, hydrator: IHydrator, factory: EntityFactory, config: Configuration);
    executeInserts<T extends AnyEntity<T>>(changeSets: ChangeSet<T>[], ctx?: Transaction): Promise<void>;
    executeUpdates<T extends AnyEntity<T>>(changeSets: ChangeSet<T>[], batched: boolean, ctx?: Transaction): Promise<void>;
    executeDeletes<T extends AnyEntity<T>>(changeSets: ChangeSet<T>[], ctx?: Transaction): Promise<void>;
    private processProperties;
    private persistNewEntity;
    private persistNewEntities;
    private persistNewEntitiesBatch;
    private persistManagedEntity;
    private persistManagedEntities;
    private persistManagedEntitiesBatch;
    private mapPrimaryKey;
    /**
     * Sets populate flag to new entities so they are serialized like if they were loaded from the db
     */
    private markAsPopulated;
    private updateEntity;
    private checkOptimisticLocks;
    private checkOptimisticLock;
    private reloadVersionValues;
    private processProperty;
    /**
     * Maps values returned via `returning` statement (postgres) or the inserted id (other sql drivers).
     * No need to handle composite keys here as they need to be set upfront.
     * We do need to map to the change set payload too, as it will be used in the originalEntityData for new entities.
     */
    private mapReturnedValues;
}
