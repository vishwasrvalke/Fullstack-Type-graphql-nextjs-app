import { ReferenceOptions } from './Property';
import { AnyEntity, EntityName } from '../typings';
export declare function ManyToOne<T, O>(entity?: ManyToOneOptions<T, O> | string | ((e?: any) => EntityName<T>), options?: Partial<ManyToOneOptions<T, O>>): (target: AnyEntity, propertyName: string) => any;
export interface ManyToOneOptions<T, O> extends ReferenceOptions<T, O> {
    inversedBy?: (string & keyof T) | ((e: T) => any);
    wrappedReference?: boolean;
    primary?: boolean;
    mapToPk?: boolean;
    joinColumn?: string;
    joinColumns?: string[];
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    onUpdateIntegrity?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
}
