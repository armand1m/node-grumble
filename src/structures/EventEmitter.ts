/**
 * This code was found at https://rjzaworski.com/2019/10/event-emitters-in-typescript
 * and it is awesome for typesafe event driven programming. All the kudos to the author.
 */
import { EventEmitter } from 'events';

type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(
    eventName: K,
    fn: EventReceiver<T[K]>
  ): void;
  off<K extends EventKey<T>>(
    eventName: K,
    fn: EventReceiver<T[K]>
  ): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

export class TypedEventEmitter<T extends EventMap>
  implements Emitter<T> {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.on(eventName, fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.off(eventName, fn);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params);
  }
}
