import { TypedEventEmitter } from '../../structures/EventEmitter';
import { EventMap, MessageEventMap } from '../../types';
import { createChannelsObservable } from './create-channels-observable';
import { createUsersObservable } from './create-users-observable';

export type NodeGrumbleEventEmitter = TypedEventEmitter<
  MessageEventMap & EventMap
>;

export const createStateObservable = (
  events: NodeGrumbleEventEmitter
) => {
  const users = createUsersObservable(events);
  const channels = createChannelsObservable(events);

  return {
    users,
    channels,
  };
};
