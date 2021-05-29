import { EntityRepository } from '../entity';
import { Constructor, Dictionary } from '../typings';
export declare function Entity(options?: EntityOptions<any>): <T>(target: T & Dictionary<any>) => T & Dictionary<any>;
export declare type EntityOptions<T> = {
    tableName?: string;
    collection?: string;
    discriminatorColumn?: string;
    discriminatorMap?: Dictionary<string>;
    discriminatorValue?: string;
    comment?: string;
    abstract?: boolean;
    readonly?: boolean;
    customRepository?: () => Constructor<EntityRepository<T>>;
};
