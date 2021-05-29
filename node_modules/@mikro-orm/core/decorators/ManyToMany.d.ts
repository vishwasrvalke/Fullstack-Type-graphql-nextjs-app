import { ReferenceOptions } from './Property';
import { EntityName, AnyEntity } from '../typings';
import { QueryOrder } from '../enums';
export declare function ManyToMany<T, O>(entity?: ManyToManyOptions<T, O> | string | (() => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<ManyToManyOptions<T, O>>): (target: AnyEntity, propertyName: string) => any;
export interface ManyToManyOptions<T, O> extends ReferenceOptions<T, O> {
    owner?: boolean;
    inversedBy?: (string & keyof T) | ((e: T) => any);
    mappedBy?: (string & keyof T) | ((e: T) => any);
    orderBy?: {
        [field: string]: QueryOrder;
    };
    fixedOrder?: boolean;
    fixedOrderColumn?: string;
    pivotTable?: string;
    joinColumn?: string;
    joinColumns?: string[];
    inverseJoinColumn?: string;
    inverseJoinColumns?: string[];
    referenceColumnName?: string;
}
