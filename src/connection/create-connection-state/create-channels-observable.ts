import Observable from 'zen-observable';
import { NodeGrumbleEventEmitter } from '.';
import { ChannelState } from '../../proto/Mumble';
import { MessageType } from '../../types';

const sortByPosition = (a: ChannelState, b: ChannelState) => {
  if (a.position < b.position) {
    return -1;
  }

  if (a.position > b.position) {
    return 1;
  }

  /**
   * fallback: sort alphabetically by name
   */
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();

  if (aName < bName) {
    return -1;
  }

  if (aName > bName) {
    return 1;
  }

  return 0;
};

export const createChannelsObservable = (
  events: NodeGrumbleEventEmitter
) => {
  const channels = new Observable<ChannelState[]>((observer) => {
    let state: ChannelState[] = [];

    const setState = (newState: ChannelState[]) => {
      state = newState.sort(sortByPosition);
    };

    observer.next(state);

    events.on(MessageType.ChannelState, (channelState) => {
      setState([...state, channelState]);
      observer.next(state);
    });

    events.on(MessageType.ChannelRemove, (channelRemove) => {
      setState(
        state.filter(
          (channel) => channel.channelId !== channelRemove.channelId
        )
      );
    });
  });

  return channels;
};
