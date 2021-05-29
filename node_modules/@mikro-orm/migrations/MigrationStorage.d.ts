import { MigrationsOptions, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver } from '@mikro-orm/knex';
import { MigrationRow } from './typings';
export declare class MigrationStorage {
    protected readonly driver: AbstractSqlDriver;
    protected readonly options: MigrationsOptions;
    private readonly connection;
    private readonly knex;
    private readonly helper;
    private masterTransaction?;
    constructor(driver: AbstractSqlDriver, options: MigrationsOptions);
    executed(): Promise<string[]>;
    logMigration(name: string): Promise<void>;
    unlogMigration(name: string): Promise<void>;
    getExecutedMigrations(): Promise<MigrationRow[]>;
    ensureTable(): Promise<void>;
    setMasterMigration(trx: Transaction): void;
    unsetMasterMigration(): void;
}
