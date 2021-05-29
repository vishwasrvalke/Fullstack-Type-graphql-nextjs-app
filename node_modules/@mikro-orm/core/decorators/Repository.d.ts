import { AnyEntity, Constructor, EntityClass } from '../typings';
import { EntityRepository } from '../entity';
export declare function Repository<T extends AnyEntity>(entity: EntityClass<T>): (target: Constructor<EntityRepository<T>>) => void;
