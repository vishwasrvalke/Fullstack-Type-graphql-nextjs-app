import { DatabaseTable, EntityManager } from '@mikro-orm/knex';
export declare class EntityGenerator {
    private readonly em;
    private readonly config;
    private readonly driver;
    private readonly platform;
    private readonly helper;
    private readonly connection;
    private readonly namingStrategy;
    private readonly sources;
    constructor(em: EntityManager);
    generate(options?: {
        baseDir?: string;
        save?: boolean;
    }): Promise<string[]>;
    createEntity(table: DatabaseTable): void;
}
