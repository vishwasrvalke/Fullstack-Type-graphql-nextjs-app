import { Constructor } from '../typings';
import { EventSubscriber } from '../events';
export declare function Subscriber(): (target: Constructor<EventSubscriber>) => void;
