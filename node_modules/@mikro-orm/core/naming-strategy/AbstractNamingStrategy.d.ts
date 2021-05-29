import { NamingStrategy } from './NamingStrategy';
export declare abstract class AbstractNamingStrategy implements NamingStrategy {
    getClassName(file: string, separator?: string): string;
    classToMigrationName(timestamp: string): string;
    abstract classToTableName(entityName: string): string;
    abstract joinColumnName(propertyName: string): string;
    abstract joinKeyColumnName(entityName: string, referencedColumnName?: string): string;
    abstract joinTableName(sourceEntity: string, targetEntity: string, propertyName?: string): string;
    abstract propertyToColumnName(propertyName: string): string;
    abstract referenceColumnName(): string;
}
