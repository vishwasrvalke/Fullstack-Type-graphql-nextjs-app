import { Transaction } from '@mikro-orm/core';
export declare type UmzugMigration = {
    name?: string;
    path?: string;
    file: string;
};
export declare type MigrateOptions = {
    from?: string | number;
    to?: string | number;
    migrations?: string[];
    transaction?: Transaction;
};
export declare type MigrationResult = {
    fileName: string;
    code: string;
    diff: string[];
};
export declare type MigrationRow = {
    name: string;
    executed_at: Date;
};
