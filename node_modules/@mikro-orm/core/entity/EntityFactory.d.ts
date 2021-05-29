import { AnyEntity, EntityData, EntityName, New, Populate, Primary } from '../typings';
import { UnitOfWork } from '../unit-of-work';
import { EntityManager } from '../EntityManager';
export interface FactoryOptions {
    initialized?: boolean;
    newEntity?: boolean;
    merge?: boolean;
    refresh?: boolean;
    convertCustomTypes?: boolean;
}
export declare class EntityFactory {
    private readonly unitOfWork;
    private readonly em;
    private readonly driver;
    private readonly platform;
    private readonly config;
    private readonly metadata;
    private readonly hydrator;
    private readonly eventManager;
    constructor(unitOfWork: UnitOfWork, em: EntityManager);
    create<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, data: EntityData<T>, options?: FactoryOptions): New<T, P>;
    createReference<T>(entityName: EntityName<T>, id: Primary<T> | Primary<T>[] | Record<string, Primary<T>>, options?: Pick<FactoryOptions, 'merge' | 'convertCustomTypes'>): T;
    private createEntity;
    private hydrate;
    private findEntity;
    private processDiscriminatorColumn;
    /**
     * denormalize PK to value required by driver (e.g. ObjectId)
     */
    private denormalizePrimaryKey;
    /**
     * returns parameters for entity constructor, creating references from plain ids
     */
    private extractConstructorParams;
}
