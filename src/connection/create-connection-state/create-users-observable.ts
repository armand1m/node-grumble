import Observable from 'zen-observable';
import { NodeGrumbleEventEmitter } from '.';
import { UserState } from '../../proto/Mumble';
import { MessageType } from '../../types';

export const upsertUser = (
  state: UserState[],
  userState: UserState
) => {
  const currentUserState = state.find(
    (user) => user.session === userState.session
  );

  if (currentUserState) {
    return state.map((user) => {
      if (user.session !== currentUserState.session) {
        return user;
      }

      return {
        ...currentUserState,
        ...userState,
      };
    });
  }

  return [...state, userState];
};

export const createUsersObservable = (
  events: NodeGrumbleEventEmitter
) => {
  const users = new Observable<UserState[]>((observer) => {
    let state: UserState[] = [];
    observer.next(state);

    const setState = (newState: UserState[]) => {
      state = newState;
      observer.next(state);
    };

    events.on(MessageType.UserState, (userState) => {
      setState(upsertUser(state, userState));
    });

    events.on(MessageType.UserRemove, (userRemove) => {
      setState(
        state.filter(
          (userState) => userState.session !== userRemove.session
        )
      );
    });
  });

  return users;
};
