import { Configuration } from '../utils';
import { MetadataStorage } from '../metadata';
import { AnyEntity } from '../typings';
import { ChangeSet } from './ChangeSet';
import { Collection, EntityValidator } from '../entity';
import { Platform } from '../platforms';
export declare class ChangeSetComputer {
    private readonly validator;
    private readonly collectionUpdates;
    private readonly removeStack;
    private readonly metadata;
    private readonly platform;
    private readonly config;
    private readonly comparator;
    constructor(validator: EntityValidator, collectionUpdates: Set<Collection<AnyEntity>>, removeStack: Set<AnyEntity>, metadata: MetadataStorage, platform: Platform, config: Configuration);
    computeChangeSet<T extends AnyEntity<T>>(entity: T): ChangeSet<T> | null;
    private computePayload;
    private processProperty;
    private processToOne;
    private processToMany;
}
