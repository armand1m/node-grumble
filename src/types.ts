import { EventEmitter } from 'events';
import { Writer } from 'protobufjs';

export type MessageType =
  | 'Version'
  | 'UDPTunnel'
  | 'Authenticate'
  | 'Ping'
  | 'Reject'
  | 'ServerSync'
  | 'ChannelRemove'
  | 'ChannelState'
  | 'UserRemove'
  | 'UserState'
  | 'BanList'
  | 'TextMessage'
  | 'PermissionDenied'
  | 'ACL'
  | 'QueryUsers'
  | 'CryptSetup'
  | 'ContextActionModify'
  | 'ContextAction'
  | 'UserList'
  | 'VoiceTarget'
  | 'PermissionQuery'
  | 'CodecVersion'
  | 'UserStats'
  | 'RequestBlob'
  | 'ServerConfig'
  | 'SuggestConfig';

/**
 * Order matters here.
 * Adapted from https://github.com/Gielert/NoodleJS/blob/master/src/Messages.js
 *
 * From official mumble-protocol documentation:
 * https://mumble-protocol.readthedocs.io/en/latest/protocol_stack_tcp.html
 */
export enum Messages {
  Version,
  UDPTunnel,
  Authenticate,
  Ping,
  Reject,
  ServerSync,
  ChannelRemove,
  ChannelState,
  UserRemove,
  UserState,
  BanList,
  TextMessage,
  PermissionDenied,
  ACL,
  QueryUsers,
  CryptSetup,
  ContextActionModify,
  ContextAction,
  UserList,
  VoiceTarget,
  PermissionQuery,
  CodecVersion,
  UserStats,
  RequestBlob,
  ServerConfig,
  SuggestConfig,
}

/**
 * Order matters here.
 *
 * From official mumble-protocol documentation, check "Packet format -> type":
 * https://mumble-protocol.readthedocs.io/en/latest/voice_data.html
 */
export enum Codec {
  Celt,
  Ping,
  Speex,
  CeltBeta,
  Opus,
}

export enum Events {
  Connected = 'connected',
  Error = 'error',
  Close = 'close',
  Packet = 'packet',
}

export interface NodeGrumbleOptions {
  url: string;
  port?: number;
  rejectUnauthorized?: boolean;
  name?: string;
  password?: string;
  tokens?: any[];
}

export interface CompleteGrumbleOptions {
  url: string;
  port: number;
  rejectUnauthorized: boolean;
  name: string;
  password: string;
  tokens: any[];
}

export interface Connection {
  write: (type: Messages, writer: Writer) => void;
  events: EventEmitter;
  disconnect: () => void;
}

export interface Packet {
  type: MessageType;
  message: Record<string, any>;
}
