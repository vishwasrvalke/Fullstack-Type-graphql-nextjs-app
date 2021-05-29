"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroORM = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const metadata_1 = require("./metadata");
const utils_1 = require("./utils");
const cache_1 = require("./cache");
/**
 * Helper class for bootstrapping the MikroORM.
 */
class MikroORM {
    constructor(options) {
        if (options instanceof utils_1.Configuration) {
            this.config = options;
        }
        else {
            this.config = new utils_1.Configuration(options);
        }
        if (this.config.get('discovery').disableDynamicFileAccess) {
            this.config.set('metadataProvider', metadata_1.ReflectMetadataProvider);
            this.config.set('cache', { adapter: cache_1.NullCacheAdapter });
            this.config.set('discovery', { disableDynamicFileAccess: true, requireEntitiesArray: true, alwaysAnalyseProperties: false });
        }
        this.driver = this.config.getDriver();
        this.logger = this.config.getLogger();
    }
    /**
     * Initialize the ORM, load entity metadata, create EntityManager and connect to the database.
     * If you omit the `options` parameter, your CLI config will be used.
     */
    static async init(options, connect = true) {
        const env = utils_1.ConfigurationLoader.loadEnvironmentVars(options);
        if (!options) {
            options = await utils_1.ConfigurationLoader.getConfiguration();
        }
        options = options instanceof utils_1.Configuration ? options.getAll() : options;
        const orm = new MikroORM(utils_1.Utils.merge(options, env));
        const discovery = new metadata_1.MetadataDiscovery(new metadata_1.MetadataStorage(), orm.driver.getPlatform(), orm.config);
        orm.metadata = await discovery.discover(orm.config.get('tsNode'));
        orm.driver.setMetadata(orm.metadata);
        orm.em = orm.driver.createEntityManager();
        orm.metadata.decorate(orm.em);
        orm.driver.setMetadata(orm.metadata);
        if (connect) {
            await orm.connect();
            if (orm.config.get('ensureIndexes')) {
                await orm.driver.ensureIndexes();
            }
        }
        return orm;
    }
    /**
     * Connects to the database.
     */
    async connect() {
        const connection = await this.driver.connect();
        const clientUrl = connection.getClientUrl();
        const dbName = this.config.get('dbName');
        const db = dbName + (clientUrl ? ' on ' + clientUrl : '');
        if (await this.isConnected()) {
            this.logger.log('info', `MikroORM successfully connected to database ${ansi_colors_1.default.green(db)}`);
        }
        else {
            this.logger.log('info', ansi_colors_1.default.red(`MikroORM failed to connect to database ${db}`));
        }
        return this.driver;
    }
    /**
     * Checks whether the database connection is active.
     */
    async isConnected() {
        return this.driver.getConnection().isConnected();
    }
    /**
     * Closes the database connection.
     */
    async close(force = false) {
        return this.driver.close(force);
    }
    /**
     * Gets the MetadataStorage.
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the SchemaGenerator.
     */
    getSchemaGenerator() {
        return this.driver.getPlatform().getSchemaGenerator(this.em);
    }
    /**
     * Gets the EntityGenerator.
     */
    getEntityGenerator() {
        return this.driver.getPlatform().getEntityGenerator(this.em);
    }
    /**
     * Gets the Migrator.
     */
    getMigrator() {
        return this.driver.getPlatform().getMigrator(this.em);
    }
}
exports.MikroORM = MikroORM;
