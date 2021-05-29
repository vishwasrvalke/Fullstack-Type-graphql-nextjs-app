"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const domain_1 = __importDefault(require("domain"));
/**
 * For node 14 and above it is suggested to use `AsyncLocalStorage` instead,
 * @see https://mikro-orm.io/docs/async-local-storage/
 */
class RequestContext {
    constructor(map) {
        this.map = map;
        this.id = RequestContext.counter++;
    }
    /**
     * Returns default EntityManager.
     */
    get em() {
        return this.map.get('default');
    }
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     */
    static create(em, next) {
        const d = this.createDomain(em);
        d.run(next);
    }
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     * Async variant, when the `next` handler needs to be awaited (like in Koa).
     */
    static async createAsync(em, next) {
        const d = this.createDomain(em);
        await new Promise((resolve, reject) => {
            d.run(() => next().then(resolve).catch(reject));
        });
    }
    /**
     * Returns current RequestContext (if available).
     */
    static currentRequestContext() {
        const active = domain_1.default.active;
        return active ? active.__mikro_orm_context : undefined;
    }
    /**
     * Returns current EntityManager (if available).
     */
    static getEntityManager(name = 'default') {
        const context = RequestContext.currentRequestContext();
        return context ? context.map.get(name) : undefined;
    }
    static createDomain(em) {
        const forks = new Map();
        if (Array.isArray(em)) {
            em.forEach(em => forks.set(em.name, em.fork(true, true)));
        }
        else {
            forks.set(em.name, em.fork(true, true));
        }
        const context = new RequestContext(forks);
        const d = domain_1.default.create();
        d.__mikro_orm_context = context;
        return d;
    }
}
exports.RequestContext = RequestContext;
RequestContext.counter = 1;
