import { Dictionary, EntityMetadata, MetadataStorage } from '@mikro-orm/core';
import { ICriteriaNode } from '../typings';
export declare class CriteriaNodeFactory {
    static createNode(metadata: MetadataStorage, entityName: string, payload: any, parent?: ICriteriaNode, key?: string): ICriteriaNode;
    static createScalarNode(metadata: MetadataStorage, entityName: string, payload: any, parent?: ICriteriaNode, key?: string): ICriteriaNode;
    static createArrayNode(metadata: MetadataStorage, entityName: string, payload: any[], parent?: ICriteriaNode, key?: string): ICriteriaNode;
    static createObjectNode(metadata: MetadataStorage, entityName: string, payload: Dictionary, parent?: ICriteriaNode, key?: string): ICriteriaNode;
    static createObjectItemNode(metadata: MetadataStorage, entityName: string, node: ICriteriaNode, payload: Dictionary, item: string, meta?: EntityMetadata): ICriteriaNode;
}
