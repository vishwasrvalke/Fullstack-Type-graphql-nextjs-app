import { Transaction } from '../connections';
import { EntityManager } from '../EntityManager';
import { TransactionEventType } from '../enums';
import { UnitOfWork } from '../unit-of-work';
export declare class TransactionEventBroadcaster {
    private readonly em;
    private readonly uow?;
    private readonly eventManager;
    constructor(em: EntityManager, uow?: UnitOfWork | undefined);
    dispatchEvent(event: TransactionEventType, transaction?: Transaction): Promise<void>;
}
