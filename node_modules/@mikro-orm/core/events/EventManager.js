"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const utils_1 = require("../utils");
const enums_1 = require("../enums");
class EventManager {
    constructor(subscribers) {
        this.listeners = {};
        this.entities = new Map();
        subscribers.forEach(subscriber => this.registerSubscriber(subscriber));
    }
    registerSubscriber(subscriber) {
        this.entities.set(subscriber, this.getSubscribedEntities(subscriber));
        Object.keys(enums_1.EventType)
            .filter(event => event in subscriber)
            .forEach(event => {
            this.listeners[event] = this.listeners[event] || [];
            this.listeners[event].push(subscriber);
        });
    }
    dispatchEvent(event, args) {
        const listeners = [];
        const entity = args.entity;
        // execute lifecycle hooks first
        const hooks = (entity && entity.__meta.hooks[event]) || [];
        listeners.push(...hooks.map(hook => [hook, entity]));
        for (const listener of this.listeners[event] || []) {
            const entities = this.entities.get(listener);
            if (entities.length === 0 || !entity || entities.includes(entity.constructor.name)) {
                listeners.push([event, listener]);
            }
        }
        if (event === enums_1.EventType.onInit) {
            return listeners.forEach(listener => listener[1][listener[0]](args));
        }
        return utils_1.Utils.runSerial(listeners, listener => listener[1][listener[0]](args));
    }
    hasListeners(event, meta) {
        var _a, _b;
        /* istanbul ignore next */
        const hasHooks = (_a = meta.hooks[event]) === null || _a === void 0 ? void 0 : _a.length;
        if (hasHooks) {
            return true;
        }
        for (const listener of (_b = this.listeners[event]) !== null && _b !== void 0 ? _b : []) {
            const entities = this.entities.get(listener);
            if (entities.length === 0 || entities.includes(meta.className)) {
                return true;
            }
        }
        return false;
    }
    getSubscribedEntities(listener) {
        if (!listener.getSubscribedEntities) {
            return [];
        }
        return listener.getSubscribedEntities().map(name => utils_1.Utils.className(name));
    }
}
exports.EventManager = EventManager;
