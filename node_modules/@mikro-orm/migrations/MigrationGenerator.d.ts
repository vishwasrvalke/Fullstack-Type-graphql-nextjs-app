import { MigrationsOptions, NamingStrategy } from '@mikro-orm/core';
import { AbstractSqlDriver } from '@mikro-orm/knex';
export declare class MigrationGenerator {
    protected readonly driver: AbstractSqlDriver;
    protected readonly namingStrategy: NamingStrategy;
    protected readonly options: MigrationsOptions;
    constructor(driver: AbstractSqlDriver, namingStrategy: NamingStrategy, options: MigrationsOptions);
    generate(diff: string[], path?: string): Promise<[string, string]>;
    createStatement(sql: string, padLeft: number): string;
    generateJSMigrationFile(className: string, diff: string[]): string;
    generateTSMigrationFile(className: string, diff: string[]): string;
}
