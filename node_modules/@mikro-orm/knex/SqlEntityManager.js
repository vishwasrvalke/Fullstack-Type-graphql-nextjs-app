"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlEntityManager = void 0;
const core_1 = require("@mikro-orm/core");
const query_1 = require("./query");
/**
 * @inheritDoc
 */
class SqlEntityManager extends core_1.EntityManager {
    /**
     * Creates a QueryBuilder instance
     */
    createQueryBuilder(entityName, alias, type) {
        entityName = core_1.Utils.className(entityName);
        return new query_1.QueryBuilder(entityName, this.getMetadata(), this.getDriver(), this.getTransactionContext(), alias, type, this);
    }
    /**
     * Returns configured knex instance.
     */
    getKnex(type) {
        return this.getConnection(type).getKnex();
    }
    async execute(queryOrKnex, params = [], method = 'all') {
        return this.getDriver().execute(queryOrKnex, params, method, this.getTransactionContext());
    }
    getRepository(entityName) {
        return super.getRepository(entityName);
    }
}
exports.SqlEntityManager = SqlEntityManager;
