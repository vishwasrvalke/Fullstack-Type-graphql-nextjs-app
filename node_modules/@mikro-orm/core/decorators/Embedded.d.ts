import { AnyEntity } from '../typings';
export declare function Embedded(type?: EmbeddedOptions | (() => AnyEntity), options?: EmbeddedOptions): (target: AnyEntity, propertyName: string) => any;
export declare type EmbeddedOptions = {
    entity?: string | (() => AnyEntity);
    type?: string;
    prefix?: string | boolean;
    nullable?: boolean;
    object?: boolean;
    array?: boolean;
};
