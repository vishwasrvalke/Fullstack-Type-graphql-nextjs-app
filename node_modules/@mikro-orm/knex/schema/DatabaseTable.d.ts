import { Dictionary, EntityMetadata, NamingStrategy } from '@mikro-orm/core';
import { SchemaHelper } from './SchemaHelper';
import { Column, ForeignKey, Index } from '../typings';
export declare class DatabaseTable {
    readonly name: string;
    readonly schema?: string | undefined;
    private columns;
    private indexes;
    private foreignKeys;
    constructor(name: string, schema?: string | undefined);
    getColumns(): Column[];
    getColumn(name: string): Column | undefined;
    getIndexes(): Dictionary<Index[]>;
    init(cols: Column[], indexes: Index[], pks: string[], fks: Dictionary<ForeignKey>, enums: Dictionary<string[]>): void;
    getEntityDeclaration(namingStrategy: NamingStrategy, schemaHelper: SchemaHelper): EntityMetadata;
    private getPropertyDeclaration;
    private getReferenceType;
    private getPropertyName;
    private getPropertyType;
    private getPropertyDefaultValue;
}
