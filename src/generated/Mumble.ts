/* eslint-disable */
import * as Long from 'long';
import { Writer, Reader } from 'protobufjs';

export interface Version {
  /**
   *  2-byte Major, 1-byte Minor and 1-byte Patch version number.
   */
  version: number;
  /**
   *  Client release name.
   */
  release: string;
  /**
   *  Client OS name.
   */
  os: string;
  /**
   *  Client OS version.
   */
  osVersion: string;
}

/**
 *  Not used. Not even for tunneling UDP through TCP.
 */
export interface UDPTunnel {
  /**
   *  Not used.
   */
  packet: Uint8Array;
}

/**
 *  Used by the client to send the authentication credentials to the server.
 */
export interface Authenticate {
  /**
   *  UTF-8 encoded username.
   */
  username: string;
  /**
   *  Server or user password.
   */
  password: string;
  /**
   *  Additional access tokens for server ACL groups.
   */
  tokens: string[];
  /**
   *  A list of CELT bitstream version constants supported by the client.
   */
  celtVersions: number[];
  opus: boolean;
}

/**
 *  Sent by the client to notify the server that the client is still alive.
 *  Server must reply to the packet with the same timestamp and its own
 *  good/late/lost/resync numbers. None of the fields is strictly required.
 */
export interface Ping {
  /**
   *  Client timestamp. Server should not attempt to decode.
   */
  timestamp: number;
  /**
   *  The amount of good packets received.
   */
  good: number;
  /**
   *  The amount of late packets received.
   */
  late: number;
  /**
   *  The amount of packets never received.
   */
  lost: number;
  /**
   *  The amount of nonce resyncs.
   */
  resync: number;
  /**
   *  The total amount of UDP packets received.
   */
  udpPackets: number;
  /**
   *  The total amount of TCP packets received.
   */
  tcpPackets: number;
  /**
   *  UDP ping average.
   */
  udpPingAvg: number;
  /**
   *  UDP ping variance.
   */
  udpPingVar: number;
  /**
   *  TCP ping average.
   */
  tcpPingAvg: number;
  /**
   *  TCP ping variance.
   */
  tcpPingVar: number;
}

/**
 *  Sent by the server when it rejects the user connection.
 */
export interface Reject {
  /**
   *  Rejection type.
   */
  type: Reject_RejectType;
  /**
   *  Human readable rejection reason.
   */
  reason: string;
}

/**
 *  ServerSync message is sent by the server when it has authenticated the user
 *  and finished synchronizing the server state.
 */
export interface ServerSync {
  /**
   *  The session of the current user.
   */
  session: number;
  /**
   *  Maximum bandwidth that the user should use.
   */
  maxBandwidth: number;
  /**
   *  Server welcome text.
   */
  welcomeText: string;
  /**
   *  Current user permissions in the root channel.
   */
  permissions: number;
}

/**
 *  Sent by the client when it wants a channel removed. Sent by the server when
 *  a channel has been removed and clients should be notified.
 */
export interface ChannelRemove {
  channelId: number;
}

/**
 *  Used to communicate channel properties between the client and the server.
 *  Sent by the server during the login process or when channel properties are
 *  updated. Client may use this message to update said channel properties.
 */
export interface ChannelState {
  /**
   *  Unique ID for the channel within the server.
   */
  channelId: number;
  /**
   *  channel_id of the parent channel.
   */
  parent: number;
  /**
   *  UTF-8 encoded channel name.
   */
  name: string;
  /**
   *  A collection of channel id values of the linked channels. Absent during
   *  the first channel listing.
   */
  links: number[];
  /**
   *  UTF-8 encoded channel description. Only if the description is less than
   *  128 bytes
   */
  description: string;
  /**
   *  A collection of channel_id values that should be added to links.
   */
  linksAdd: number[];
  /**
   *  A collection of channel_id values that should be removed from links.
   */
  linksRemove: number[];
  /**
   *  True if the channel is temporary.
   */
  temporary: boolean;
  /**
   *  Position weight to tweak the channel position in the channel list.
   */
  position: number;
  /**
   *  SHA1 hash of the description if the description is 128 bytes or more.
   */
  descriptionHash: Uint8Array;
  /**
   *  Maximum number of users allowed in the channel. If this value is zero,
   *  the maximum number of users allowed in the channel is given by the
   *  server's "usersperchannel" setting.
   */
  maxUsers: number;
  /**
   *  Whether this channel has enter restrictions (ACL denying ENTER) set
   */
  isEnterRestricted: boolean;
  /**
   *  Whether the receiver of this msg is considered to be able to enter this channel
   */
  canEnter: boolean;
}

/**
 *  Used to communicate user leaving or being kicked. May be sent by the client
 *  when it attempts to kick a user. Sent by the server when it informs the
 *  clients that a user is not present anymore.
 */
export interface UserRemove {
  /**
   *  The user who is being kicked, identified by their session, not present
   *  when no one is being kicked.
   */
  session: number;
  /**
   *  The user who initiated the removal. Either the user who performs the kick
   *  or the user who is currently leaving.
   */
  actor: number;
  /**
   *  Reason for the kick, stored as the ban reason if the user is banned.
   */
  reason: string;
  /**
   *  True if the kick should result in a ban.
   */
  ban: boolean;
}

/**
 *  Sent by the server when it communicates new and changed users to client.
 *  First seen during login procedure. May be sent by the client when it wishes
 *  to alter its state.
 */
export interface UserState {
  /**
   *  Unique user session ID of the user whose state this is, may change on
   *  reconnect.
   */
  session: number;
  /**
   *  The session of the user who is updating this user.
   */
  actor: number;
  /**
   *  User name, UTF-8 encoded.
   */
  name: string;
  /**
   *  Registered user ID if the user is registered.
   */
  userId: number;
  /**
   *  Channel on which the user is.
   */
  channelId: number;
  /**
   *  True if the user is muted by admin.
   */
  mute: boolean;
  /**
   *  True if the user is deafened by admin.
   */
  deaf: boolean;
  /**
   *  True if the user has been suppressed from talking by a reason other than
   *  being muted.
   */
  suppress: boolean;
  /**
   *  True if the user has muted self.
   */
  selfMute: boolean;
  /**
   *  True if the user has deafened self.
   */
  selfDeaf: boolean;
  /**
   *  User image if it is less than 128 bytes.
   */
  texture: Uint8Array;
  /**
   *  The positional audio plugin identifier.
   *  Positional audio information is only sent to users who share
   *  identical plugin contexts.
   *
   *  This value is not transmitted to clients.
   */
  pluginContext: Uint8Array;
  /**
   *  The user's plugin-specific identity.
   *  This value is not transmitted to clients.
   */
  pluginIdentity: string;
  /**
   *  User comment if it is less than 128 bytes.
   */
  comment: string;
  /**
   *  The hash of the user certificate.
   */
  hash: string;
  /**
   *  SHA1 hash of the user comment if it 128 bytes or more.
   */
  commentHash: Uint8Array;
  /**
   *  SHA1 hash of the user picture if it 128 bytes or more.
   */
  textureHash: Uint8Array;
  /**
   *  True if the user is a priority speaker.
   */
  prioritySpeaker: boolean;
  /**
   *  True if the user is currently recording.
   */
  recording: boolean;
  /**
   *  A list of temporary access tokens to be respected when processing this request.
   */
  temporaryAccessTokens: string[];
  /**
   *  A list of channels the user wants to start listening to.
   */
  listeningChannelAdd: number[];
  /**
   *  a list of channels the user does no longer want to listen to.
   */
  listeningChannelRemove: number[];
}

/**
 *  Relays information on the bans. The client may send the BanList message to
 *  either modify the list of bans or query them from the server. The server
 *  sends this list only after a client queries for it.
 */
export interface BanList {
  /**
   *  List of ban entries currently in place.
   */
  bans: BanList_BanEntry[];
  /**
   *  True if the server should return the list, false if it should replace old
   *  ban list with the one provided.
   */
  query: boolean;
}

export interface BanList_BanEntry {
  /**
   *  Banned IP address.
   */
  address: Uint8Array;
  /**
   *  The length of the subnet mask for the ban.
   */
  mask: number;
  /**
   *  User name for identification purposes (does not affect the ban).
   */
  name: string;
  /**
   *  The certificate hash of the banned user.
   */
  hash: string;
  /**
   *  Reason for the ban (does not affect the ban).
   */
  reason: string;
  /**
   *  Ban start time.
   */
  start: string;
  /**
   *  Ban duration in seconds.
   */
  duration: number;
}

/**
 *  Used to send and broadcast text messages.
 */
export interface TextMessage {
  /**
   *  The message sender, identified by its session.
   */
  actor: number;
  /**
   *  Target users for the message, identified by their session.
   */
  session: number[];
  /**
   *  The channels to which the message is sent, identified by their
   *  channel_ids.
   */
  channelId: number[];
  /**
   *  The root channels when sending message recursively to several channels,
   *  identified by their channel_ids.
   */
  treeId: number[];
  /**
   *  The UTF-8 encoded message. May be HTML if the server allows.
   */
  message: string;
}

export interface PermissionDenied {
  /**
   *  The denied permission when type is Permission.
   */
  permission: number;
  /**
   *  channel_id for the channel where the permission was denied when type is
   *  Permission.
   */
  channelId: number;
  /**
   *  The user who was denied permissions, identified by session.
   */
  session: number;
  /**
   *  Textual reason for the denial.
   */
  reason: string;
  /**
   *  Type of the denial.
   */
  type: PermissionDenied_DenyType;
  /**
   *  The name that is invalid when type is UserName.
   */
  name: string;
}

export interface ACL {
  /**
   *  Channel ID of the channel this message affects.
   */
  channelId: number;
  /**
   *  True if the channel inherits its parent's ACLs.
   */
  inheritAcls: boolean;
  /**
   *  User group specifications.
   */
  groups: ACL_ChanGroup[];
  /**
   *  ACL specifications.
   */
  acls: ACL_ChanACL[];
  /**
   *  True if the message is a query for ACLs instead of setting them.
   */
  query: boolean;
}

export interface ACL_ChanGroup {
  /**
   *  Name of the channel group, UTF-8 encoded.
   */
  name: string;
  /**
   *  True if the group has been inherited from the parent (Read only).
   */
  inherited: boolean;
  /**
   *  True if the group members are inherited.
   */
  inherit: boolean;
  /**
   *  True if the group can be inherited by sub channels.
   */
  inheritable: boolean;
  /**
   *  Users explicitly included in this group, identified by user_id.
   */
  add: number[];
  /**
   *  Users explicitly removed from this group in this channel if the group
   *  has been inherited, identified by user_id.
   */
  remove: number[];
  /**
   *  Users inherited, identified by user_id.
   */
  inheritedMembers: number[];
}

export interface ACL_ChanACL {
  /**
   *  True if this ACL applies to the current channel.
   */
  applyHere: boolean;
  /**
   *  True if this ACL applies to the sub channels.
   */
  applySubs: boolean;
  /**
   *  True if the ACL has been inherited from the parent.
   */
  inherited: boolean;
  /**
   *  ID of the user that is affected by this ACL.
   */
  userId: number;
  /**
   *  ID of the group that is affected by this ACL.
   */
  group: string;
  /**
   *  Bit flag field of the permissions granted by this ACL.
   */
  grant: number;
  /**
   *  Bit flag field of the permissions denied by this ACL.
   */
  deny: number;
}

/**
 *  Client may use this message to refresh its registered user information. The
 *  client should fill the IDs or Names of the users it wants to refresh. The
 *  server fills the missing parts and sends the message back.
 */
export interface QueryUsers {
  /**
   *  user_ids.
   */
  ids: number[];
  /**
   *  User names in the same order as ids.
   */
  names: string[];
}

/**
 *  Used to initialize and resync the UDP encryption. Either side may request a
 *  resync by sending the message without any values filled. The resync is
 *  performed by sending the message with only the client or server nonce
 *  filled.
 */
export interface CryptSetup {
  /**
   *  Encryption key.
   */
  key: Uint8Array;
  /**
   *  Client nonce.
   */
  clientNonce: Uint8Array;
  /**
   *  Server nonce.
   */
  serverNonce: Uint8Array;
}

/**
 *  Used to add or remove custom context menu item on client-side.
 */
export interface ContextActionModify {
  /**
   *  The action identifier. Used later to initiate an action.
   */
  action: string;
  /**
   *  The display name of the action.
   */
  text: string;
  /**
   *  Context bit flags defining where the action should be displayed.
   *  Flags can be OR-ed to combine different types.
   */
  context: number;
  /**
   *  Choose either to add or to remove the context action.
   *  Note: This field only exists after Mumble 1.2.4-beta1 release.
   *        The message will be recognized as Add regardless of this field
   *        before said release.
   */
  operation: ContextActionModify_Operation;
}

/**
 *  Sent by the client when it wants to initiate a Context action.
 */
export interface ContextAction {
  /**
   *  The target User for the action, identified by session.
   */
  session: number;
  /**
   *  The target Channel for the action, identified by channel_id.
   */
  channelId: number;
  /**
   *  The action that should be executed.
   */
  action: string;
}

/**
 *  Lists the registered users.
 */
export interface UserList {
  /**
   *  A list of registered users.
   */
  users: UserList_User[];
}

export interface UserList_User {
  /**
   *  Registered user ID.
   */
  userId: number;
  /**
   *  Registered user name.
   */
  name: string;
  lastSeen: string;
  lastChannel: number;
}

/**
 *  Sent by the client when it wants to register or clear whisper targets.
 *
 *  Note: The first available target ID is 1 as 0 is reserved for normal
 *  talking. Maximum target ID is 30.
 */
export interface VoiceTarget {
  /**
   *  Voice target ID.
   */
  id: number;
  /**
   *  The receivers that this voice target includes.
   */
  targets: VoiceTarget_Target[];
}

export interface VoiceTarget_Target {
  /**
   *  Users that are included as targets.
   */
  session: number[];
  /**
   *  Channel that is included as a target.
   */
  channelId: number;
  /**
   *  ACL group that is included as a target.
   */
  group: string;
  /**
   *  True if the voice should follow links from the specified channel.
   */
  links: boolean;
  /**
   *  True if the voice should also be sent to children of the specific
   *  channel.
   */
  children: boolean;
}

/**
 *  Sent by the client when it wants permissions for a certain channel. Sent by
 *  the server when it replies to the query or wants the user to resync all
 *  channel permissions.
 */
export interface PermissionQuery {
  /**
   *  channel_id of the channel for which the permissions are queried.
   */
  channelId: number;
  /**
   *  Channel permissions.
   */
  permissions: number;
  /**
   *  True if the client should drop its current permission information for all
   *  channels.
   */
  flush: boolean;
}

/**
 *  Sent by the server to notify the users of the version of the CELT codec they
 *  should use. This may change during the connection when new users join.
 */
export interface CodecVersion {
  /**
   *  The version of the CELT Alpha codec.
   */
  alpha: number;
  /**
   *  The version of the CELT Beta codec.
   */
  beta: number;
  /**
   *  True if the user should prefer Alpha over Beta.
   */
  preferAlpha: boolean;
  opus: boolean;
}

/**
 *  Used to communicate user stats between the server and clients.
 */
export interface UserStats {
  /**
   *  User whose stats these are.
   */
  session: number;
  /**
   *  True if the message contains only mutable stats (packets, ping).
   */
  statsOnly: boolean;
  /**
   *  Full user certificate chain of the user certificate in DER format.
   */
  certificates: Uint8Array[];
  /**
   *  Packet statistics for packets received from the client.
   */
  fromClient: UserStats_Stats | undefined;
  /**
   *  Packet statistics for packets sent by the server.
   */
  fromServer: UserStats_Stats | undefined;
  /**
   *  Amount of UDP packets sent.
   */
  udpPackets: number;
  /**
   *  Amount of TCP packets sent.
   */
  tcpPackets: number;
  /**
   *  UDP ping average.
   */
  udpPingAvg: number;
  /**
   *  UDP ping variance.
   */
  udpPingVar: number;
  /**
   *  TCP ping average.
   */
  tcpPingAvg: number;
  /**
   *  TCP ping variance.
   */
  tcpPingVar: number;
  /**
   *  Client version.
   */
  version: Version | undefined;
  /**
   *  A list of CELT bitstream version constants supported by the client of this
   *  user.
   */
  celtVersions: number[];
  /**
   *  Client IP address.
   */
  address: Uint8Array;
  /**
   *  Bandwidth used by this client.
   */
  bandwidth: number;
  /**
   *  Connection duration.
   */
  onlinesecs: number;
  /**
   *  Duration since last activity.
   */
  idlesecs: number;
  /**
   *  True if the user has a strong certificate.
   */
  strongCertificate: boolean;
  opus: boolean;
}

export interface UserStats_Stats {
  /**
   *  The amount of good packets received.
   */
  good: number;
  /**
   *  The amount of late packets received.
   */
  late: number;
  /**
   *  The amount of packets never received.
   */
  lost: number;
  /**
   *  The amount of nonce resyncs.
   */
  resync: number;
}

/**
 *  Used by the client to request binary data from the server. By default large
 *  comments or textures are not sent within standard messages but instead the
 *  hash is. If the client does not recognize the hash it may request the
 *  resource when it needs it. The client does so by sending a RequestBlob
 *  message with the correct fields filled with the user sessions or channel_ids
 *  it wants to receive. The server replies to this by sending a new
 *  UserState/ChannelState message with the resources filled even if they would
 *  normally be transmitted as hashes.
 */
export interface RequestBlob {
  /**
   *  sessions of the requested UserState textures.
   */
  sessionTexture: number[];
  /**
   *  sessions of the requested UserState comments.
   */
  sessionComment: number[];
  /**
   *  channel_ids of the requested ChannelState descriptions.
   */
  channelDescription: number[];
}

/**
 *  Sent by the server when it informs the clients on server configuration
 *  details.
 */
export interface ServerConfig {
  /**
   *  The maximum bandwidth the clients should use.
   */
  maxBandwidth: number;
  /**
   *  Server welcome text.
   */
  welcomeText: string;
  /**
   *  True if the server allows HTML.
   */
  allowHtml: boolean;
  /**
   *  Maximum text message length.
   */
  messageLength: number;
  /**
   *  Maximum image message length.
   */
  imageMessageLength: number;
  /**
   *  The maximum number of users allowed on the server.
   */
  maxUsers: number;
}

/**
 *  Sent by the server to inform the clients of suggested client configuration
 *  specified by the server administrator.
 */
export interface SuggestConfig {
  /**
   *  Suggested client version.
   */
  version: number;
  /**
   *  True if the administrator suggests positional audio to be used on this
   *  server.
   */
  positional: boolean;
  /**
   *  True if the administrator suggests push to talk to be used on this server.
   */
  pushToTalk: boolean;
}

const baseVersion: object = {
  version: 0,
  release: '',
  os: '',
  osVersion: '',
};

const baseUDPTunnel: object = {};

const baseAuthenticate: object = {
  username: '',
  password: '',
  tokens: '',
  celtVersions: 0,
  opus: false,
};

const basePing: object = {
  timestamp: 0,
  good: 0,
  late: 0,
  lost: 0,
  resync: 0,
  udpPackets: 0,
  tcpPackets: 0,
  udpPingAvg: 0,
  udpPingVar: 0,
  tcpPingAvg: 0,
  tcpPingVar: 0,
};

const baseReject: object = {
  type: 0,
  reason: '',
};

const baseServerSync: object = {
  session: 0,
  maxBandwidth: 0,
  welcomeText: '',
  permissions: 0,
};

const baseChannelRemove: object = {
  channelId: 0,
};

const baseChannelState: object = {
  channelId: 0,
  parent: 0,
  name: '',
  links: 0,
  description: '',
  linksAdd: 0,
  linksRemove: 0,
  temporary: false,
  position: 0,
  maxUsers: 0,
  isEnterRestricted: false,
  canEnter: false,
};

const baseUserRemove: object = {
  session: 0,
  actor: 0,
  reason: '',
  ban: false,
};

const baseUserState: object = {
  session: 0,
  actor: 0,
  name: '',
  userId: 0,
  channelId: 0,
  mute: false,
  deaf: false,
  suppress: false,
  selfMute: false,
  selfDeaf: false,
  pluginIdentity: '',
  comment: '',
  hash: '',
  prioritySpeaker: false,
  recording: false,
  temporaryAccessTokens: '',
  listeningChannelAdd: 0,
  listeningChannelRemove: 0,
};

const baseBanList: object = {
  query: false,
};

const baseBanList_BanEntry: object = {
  mask: 0,
  name: '',
  hash: '',
  reason: '',
  start: '',
  duration: 0,
};

const baseTextMessage: object = {
  actor: 0,
  session: 0,
  channelId: 0,
  treeId: 0,
  message: '',
};

const basePermissionDenied: object = {
  permission: 0,
  channelId: 0,
  session: 0,
  reason: '',
  type: 0,
  name: '',
};

const baseACL: object = {
  channelId: 0,
  inheritAcls: false,
  query: false,
};

const baseACL_ChanGroup: object = {
  name: '',
  inherited: false,
  inherit: false,
  inheritable: false,
  add: 0,
  remove: 0,
  inheritedMembers: 0,
};

const baseACL_ChanACL: object = {
  applyHere: false,
  applySubs: false,
  inherited: false,
  userId: 0,
  group: '',
  grant: 0,
  deny: 0,
};

const baseQueryUsers: object = {
  ids: 0,
  names: '',
};

const baseCryptSetup: object = {};

const baseContextActionModify: object = {
  action: '',
  text: '',
  context: 0,
  operation: 0,
};

const baseContextAction: object = {
  session: 0,
  channelId: 0,
  action: '',
};

const baseUserList: object = {};

const baseUserList_User: object = {
  userId: 0,
  name: '',
  lastSeen: '',
  lastChannel: 0,
};

const baseVoiceTarget: object = {
  id: 0,
};

const baseVoiceTarget_Target: object = {
  session: 0,
  channelId: 0,
  group: '',
  links: false,
  children: false,
};

const basePermissionQuery: object = {
  channelId: 0,
  permissions: 0,
  flush: false,
};

const baseCodecVersion: object = {
  alpha: 0,
  beta: 0,
  preferAlpha: false,
  opus: false,
};

const baseUserStats: object = {
  session: 0,
  statsOnly: false,
  udpPackets: 0,
  tcpPackets: 0,
  udpPingAvg: 0,
  udpPingVar: 0,
  tcpPingAvg: 0,
  tcpPingVar: 0,
  celtVersions: 0,
  bandwidth: 0,
  onlinesecs: 0,
  idlesecs: 0,
  strongCertificate: false,
  opus: false,
};

const baseUserStats_Stats: object = {
  good: 0,
  late: 0,
  lost: 0,
  resync: 0,
};

const baseRequestBlob: object = {
  sessionTexture: 0,
  sessionComment: 0,
  channelDescription: 0,
};

const baseServerConfig: object = {
  maxBandwidth: 0,
  welcomeText: '',
  allowHtml: false,
  messageLength: 0,
  imageMessageLength: 0,
  maxUsers: 0,
};

const baseSuggestConfig: object = {
  version: 0,
  positional: false,
  pushToTalk: false,
};

function longToNumber(long: Long) {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error(
      'Value is larger than Number.MAX_SAFE_INTEGER'
    );
  }
  return long.toNumber();
}

export const protobufPackage = 'MumbleProto';

export enum Reject_RejectType {
  /** None -  The rejection reason is unknown (details should be available
   in Reject.reason).
   */
  None = 0,
  /** WrongVersion -  The client attempted to connect with an incompatible version.
   */
  WrongVersion = 1,
  /** InvalidUsername -  The user name supplied by the client was invalid.
   */
  InvalidUsername = 2,
  /** WrongUserPW -  The client attempted to authenticate as a user with a password but it
   was wrong.
   */
  WrongUserPW = 3,
  /** WrongServerPW -  The client attempted to connect to a passworded server but the password
   was wrong.
   */
  WrongServerPW = 4,
  /** UsernameInUse -  Supplied username is already in use.
   */
  UsernameInUse = 5,
  /** ServerFull -  Server is currently full and cannot accept more users.
   */
  ServerFull = 6,
  /** NoCertificate -  The user did not provide a certificate but one is required.
   */
  NoCertificate = 7,
  AuthenticatorFail = 8,
  UNRECOGNIZED = -1,
}

export function reject_RejectTypeFromJSON(
  object: any
): Reject_RejectType {
  switch (object) {
    case 0:
    case 'None':
      return Reject_RejectType.None;
    case 1:
    case 'WrongVersion':
      return Reject_RejectType.WrongVersion;
    case 2:
    case 'InvalidUsername':
      return Reject_RejectType.InvalidUsername;
    case 3:
    case 'WrongUserPW':
      return Reject_RejectType.WrongUserPW;
    case 4:
    case 'WrongServerPW':
      return Reject_RejectType.WrongServerPW;
    case 5:
    case 'UsernameInUse':
      return Reject_RejectType.UsernameInUse;
    case 6:
    case 'ServerFull':
      return Reject_RejectType.ServerFull;
    case 7:
    case 'NoCertificate':
      return Reject_RejectType.NoCertificate;
    case 8:
    case 'AuthenticatorFail':
      return Reject_RejectType.AuthenticatorFail;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Reject_RejectType.UNRECOGNIZED;
  }
}

export function reject_RejectTypeToJSON(
  object: Reject_RejectType
): string {
  switch (object) {
    case Reject_RejectType.None:
      return 'None';
    case Reject_RejectType.WrongVersion:
      return 'WrongVersion';
    case Reject_RejectType.InvalidUsername:
      return 'InvalidUsername';
    case Reject_RejectType.WrongUserPW:
      return 'WrongUserPW';
    case Reject_RejectType.WrongServerPW:
      return 'WrongServerPW';
    case Reject_RejectType.UsernameInUse:
      return 'UsernameInUse';
    case Reject_RejectType.ServerFull:
      return 'ServerFull';
    case Reject_RejectType.NoCertificate:
      return 'NoCertificate';
    case Reject_RejectType.AuthenticatorFail:
      return 'AuthenticatorFail';
    default:
      return 'UNKNOWN';
  }
}

export enum PermissionDenied_DenyType {
  /** Text -  Operation denied for other reason, see reason field.
   */
  Text = 0,
  /** Permission -  Permissions were denied.
   */
  Permission = 1,
  /** SuperUser -  Cannot modify SuperUser.
   */
  SuperUser = 2,
  /** ChannelName -  Invalid channel name.
   */
  ChannelName = 3,
  /** TextTooLong -  Text message too long.
   */
  TextTooLong = 4,
  /** H9K -  The flux capacitor was spelled wrong.
   */
  H9K = 5,
  /** TemporaryChannel -  Operation not permitted in temporary channel.
   */
  TemporaryChannel = 6,
  /** MissingCertificate -  Operation requires certificate.
   */
  MissingCertificate = 7,
  /** UserName -  Invalid username.
   */
  UserName = 8,
  /** ChannelFull -  Channel is full.
   */
  ChannelFull = 9,
  /** NestingLimit -  Channels are nested too deeply.
   */
  NestingLimit = 10,
  /** ChannelCountLimit -  Maximum channel count reached.
   */
  ChannelCountLimit = 11,
  /** ChannelListenerLimit -  Amount of listener objects for this channel has been reached
   */
  ChannelListenerLimit = 12,
  /** UserListenerLimit -  Amount of listener proxies for the user has been reached
   */
  UserListenerLimit = 13,
  UNRECOGNIZED = -1,
}

export function permissionDenied_DenyTypeFromJSON(
  object: any
): PermissionDenied_DenyType {
  switch (object) {
    case 0:
    case 'Text':
      return PermissionDenied_DenyType.Text;
    case 1:
    case 'Permission':
      return PermissionDenied_DenyType.Permission;
    case 2:
    case 'SuperUser':
      return PermissionDenied_DenyType.SuperUser;
    case 3:
    case 'ChannelName':
      return PermissionDenied_DenyType.ChannelName;
    case 4:
    case 'TextTooLong':
      return PermissionDenied_DenyType.TextTooLong;
    case 5:
    case 'H9K':
      return PermissionDenied_DenyType.H9K;
    case 6:
    case 'TemporaryChannel':
      return PermissionDenied_DenyType.TemporaryChannel;
    case 7:
    case 'MissingCertificate':
      return PermissionDenied_DenyType.MissingCertificate;
    case 8:
    case 'UserName':
      return PermissionDenied_DenyType.UserName;
    case 9:
    case 'ChannelFull':
      return PermissionDenied_DenyType.ChannelFull;
    case 10:
    case 'NestingLimit':
      return PermissionDenied_DenyType.NestingLimit;
    case 11:
    case 'ChannelCountLimit':
      return PermissionDenied_DenyType.ChannelCountLimit;
    case 12:
    case 'ChannelListenerLimit':
      return PermissionDenied_DenyType.ChannelListenerLimit;
    case 13:
    case 'UserListenerLimit':
      return PermissionDenied_DenyType.UserListenerLimit;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return PermissionDenied_DenyType.UNRECOGNIZED;
  }
}

export function permissionDenied_DenyTypeToJSON(
  object: PermissionDenied_DenyType
): string {
  switch (object) {
    case PermissionDenied_DenyType.Text:
      return 'Text';
    case PermissionDenied_DenyType.Permission:
      return 'Permission';
    case PermissionDenied_DenyType.SuperUser:
      return 'SuperUser';
    case PermissionDenied_DenyType.ChannelName:
      return 'ChannelName';
    case PermissionDenied_DenyType.TextTooLong:
      return 'TextTooLong';
    case PermissionDenied_DenyType.H9K:
      return 'H9K';
    case PermissionDenied_DenyType.TemporaryChannel:
      return 'TemporaryChannel';
    case PermissionDenied_DenyType.MissingCertificate:
      return 'MissingCertificate';
    case PermissionDenied_DenyType.UserName:
      return 'UserName';
    case PermissionDenied_DenyType.ChannelFull:
      return 'ChannelFull';
    case PermissionDenied_DenyType.NestingLimit:
      return 'NestingLimit';
    case PermissionDenied_DenyType.ChannelCountLimit:
      return 'ChannelCountLimit';
    case PermissionDenied_DenyType.ChannelListenerLimit:
      return 'ChannelListenerLimit';
    case PermissionDenied_DenyType.UserListenerLimit:
      return 'UserListenerLimit';
    default:
      return 'UNKNOWN';
  }
}

export enum ContextActionModify_Context {
  /** Server -  Action is applicable to the server.
   */
  Server = 1,
  /** Channel -  Action can target a Channel.
   */
  Channel = 2,
  /** User -  Action can target a User.
   */
  User = 4,
  UNRECOGNIZED = -1,
}

export function contextActionModify_ContextFromJSON(
  object: any
): ContextActionModify_Context {
  switch (object) {
    case 1:
    case 'Server':
      return ContextActionModify_Context.Server;
    case 2:
    case 'Channel':
      return ContextActionModify_Context.Channel;
    case 4:
    case 'User':
      return ContextActionModify_Context.User;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ContextActionModify_Context.UNRECOGNIZED;
  }
}

export function contextActionModify_ContextToJSON(
  object: ContextActionModify_Context
): string {
  switch (object) {
    case ContextActionModify_Context.Server:
      return 'Server';
    case ContextActionModify_Context.Channel:
      return 'Channel';
    case ContextActionModify_Context.User:
      return 'User';
    default:
      return 'UNKNOWN';
  }
}

export enum ContextActionModify_Operation {
  Add = 0,
  Remove = 1,
  UNRECOGNIZED = -1,
}

export function contextActionModify_OperationFromJSON(
  object: any
): ContextActionModify_Operation {
  switch (object) {
    case 0:
    case 'Add':
      return ContextActionModify_Operation.Add;
    case 1:
    case 'Remove':
      return ContextActionModify_Operation.Remove;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ContextActionModify_Operation.UNRECOGNIZED;
  }
}

export function contextActionModify_OperationToJSON(
  object: ContextActionModify_Operation
): string {
  switch (object) {
    case ContextActionModify_Operation.Add:
      return 'Add';
    case ContextActionModify_Operation.Remove:
      return 'Remove';
    default:
      return 'UNKNOWN';
  }
}

export const Version = {
  encode(message: Version, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).uint32(message.version);
    writer.uint32(18).string(message.release);
    writer.uint32(26).string(message.os);
    writer.uint32(34).string(message.osVersion);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Version {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseVersion } as Version;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        case 2:
          message.release = reader.string();
          break;
        case 3:
          message.os = reader.string();
          break;
        case 4:
          message.osVersion = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Version {
    const message = { ...baseVersion } as Version;
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version);
    } else {
      message.version = 0;
    }
    if (object.release !== undefined && object.release !== null) {
      message.release = String(object.release);
    } else {
      message.release = '';
    }
    if (object.os !== undefined && object.os !== null) {
      message.os = String(object.os);
    } else {
      message.os = '';
    }
    if (object.osVersion !== undefined && object.osVersion !== null) {
      message.osVersion = String(object.osVersion);
    } else {
      message.osVersion = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Version>): Version {
    const message = { ...baseVersion } as Version;
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    } else {
      message.version = 0;
    }
    if (object.release !== undefined && object.release !== null) {
      message.release = object.release;
    } else {
      message.release = '';
    }
    if (object.os !== undefined && object.os !== null) {
      message.os = object.os;
    } else {
      message.os = '';
    }
    if (object.osVersion !== undefined && object.osVersion !== null) {
      message.osVersion = object.osVersion;
    } else {
      message.osVersion = '';
    }
    return message;
  },
  toJSON(message: Version): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    message.release !== undefined && (obj.release = message.release);
    message.os !== undefined && (obj.os = message.os);
    message.osVersion !== undefined &&
      (obj.osVersion = message.osVersion);
    return obj;
  },
};

export const UDPTunnel = {
  encode(
    message: UDPTunnel,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).bytes(message.packet);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UDPTunnel {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUDPTunnel } as UDPTunnel;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.packet = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UDPTunnel {
    const message = { ...baseUDPTunnel } as UDPTunnel;
    if (object.packet !== undefined && object.packet !== null) {
      message.packet = bytesFromBase64(object.packet);
    }
    return message;
  },
  fromPartial(object: DeepPartial<UDPTunnel>): UDPTunnel {
    const message = { ...baseUDPTunnel } as UDPTunnel;
    if (object.packet !== undefined && object.packet !== null) {
      message.packet = object.packet;
    } else {
      message.packet = new Uint8Array();
    }
    return message;
  },
  toJSON(message: UDPTunnel): unknown {
    const obj: any = {};
    message.packet !== undefined &&
      (obj.packet = base64FromBytes(
        message.packet !== undefined
          ? message.packet
          : new Uint8Array()
      ));
    return obj;
  },
};

export const Authenticate = {
  encode(
    message: Authenticate,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).string(message.username);
    writer.uint32(18).string(message.password);
    for (const v of message.tokens) {
      writer.uint32(26).string(v!);
    }
    writer.uint32(34).fork();
    for (const v of message.celtVersions) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(40).bool(message.opus);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Authenticate {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthenticate } as Authenticate;
    message.tokens = [];
    message.celtVersions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.password = reader.string();
          break;
        case 3:
          message.tokens.push(reader.string());
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.celtVersions.push(reader.int32());
            }
          } else {
            message.celtVersions.push(reader.int32());
          }
          break;
        case 5:
          message.opus = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Authenticate {
    const message = { ...baseAuthenticate } as Authenticate;
    message.tokens = [];
    message.celtVersions = [];
    if (object.username !== undefined && object.username !== null) {
      message.username = String(object.username);
    } else {
      message.username = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    } else {
      message.password = '';
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      for (const e of object.tokens) {
        message.tokens.push(String(e));
      }
    }
    if (
      object.celtVersions !== undefined &&
      object.celtVersions !== null
    ) {
      for (const e of object.celtVersions) {
        message.celtVersions.push(Number(e));
      }
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = Boolean(object.opus);
    } else {
      message.opus = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Authenticate>): Authenticate {
    const message = { ...baseAuthenticate } as Authenticate;
    message.tokens = [];
    message.celtVersions = [];
    if (object.username !== undefined && object.username !== null) {
      message.username = object.username;
    } else {
      message.username = '';
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    } else {
      message.password = '';
    }
    if (object.tokens !== undefined && object.tokens !== null) {
      for (const e of object.tokens) {
        message.tokens.push(e);
      }
    }
    if (
      object.celtVersions !== undefined &&
      object.celtVersions !== null
    ) {
      for (const e of object.celtVersions) {
        message.celtVersions.push(e);
      }
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = object.opus;
    } else {
      message.opus = false;
    }
    return message;
  },
  toJSON(message: Authenticate): unknown {
    const obj: any = {};
    message.username !== undefined &&
      (obj.username = message.username);
    message.password !== undefined &&
      (obj.password = message.password);
    if (message.tokens) {
      obj.tokens = message.tokens.map((e) => e);
    } else {
      obj.tokens = [];
    }
    if (message.celtVersions) {
      obj.celtVersions = message.celtVersions.map((e) => e);
    } else {
      obj.celtVersions = [];
    }
    message.opus !== undefined && (obj.opus = message.opus);
    return obj;
  },
};

export const Ping = {
  encode(message: Ping, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).uint64(message.timestamp);
    writer.uint32(16).uint32(message.good);
    writer.uint32(24).uint32(message.late);
    writer.uint32(32).uint32(message.lost);
    writer.uint32(40).uint32(message.resync);
    writer.uint32(48).uint32(message.udpPackets);
    writer.uint32(56).uint32(message.tcpPackets);
    writer.uint32(69).float(message.udpPingAvg);
    writer.uint32(77).float(message.udpPingVar);
    writer.uint32(85).float(message.tcpPingAvg);
    writer.uint32(93).float(message.tcpPingVar);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Ping {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePing } as Ping;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.good = reader.uint32();
          break;
        case 3:
          message.late = reader.uint32();
          break;
        case 4:
          message.lost = reader.uint32();
          break;
        case 5:
          message.resync = reader.uint32();
          break;
        case 6:
          message.udpPackets = reader.uint32();
          break;
        case 7:
          message.tcpPackets = reader.uint32();
          break;
        case 8:
          message.udpPingAvg = reader.float();
          break;
        case 9:
          message.udpPingVar = reader.float();
          break;
        case 10:
          message.tcpPingAvg = reader.float();
          break;
        case 11:
          message.tcpPingVar = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Ping {
    const message = { ...basePing } as Ping;
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = Number(object.timestamp);
    } else {
      message.timestamp = 0;
    }
    if (object.good !== undefined && object.good !== null) {
      message.good = Number(object.good);
    } else {
      message.good = 0;
    }
    if (object.late !== undefined && object.late !== null) {
      message.late = Number(object.late);
    } else {
      message.late = 0;
    }
    if (object.lost !== undefined && object.lost !== null) {
      message.lost = Number(object.lost);
    } else {
      message.lost = 0;
    }
    if (object.resync !== undefined && object.resync !== null) {
      message.resync = Number(object.resync);
    } else {
      message.resync = 0;
    }
    if (
      object.udpPackets !== undefined &&
      object.udpPackets !== null
    ) {
      message.udpPackets = Number(object.udpPackets);
    } else {
      message.udpPackets = 0;
    }
    if (
      object.tcpPackets !== undefined &&
      object.tcpPackets !== null
    ) {
      message.tcpPackets = Number(object.tcpPackets);
    } else {
      message.tcpPackets = 0;
    }
    if (
      object.udpPingAvg !== undefined &&
      object.udpPingAvg !== null
    ) {
      message.udpPingAvg = Number(object.udpPingAvg);
    } else {
      message.udpPingAvg = 0;
    }
    if (
      object.udpPingVar !== undefined &&
      object.udpPingVar !== null
    ) {
      message.udpPingVar = Number(object.udpPingVar);
    } else {
      message.udpPingVar = 0;
    }
    if (
      object.tcpPingAvg !== undefined &&
      object.tcpPingAvg !== null
    ) {
      message.tcpPingAvg = Number(object.tcpPingAvg);
    } else {
      message.tcpPingAvg = 0;
    }
    if (
      object.tcpPingVar !== undefined &&
      object.tcpPingVar !== null
    ) {
      message.tcpPingVar = Number(object.tcpPingVar);
    } else {
      message.tcpPingVar = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Ping>): Ping {
    const message = { ...basePing } as Ping;
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = object.timestamp;
    } else {
      message.timestamp = 0;
    }
    if (object.good !== undefined && object.good !== null) {
      message.good = object.good;
    } else {
      message.good = 0;
    }
    if (object.late !== undefined && object.late !== null) {
      message.late = object.late;
    } else {
      message.late = 0;
    }
    if (object.lost !== undefined && object.lost !== null) {
      message.lost = object.lost;
    } else {
      message.lost = 0;
    }
    if (object.resync !== undefined && object.resync !== null) {
      message.resync = object.resync;
    } else {
      message.resync = 0;
    }
    if (
      object.udpPackets !== undefined &&
      object.udpPackets !== null
    ) {
      message.udpPackets = object.udpPackets;
    } else {
      message.udpPackets = 0;
    }
    if (
      object.tcpPackets !== undefined &&
      object.tcpPackets !== null
    ) {
      message.tcpPackets = object.tcpPackets;
    } else {
      message.tcpPackets = 0;
    }
    if (
      object.udpPingAvg !== undefined &&
      object.udpPingAvg !== null
    ) {
      message.udpPingAvg = object.udpPingAvg;
    } else {
      message.udpPingAvg = 0;
    }
    if (
      object.udpPingVar !== undefined &&
      object.udpPingVar !== null
    ) {
      message.udpPingVar = object.udpPingVar;
    } else {
      message.udpPingVar = 0;
    }
    if (
      object.tcpPingAvg !== undefined &&
      object.tcpPingAvg !== null
    ) {
      message.tcpPingAvg = object.tcpPingAvg;
    } else {
      message.tcpPingAvg = 0;
    }
    if (
      object.tcpPingVar !== undefined &&
      object.tcpPingVar !== null
    ) {
      message.tcpPingVar = object.tcpPingVar;
    } else {
      message.tcpPingVar = 0;
    }
    return message;
  },
  toJSON(message: Ping): unknown {
    const obj: any = {};
    message.timestamp !== undefined &&
      (obj.timestamp = message.timestamp);
    message.good !== undefined && (obj.good = message.good);
    message.late !== undefined && (obj.late = message.late);
    message.lost !== undefined && (obj.lost = message.lost);
    message.resync !== undefined && (obj.resync = message.resync);
    message.udpPackets !== undefined &&
      (obj.udpPackets = message.udpPackets);
    message.tcpPackets !== undefined &&
      (obj.tcpPackets = message.tcpPackets);
    message.udpPingAvg !== undefined &&
      (obj.udpPingAvg = message.udpPingAvg);
    message.udpPingVar !== undefined &&
      (obj.udpPingVar = message.udpPingVar);
    message.tcpPingAvg !== undefined &&
      (obj.tcpPingAvg = message.tcpPingAvg);
    message.tcpPingVar !== undefined &&
      (obj.tcpPingVar = message.tcpPingVar);
    return obj;
  },
};

export const Reject = {
  encode(message: Reject, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.type);
    writer.uint32(18).string(message.reason);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Reject {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReject } as Reject;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.reason = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Reject {
    const message = { ...baseReject } as Reject;
    if (object.type !== undefined && object.type !== null) {
      message.type = reject_RejectTypeFromJSON(object.type);
    } else {
      message.type = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = String(object.reason);
    } else {
      message.reason = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<Reject>): Reject {
    const message = { ...baseReject } as Reject;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = object.reason;
    } else {
      message.reason = '';
    }
    return message;
  },
  toJSON(message: Reject): unknown {
    const obj: any = {};
    message.type !== undefined &&
      (obj.type = reject_RejectTypeToJSON(message.type));
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },
};

export const ServerSync = {
  encode(
    message: ServerSync,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.session);
    writer.uint32(16).uint32(message.maxBandwidth);
    writer.uint32(26).string(message.welcomeText);
    writer.uint32(32).uint64(message.permissions);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ServerSync {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseServerSync } as ServerSync;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = reader.uint32();
          break;
        case 2:
          message.maxBandwidth = reader.uint32();
          break;
        case 3:
          message.welcomeText = reader.string();
          break;
        case 4:
          message.permissions = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ServerSync {
    const message = { ...baseServerSync } as ServerSync;
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (
      object.maxBandwidth !== undefined &&
      object.maxBandwidth !== null
    ) {
      message.maxBandwidth = Number(object.maxBandwidth);
    } else {
      message.maxBandwidth = 0;
    }
    if (
      object.welcomeText !== undefined &&
      object.welcomeText !== null
    ) {
      message.welcomeText = String(object.welcomeText);
    } else {
      message.welcomeText = '';
    }
    if (
      object.permissions !== undefined &&
      object.permissions !== null
    ) {
      message.permissions = Number(object.permissions);
    } else {
      message.permissions = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ServerSync>): ServerSync {
    const message = { ...baseServerSync } as ServerSync;
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (
      object.maxBandwidth !== undefined &&
      object.maxBandwidth !== null
    ) {
      message.maxBandwidth = object.maxBandwidth;
    } else {
      message.maxBandwidth = 0;
    }
    if (
      object.welcomeText !== undefined &&
      object.welcomeText !== null
    ) {
      message.welcomeText = object.welcomeText;
    } else {
      message.welcomeText = '';
    }
    if (
      object.permissions !== undefined &&
      object.permissions !== null
    ) {
      message.permissions = object.permissions;
    } else {
      message.permissions = 0;
    }
    return message;
  },
  toJSON(message: ServerSync): unknown {
    const obj: any = {};
    message.session !== undefined && (obj.session = message.session);
    message.maxBandwidth !== undefined &&
      (obj.maxBandwidth = message.maxBandwidth);
    message.welcomeText !== undefined &&
      (obj.welcomeText = message.welcomeText);
    message.permissions !== undefined &&
      (obj.permissions = message.permissions);
    return obj;
  },
};

export const ChannelRemove = {
  encode(
    message: ChannelRemove,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.channelId);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ChannelRemove {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseChannelRemove } as ChannelRemove;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ChannelRemove {
    const message = { ...baseChannelRemove } as ChannelRemove;
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ChannelRemove>): ChannelRemove {
    const message = { ...baseChannelRemove } as ChannelRemove;
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    return message;
  },
  toJSON(message: ChannelRemove): unknown {
    const obj: any = {};
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    return obj;
  },
};

export const ChannelState = {
  encode(
    message: ChannelState,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.channelId);
    writer.uint32(16).uint32(message.parent);
    writer.uint32(26).string(message.name);
    writer.uint32(34).fork();
    for (const v of message.links) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(42).string(message.description);
    writer.uint32(50).fork();
    for (const v of message.linksAdd) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(58).fork();
    for (const v of message.linksRemove) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(64).bool(message.temporary);
    writer.uint32(72).int32(message.position);
    writer.uint32(82).bytes(message.descriptionHash);
    writer.uint32(88).uint32(message.maxUsers);
    writer.uint32(96).bool(message.isEnterRestricted);
    writer.uint32(104).bool(message.canEnter);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ChannelState {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseChannelState } as ChannelState;
    message.links = [];
    message.linksAdd = [];
    message.linksRemove = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.uint32();
          break;
        case 2:
          message.parent = reader.uint32();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.links.push(reader.uint32());
            }
          } else {
            message.links.push(reader.uint32());
          }
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.linksAdd.push(reader.uint32());
            }
          } else {
            message.linksAdd.push(reader.uint32());
          }
          break;
        case 7:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.linksRemove.push(reader.uint32());
            }
          } else {
            message.linksRemove.push(reader.uint32());
          }
          break;
        case 8:
          message.temporary = reader.bool();
          break;
        case 9:
          message.position = reader.int32();
          break;
        case 10:
          message.descriptionHash = reader.bytes();
          break;
        case 11:
          message.maxUsers = reader.uint32();
          break;
        case 12:
          message.isEnterRestricted = reader.bool();
          break;
        case 13:
          message.canEnter = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ChannelState {
    const message = { ...baseChannelState } as ChannelState;
    message.links = [];
    message.linksAdd = [];
    message.linksRemove = [];
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = Number(object.parent);
    } else {
      message.parent = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.links !== undefined && object.links !== null) {
      for (const e of object.links) {
        message.links.push(Number(e));
      }
    }
    if (
      object.description !== undefined &&
      object.description !== null
    ) {
      message.description = String(object.description);
    } else {
      message.description = '';
    }
    if (object.linksAdd !== undefined && object.linksAdd !== null) {
      for (const e of object.linksAdd) {
        message.linksAdd.push(Number(e));
      }
    }
    if (
      object.linksRemove !== undefined &&
      object.linksRemove !== null
    ) {
      for (const e of object.linksRemove) {
        message.linksRemove.push(Number(e));
      }
    }
    if (object.temporary !== undefined && object.temporary !== null) {
      message.temporary = Boolean(object.temporary);
    } else {
      message.temporary = false;
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Number(object.position);
    } else {
      message.position = 0;
    }
    if (
      object.descriptionHash !== undefined &&
      object.descriptionHash !== null
    ) {
      message.descriptionHash = bytesFromBase64(
        object.descriptionHash
      );
    }
    if (object.maxUsers !== undefined && object.maxUsers !== null) {
      message.maxUsers = Number(object.maxUsers);
    } else {
      message.maxUsers = 0;
    }
    if (
      object.isEnterRestricted !== undefined &&
      object.isEnterRestricted !== null
    ) {
      message.isEnterRestricted = Boolean(object.isEnterRestricted);
    } else {
      message.isEnterRestricted = false;
    }
    if (object.canEnter !== undefined && object.canEnter !== null) {
      message.canEnter = Boolean(object.canEnter);
    } else {
      message.canEnter = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ChannelState>): ChannelState {
    const message = { ...baseChannelState } as ChannelState;
    message.links = [];
    message.linksAdd = [];
    message.linksRemove = [];
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = object.parent;
    } else {
      message.parent = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.links !== undefined && object.links !== null) {
      for (const e of object.links) {
        message.links.push(e);
      }
    }
    if (
      object.description !== undefined &&
      object.description !== null
    ) {
      message.description = object.description;
    } else {
      message.description = '';
    }
    if (object.linksAdd !== undefined && object.linksAdd !== null) {
      for (const e of object.linksAdd) {
        message.linksAdd.push(e);
      }
    }
    if (
      object.linksRemove !== undefined &&
      object.linksRemove !== null
    ) {
      for (const e of object.linksRemove) {
        message.linksRemove.push(e);
      }
    }
    if (object.temporary !== undefined && object.temporary !== null) {
      message.temporary = object.temporary;
    } else {
      message.temporary = false;
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position;
    } else {
      message.position = 0;
    }
    if (
      object.descriptionHash !== undefined &&
      object.descriptionHash !== null
    ) {
      message.descriptionHash = object.descriptionHash;
    } else {
      message.descriptionHash = new Uint8Array();
    }
    if (object.maxUsers !== undefined && object.maxUsers !== null) {
      message.maxUsers = object.maxUsers;
    } else {
      message.maxUsers = 0;
    }
    if (
      object.isEnterRestricted !== undefined &&
      object.isEnterRestricted !== null
    ) {
      message.isEnterRestricted = object.isEnterRestricted;
    } else {
      message.isEnterRestricted = false;
    }
    if (object.canEnter !== undefined && object.canEnter !== null) {
      message.canEnter = object.canEnter;
    } else {
      message.canEnter = false;
    }
    return message;
  },
  toJSON(message: ChannelState): unknown {
    const obj: any = {};
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.parent !== undefined && (obj.parent = message.parent);
    message.name !== undefined && (obj.name = message.name);
    if (message.links) {
      obj.links = message.links.map((e) => e);
    } else {
      obj.links = [];
    }
    message.description !== undefined &&
      (obj.description = message.description);
    if (message.linksAdd) {
      obj.linksAdd = message.linksAdd.map((e) => e);
    } else {
      obj.linksAdd = [];
    }
    if (message.linksRemove) {
      obj.linksRemove = message.linksRemove.map((e) => e);
    } else {
      obj.linksRemove = [];
    }
    message.temporary !== undefined &&
      (obj.temporary = message.temporary);
    message.position !== undefined &&
      (obj.position = message.position);
    message.descriptionHash !== undefined &&
      (obj.descriptionHash = base64FromBytes(
        message.descriptionHash !== undefined
          ? message.descriptionHash
          : new Uint8Array()
      ));
    message.maxUsers !== undefined &&
      (obj.maxUsers = message.maxUsers);
    message.isEnterRestricted !== undefined &&
      (obj.isEnterRestricted = message.isEnterRestricted);
    message.canEnter !== undefined &&
      (obj.canEnter = message.canEnter);
    return obj;
  },
};

export const UserRemove = {
  encode(
    message: UserRemove,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.session);
    writer.uint32(16).uint32(message.actor);
    writer.uint32(26).string(message.reason);
    writer.uint32(32).bool(message.ban);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UserRemove {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserRemove } as UserRemove;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = reader.uint32();
          break;
        case 2:
          message.actor = reader.uint32();
          break;
        case 3:
          message.reason = reader.string();
          break;
        case 4:
          message.ban = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserRemove {
    const message = { ...baseUserRemove } as UserRemove;
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = Number(object.actor);
    } else {
      message.actor = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = String(object.reason);
    } else {
      message.reason = '';
    }
    if (object.ban !== undefined && object.ban !== null) {
      message.ban = Boolean(object.ban);
    } else {
      message.ban = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserRemove>): UserRemove {
    const message = { ...baseUserRemove } as UserRemove;
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = object.actor;
    } else {
      message.actor = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = object.reason;
    } else {
      message.reason = '';
    }
    if (object.ban !== undefined && object.ban !== null) {
      message.ban = object.ban;
    } else {
      message.ban = false;
    }
    return message;
  },
  toJSON(message: UserRemove): unknown {
    const obj: any = {};
    message.session !== undefined && (obj.session = message.session);
    message.actor !== undefined && (obj.actor = message.actor);
    message.reason !== undefined && (obj.reason = message.reason);
    message.ban !== undefined && (obj.ban = message.ban);
    return obj;
  },
};

export const UserState = {
  encode(
    message: UserState,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.session);
    writer.uint32(16).uint32(message.actor);
    writer.uint32(26).string(message.name);
    writer.uint32(32).uint32(message.userId);
    writer.uint32(40).uint32(message.channelId);
    writer.uint32(48).bool(message.mute);
    writer.uint32(56).bool(message.deaf);
    writer.uint32(64).bool(message.suppress);
    writer.uint32(72).bool(message.selfMute);
    writer.uint32(80).bool(message.selfDeaf);
    writer.uint32(90).bytes(message.texture);
    writer.uint32(98).bytes(message.pluginContext);
    writer.uint32(106).string(message.pluginIdentity);
    writer.uint32(114).string(message.comment);
    writer.uint32(122).string(message.hash);
    writer.uint32(130).bytes(message.commentHash);
    writer.uint32(138).bytes(message.textureHash);
    writer.uint32(144).bool(message.prioritySpeaker);
    writer.uint32(152).bool(message.recording);
    for (const v of message.temporaryAccessTokens) {
      writer.uint32(162).string(v!);
    }
    writer.uint32(170).fork();
    for (const v of message.listeningChannelAdd) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(178).fork();
    for (const v of message.listeningChannelRemove) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UserState {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserState } as UserState;
    message.temporaryAccessTokens = [];
    message.listeningChannelAdd = [];
    message.listeningChannelRemove = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = reader.uint32();
          break;
        case 2:
          message.actor = reader.uint32();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.userId = reader.uint32();
          break;
        case 5:
          message.channelId = reader.uint32();
          break;
        case 6:
          message.mute = reader.bool();
          break;
        case 7:
          message.deaf = reader.bool();
          break;
        case 8:
          message.suppress = reader.bool();
          break;
        case 9:
          message.selfMute = reader.bool();
          break;
        case 10:
          message.selfDeaf = reader.bool();
          break;
        case 11:
          message.texture = reader.bytes();
          break;
        case 12:
          message.pluginContext = reader.bytes();
          break;
        case 13:
          message.pluginIdentity = reader.string();
          break;
        case 14:
          message.comment = reader.string();
          break;
        case 15:
          message.hash = reader.string();
          break;
        case 16:
          message.commentHash = reader.bytes();
          break;
        case 17:
          message.textureHash = reader.bytes();
          break;
        case 18:
          message.prioritySpeaker = reader.bool();
          break;
        case 19:
          message.recording = reader.bool();
          break;
        case 20:
          message.temporaryAccessTokens.push(reader.string());
          break;
        case 21:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.listeningChannelAdd.push(reader.uint32());
            }
          } else {
            message.listeningChannelAdd.push(reader.uint32());
          }
          break;
        case 22:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.listeningChannelRemove.push(reader.uint32());
            }
          } else {
            message.listeningChannelRemove.push(reader.uint32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserState {
    const message = { ...baseUserState } as UserState;
    message.temporaryAccessTokens = [];
    message.listeningChannelAdd = [];
    message.listeningChannelRemove = [];
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = Number(object.actor);
    } else {
      message.actor = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = Number(object.userId);
    } else {
      message.userId = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (object.mute !== undefined && object.mute !== null) {
      message.mute = Boolean(object.mute);
    } else {
      message.mute = false;
    }
    if (object.deaf !== undefined && object.deaf !== null) {
      message.deaf = Boolean(object.deaf);
    } else {
      message.deaf = false;
    }
    if (object.suppress !== undefined && object.suppress !== null) {
      message.suppress = Boolean(object.suppress);
    } else {
      message.suppress = false;
    }
    if (object.selfMute !== undefined && object.selfMute !== null) {
      message.selfMute = Boolean(object.selfMute);
    } else {
      message.selfMute = false;
    }
    if (object.selfDeaf !== undefined && object.selfDeaf !== null) {
      message.selfDeaf = Boolean(object.selfDeaf);
    } else {
      message.selfDeaf = false;
    }
    if (object.texture !== undefined && object.texture !== null) {
      message.texture = bytesFromBase64(object.texture);
    }
    if (
      object.pluginContext !== undefined &&
      object.pluginContext !== null
    ) {
      message.pluginContext = bytesFromBase64(object.pluginContext);
    }
    if (
      object.pluginIdentity !== undefined &&
      object.pluginIdentity !== null
    ) {
      message.pluginIdentity = String(object.pluginIdentity);
    } else {
      message.pluginIdentity = '';
    }
    if (object.comment !== undefined && object.comment !== null) {
      message.comment = String(object.comment);
    } else {
      message.comment = '';
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = String(object.hash);
    } else {
      message.hash = '';
    }
    if (
      object.commentHash !== undefined &&
      object.commentHash !== null
    ) {
      message.commentHash = bytesFromBase64(object.commentHash);
    }
    if (
      object.textureHash !== undefined &&
      object.textureHash !== null
    ) {
      message.textureHash = bytesFromBase64(object.textureHash);
    }
    if (
      object.prioritySpeaker !== undefined &&
      object.prioritySpeaker !== null
    ) {
      message.prioritySpeaker = Boolean(object.prioritySpeaker);
    } else {
      message.prioritySpeaker = false;
    }
    if (object.recording !== undefined && object.recording !== null) {
      message.recording = Boolean(object.recording);
    } else {
      message.recording = false;
    }
    if (
      object.temporaryAccessTokens !== undefined &&
      object.temporaryAccessTokens !== null
    ) {
      for (const e of object.temporaryAccessTokens) {
        message.temporaryAccessTokens.push(String(e));
      }
    }
    if (
      object.listeningChannelAdd !== undefined &&
      object.listeningChannelAdd !== null
    ) {
      for (const e of object.listeningChannelAdd) {
        message.listeningChannelAdd.push(Number(e));
      }
    }
    if (
      object.listeningChannelRemove !== undefined &&
      object.listeningChannelRemove !== null
    ) {
      for (const e of object.listeningChannelRemove) {
        message.listeningChannelRemove.push(Number(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserState>): UserState {
    const message = { ...baseUserState } as UserState;
    message.temporaryAccessTokens = [];
    message.listeningChannelAdd = [];
    message.listeningChannelRemove = [];
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = object.actor;
    } else {
      message.actor = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (object.mute !== undefined && object.mute !== null) {
      message.mute = object.mute;
    } else {
      message.mute = false;
    }
    if (object.deaf !== undefined && object.deaf !== null) {
      message.deaf = object.deaf;
    } else {
      message.deaf = false;
    }
    if (object.suppress !== undefined && object.suppress !== null) {
      message.suppress = object.suppress;
    } else {
      message.suppress = false;
    }
    if (object.selfMute !== undefined && object.selfMute !== null) {
      message.selfMute = object.selfMute;
    } else {
      message.selfMute = false;
    }
    if (object.selfDeaf !== undefined && object.selfDeaf !== null) {
      message.selfDeaf = object.selfDeaf;
    } else {
      message.selfDeaf = false;
    }
    if (object.texture !== undefined && object.texture !== null) {
      message.texture = object.texture;
    } else {
      message.texture = new Uint8Array();
    }
    if (
      object.pluginContext !== undefined &&
      object.pluginContext !== null
    ) {
      message.pluginContext = object.pluginContext;
    } else {
      message.pluginContext = new Uint8Array();
    }
    if (
      object.pluginIdentity !== undefined &&
      object.pluginIdentity !== null
    ) {
      message.pluginIdentity = object.pluginIdentity;
    } else {
      message.pluginIdentity = '';
    }
    if (object.comment !== undefined && object.comment !== null) {
      message.comment = object.comment;
    } else {
      message.comment = '';
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = object.hash;
    } else {
      message.hash = '';
    }
    if (
      object.commentHash !== undefined &&
      object.commentHash !== null
    ) {
      message.commentHash = object.commentHash;
    } else {
      message.commentHash = new Uint8Array();
    }
    if (
      object.textureHash !== undefined &&
      object.textureHash !== null
    ) {
      message.textureHash = object.textureHash;
    } else {
      message.textureHash = new Uint8Array();
    }
    if (
      object.prioritySpeaker !== undefined &&
      object.prioritySpeaker !== null
    ) {
      message.prioritySpeaker = object.prioritySpeaker;
    } else {
      message.prioritySpeaker = false;
    }
    if (object.recording !== undefined && object.recording !== null) {
      message.recording = object.recording;
    } else {
      message.recording = false;
    }
    if (
      object.temporaryAccessTokens !== undefined &&
      object.temporaryAccessTokens !== null
    ) {
      for (const e of object.temporaryAccessTokens) {
        message.temporaryAccessTokens.push(e);
      }
    }
    if (
      object.listeningChannelAdd !== undefined &&
      object.listeningChannelAdd !== null
    ) {
      for (const e of object.listeningChannelAdd) {
        message.listeningChannelAdd.push(e);
      }
    }
    if (
      object.listeningChannelRemove !== undefined &&
      object.listeningChannelRemove !== null
    ) {
      for (const e of object.listeningChannelRemove) {
        message.listeningChannelRemove.push(e);
      }
    }
    return message;
  },
  toJSON(message: UserState): unknown {
    const obj: any = {};
    message.session !== undefined && (obj.session = message.session);
    message.actor !== undefined && (obj.actor = message.actor);
    message.name !== undefined && (obj.name = message.name);
    message.userId !== undefined && (obj.userId = message.userId);
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.mute !== undefined && (obj.mute = message.mute);
    message.deaf !== undefined && (obj.deaf = message.deaf);
    message.suppress !== undefined &&
      (obj.suppress = message.suppress);
    message.selfMute !== undefined &&
      (obj.selfMute = message.selfMute);
    message.selfDeaf !== undefined &&
      (obj.selfDeaf = message.selfDeaf);
    message.texture !== undefined &&
      (obj.texture = base64FromBytes(
        message.texture !== undefined
          ? message.texture
          : new Uint8Array()
      ));
    message.pluginContext !== undefined &&
      (obj.pluginContext = base64FromBytes(
        message.pluginContext !== undefined
          ? message.pluginContext
          : new Uint8Array()
      ));
    message.pluginIdentity !== undefined &&
      (obj.pluginIdentity = message.pluginIdentity);
    message.comment !== undefined && (obj.comment = message.comment);
    message.hash !== undefined && (obj.hash = message.hash);
    message.commentHash !== undefined &&
      (obj.commentHash = base64FromBytes(
        message.commentHash !== undefined
          ? message.commentHash
          : new Uint8Array()
      ));
    message.textureHash !== undefined &&
      (obj.textureHash = base64FromBytes(
        message.textureHash !== undefined
          ? message.textureHash
          : new Uint8Array()
      ));
    message.prioritySpeaker !== undefined &&
      (obj.prioritySpeaker = message.prioritySpeaker);
    message.recording !== undefined &&
      (obj.recording = message.recording);
    if (message.temporaryAccessTokens) {
      obj.temporaryAccessTokens = message.temporaryAccessTokens.map(
        (e) => e
      );
    } else {
      obj.temporaryAccessTokens = [];
    }
    if (message.listeningChannelAdd) {
      obj.listeningChannelAdd = message.listeningChannelAdd.map(
        (e) => e
      );
    } else {
      obj.listeningChannelAdd = [];
    }
    if (message.listeningChannelRemove) {
      obj.listeningChannelRemove = message.listeningChannelRemove.map(
        (e) => e
      );
    } else {
      obj.listeningChannelRemove = [];
    }
    return obj;
  },
};

export const BanList = {
  encode(message: BanList, writer: Writer = Writer.create()): Writer {
    for (const v of message.bans) {
      BanList_BanEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(16).bool(message.query);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): BanList {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBanList } as BanList;
    message.bans = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bans.push(
            BanList_BanEntry.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.query = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BanList {
    const message = { ...baseBanList } as BanList;
    message.bans = [];
    if (object.bans !== undefined && object.bans !== null) {
      for (const e of object.bans) {
        message.bans.push(BanList_BanEntry.fromJSON(e));
      }
    }
    if (object.query !== undefined && object.query !== null) {
      message.query = Boolean(object.query);
    } else {
      message.query = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<BanList>): BanList {
    const message = { ...baseBanList } as BanList;
    message.bans = [];
    if (object.bans !== undefined && object.bans !== null) {
      for (const e of object.bans) {
        message.bans.push(BanList_BanEntry.fromPartial(e));
      }
    }
    if (object.query !== undefined && object.query !== null) {
      message.query = object.query;
    } else {
      message.query = false;
    }
    return message;
  },
  toJSON(message: BanList): unknown {
    const obj: any = {};
    if (message.bans) {
      obj.bans = message.bans.map((e) =>
        e ? BanList_BanEntry.toJSON(e) : undefined
      );
    } else {
      obj.bans = [];
    }
    message.query !== undefined && (obj.query = message.query);
    return obj;
  },
};

export const BanList_BanEntry = {
  encode(
    message: BanList_BanEntry,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).bytes(message.address);
    writer.uint32(16).uint32(message.mask);
    writer.uint32(26).string(message.name);
    writer.uint32(34).string(message.hash);
    writer.uint32(42).string(message.reason);
    writer.uint32(50).string(message.start);
    writer.uint32(56).uint32(message.duration);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): BanList_BanEntry {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBanList_BanEntry } as BanList_BanEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.bytes();
          break;
        case 2:
          message.mask = reader.uint32();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.hash = reader.string();
          break;
        case 5:
          message.reason = reader.string();
          break;
        case 6:
          message.start = reader.string();
          break;
        case 7:
          message.duration = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BanList_BanEntry {
    const message = { ...baseBanList_BanEntry } as BanList_BanEntry;
    if (object.address !== undefined && object.address !== null) {
      message.address = bytesFromBase64(object.address);
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = Number(object.mask);
    } else {
      message.mask = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = String(object.hash);
    } else {
      message.hash = '';
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = String(object.reason);
    } else {
      message.reason = '';
    }
    if (object.start !== undefined && object.start !== null) {
      message.start = String(object.start);
    } else {
      message.start = '';
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Number(object.duration);
    } else {
      message.duration = 0;
    }
    return message;
  },
  fromPartial(
    object: DeepPartial<BanList_BanEntry>
  ): BanList_BanEntry {
    const message = { ...baseBanList_BanEntry } as BanList_BanEntry;
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    } else {
      message.address = new Uint8Array();
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = object.mask;
    } else {
      message.mask = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = object.hash;
    } else {
      message.hash = '';
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = object.reason;
    } else {
      message.reason = '';
    }
    if (object.start !== undefined && object.start !== null) {
      message.start = object.start;
    } else {
      message.start = '';
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = object.duration;
    } else {
      message.duration = 0;
    }
    return message;
  },
  toJSON(message: BanList_BanEntry): unknown {
    const obj: any = {};
    message.address !== undefined &&
      (obj.address = base64FromBytes(
        message.address !== undefined
          ? message.address
          : new Uint8Array()
      ));
    message.mask !== undefined && (obj.mask = message.mask);
    message.name !== undefined && (obj.name = message.name);
    message.hash !== undefined && (obj.hash = message.hash);
    message.reason !== undefined && (obj.reason = message.reason);
    message.start !== undefined && (obj.start = message.start);
    message.duration !== undefined &&
      (obj.duration = message.duration);
    return obj;
  },
};

export const TextMessage = {
  encode(
    message: TextMessage,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.actor);
    writer.uint32(18).fork();
    for (const v of message.session) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.channelId) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(34).fork();
    for (const v of message.treeId) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(42).string(message.message);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): TextMessage {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTextMessage } as TextMessage;
    message.session = [];
    message.channelId = [];
    message.treeId = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.actor = reader.uint32();
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.session.push(reader.uint32());
            }
          } else {
            message.session.push(reader.uint32());
          }
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.channelId.push(reader.uint32());
            }
          } else {
            message.channelId.push(reader.uint32());
          }
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.treeId.push(reader.uint32());
            }
          } else {
            message.treeId.push(reader.uint32());
          }
          break;
        case 5:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TextMessage {
    const message = { ...baseTextMessage } as TextMessage;
    message.session = [];
    message.channelId = [];
    message.treeId = [];
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = Number(object.actor);
    } else {
      message.actor = 0;
    }
    if (object.session !== undefined && object.session !== null) {
      for (const e of object.session) {
        message.session.push(Number(e));
      }
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      for (const e of object.channelId) {
        message.channelId.push(Number(e));
      }
    }
    if (object.treeId !== undefined && object.treeId !== null) {
      for (const e of object.treeId) {
        message.treeId.push(Number(e));
      }
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    } else {
      message.message = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<TextMessage>): TextMessage {
    const message = { ...baseTextMessage } as TextMessage;
    message.session = [];
    message.channelId = [];
    message.treeId = [];
    if (object.actor !== undefined && object.actor !== null) {
      message.actor = object.actor;
    } else {
      message.actor = 0;
    }
    if (object.session !== undefined && object.session !== null) {
      for (const e of object.session) {
        message.session.push(e);
      }
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      for (const e of object.channelId) {
        message.channelId.push(e);
      }
    }
    if (object.treeId !== undefined && object.treeId !== null) {
      for (const e of object.treeId) {
        message.treeId.push(e);
      }
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    } else {
      message.message = '';
    }
    return message;
  },
  toJSON(message: TextMessage): unknown {
    const obj: any = {};
    message.actor !== undefined && (obj.actor = message.actor);
    if (message.session) {
      obj.session = message.session.map((e) => e);
    } else {
      obj.session = [];
    }
    if (message.channelId) {
      obj.channelId = message.channelId.map((e) => e);
    } else {
      obj.channelId = [];
    }
    if (message.treeId) {
      obj.treeId = message.treeId.map((e) => e);
    } else {
      obj.treeId = [];
    }
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },
};

export const PermissionDenied = {
  encode(
    message: PermissionDenied,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.permission);
    writer.uint32(16).uint32(message.channelId);
    writer.uint32(24).uint32(message.session);
    writer.uint32(34).string(message.reason);
    writer.uint32(40).int32(message.type);
    writer.uint32(50).string(message.name);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): PermissionDenied {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePermissionDenied } as PermissionDenied;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.permission = reader.uint32();
          break;
        case 2:
          message.channelId = reader.uint32();
          break;
        case 3:
          message.session = reader.uint32();
          break;
        case 4:
          message.reason = reader.string();
          break;
        case 5:
          message.type = reader.int32() as any;
          break;
        case 6:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PermissionDenied {
    const message = { ...basePermissionDenied } as PermissionDenied;
    if (
      object.permission !== undefined &&
      object.permission !== null
    ) {
      message.permission = Number(object.permission);
    } else {
      message.permission = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = String(object.reason);
    } else {
      message.reason = '';
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = permissionDenied_DenyTypeFromJSON(object.type);
    } else {
      message.type = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    return message;
  },
  fromPartial(
    object: DeepPartial<PermissionDenied>
  ): PermissionDenied {
    const message = { ...basePermissionDenied } as PermissionDenied;
    if (
      object.permission !== undefined &&
      object.permission !== null
    ) {
      message.permission = object.permission;
    } else {
      message.permission = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (object.reason !== undefined && object.reason !== null) {
      message.reason = object.reason;
    } else {
      message.reason = '';
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    return message;
  },
  toJSON(message: PermissionDenied): unknown {
    const obj: any = {};
    message.permission !== undefined &&
      (obj.permission = message.permission);
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.session !== undefined && (obj.session = message.session);
    message.reason !== undefined && (obj.reason = message.reason);
    message.type !== undefined &&
      (obj.type = permissionDenied_DenyTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

export const ACL = {
  encode(message: ACL, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).uint32(message.channelId);
    writer.uint32(16).bool(message.inheritAcls);
    for (const v of message.groups) {
      ACL_ChanGroup.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.acls) {
      ACL_ChanACL.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(40).bool(message.query);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ACL {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseACL } as ACL;
    message.groups = [];
    message.acls = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.uint32();
          break;
        case 2:
          message.inheritAcls = reader.bool();
          break;
        case 3:
          message.groups.push(
            ACL_ChanGroup.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.acls.push(
            ACL_ChanACL.decode(reader, reader.uint32())
          );
          break;
        case 5:
          message.query = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ACL {
    const message = { ...baseACL } as ACL;
    message.groups = [];
    message.acls = [];
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (
      object.inheritAcls !== undefined &&
      object.inheritAcls !== null
    ) {
      message.inheritAcls = Boolean(object.inheritAcls);
    } else {
      message.inheritAcls = false;
    }
    if (object.groups !== undefined && object.groups !== null) {
      for (const e of object.groups) {
        message.groups.push(ACL_ChanGroup.fromJSON(e));
      }
    }
    if (object.acls !== undefined && object.acls !== null) {
      for (const e of object.acls) {
        message.acls.push(ACL_ChanACL.fromJSON(e));
      }
    }
    if (object.query !== undefined && object.query !== null) {
      message.query = Boolean(object.query);
    } else {
      message.query = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ACL>): ACL {
    const message = { ...baseACL } as ACL;
    message.groups = [];
    message.acls = [];
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (
      object.inheritAcls !== undefined &&
      object.inheritAcls !== null
    ) {
      message.inheritAcls = object.inheritAcls;
    } else {
      message.inheritAcls = false;
    }
    if (object.groups !== undefined && object.groups !== null) {
      for (const e of object.groups) {
        message.groups.push(ACL_ChanGroup.fromPartial(e));
      }
    }
    if (object.acls !== undefined && object.acls !== null) {
      for (const e of object.acls) {
        message.acls.push(ACL_ChanACL.fromPartial(e));
      }
    }
    if (object.query !== undefined && object.query !== null) {
      message.query = object.query;
    } else {
      message.query = false;
    }
    return message;
  },
  toJSON(message: ACL): unknown {
    const obj: any = {};
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.inheritAcls !== undefined &&
      (obj.inheritAcls = message.inheritAcls);
    if (message.groups) {
      obj.groups = message.groups.map((e) =>
        e ? ACL_ChanGroup.toJSON(e) : undefined
      );
    } else {
      obj.groups = [];
    }
    if (message.acls) {
      obj.acls = message.acls.map((e) =>
        e ? ACL_ChanACL.toJSON(e) : undefined
      );
    } else {
      obj.acls = [];
    }
    message.query !== undefined && (obj.query = message.query);
    return obj;
  },
};

export const ACL_ChanGroup = {
  encode(
    message: ACL_ChanGroup,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).string(message.name);
    writer.uint32(16).bool(message.inherited);
    writer.uint32(24).bool(message.inherit);
    writer.uint32(32).bool(message.inheritable);
    writer.uint32(42).fork();
    for (const v of message.add) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(50).fork();
    for (const v of message.remove) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(58).fork();
    for (const v of message.inheritedMembers) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ACL_ChanGroup {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseACL_ChanGroup } as ACL_ChanGroup;
    message.add = [];
    message.remove = [];
    message.inheritedMembers = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.inherited = reader.bool();
          break;
        case 3:
          message.inherit = reader.bool();
          break;
        case 4:
          message.inheritable = reader.bool();
          break;
        case 5:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.add.push(reader.uint32());
            }
          } else {
            message.add.push(reader.uint32());
          }
          break;
        case 6:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.remove.push(reader.uint32());
            }
          } else {
            message.remove.push(reader.uint32());
          }
          break;
        case 7:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.inheritedMembers.push(reader.uint32());
            }
          } else {
            message.inheritedMembers.push(reader.uint32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ACL_ChanGroup {
    const message = { ...baseACL_ChanGroup } as ACL_ChanGroup;
    message.add = [];
    message.remove = [];
    message.inheritedMembers = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.inherited !== undefined && object.inherited !== null) {
      message.inherited = Boolean(object.inherited);
    } else {
      message.inherited = false;
    }
    if (object.inherit !== undefined && object.inherit !== null) {
      message.inherit = Boolean(object.inherit);
    } else {
      message.inherit = false;
    }
    if (
      object.inheritable !== undefined &&
      object.inheritable !== null
    ) {
      message.inheritable = Boolean(object.inheritable);
    } else {
      message.inheritable = false;
    }
    if (object.add !== undefined && object.add !== null) {
      for (const e of object.add) {
        message.add.push(Number(e));
      }
    }
    if (object.remove !== undefined && object.remove !== null) {
      for (const e of object.remove) {
        message.remove.push(Number(e));
      }
    }
    if (
      object.inheritedMembers !== undefined &&
      object.inheritedMembers !== null
    ) {
      for (const e of object.inheritedMembers) {
        message.inheritedMembers.push(Number(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ACL_ChanGroup>): ACL_ChanGroup {
    const message = { ...baseACL_ChanGroup } as ACL_ChanGroup;
    message.add = [];
    message.remove = [];
    message.inheritedMembers = [];
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.inherited !== undefined && object.inherited !== null) {
      message.inherited = object.inherited;
    } else {
      message.inherited = false;
    }
    if (object.inherit !== undefined && object.inherit !== null) {
      message.inherit = object.inherit;
    } else {
      message.inherit = false;
    }
    if (
      object.inheritable !== undefined &&
      object.inheritable !== null
    ) {
      message.inheritable = object.inheritable;
    } else {
      message.inheritable = false;
    }
    if (object.add !== undefined && object.add !== null) {
      for (const e of object.add) {
        message.add.push(e);
      }
    }
    if (object.remove !== undefined && object.remove !== null) {
      for (const e of object.remove) {
        message.remove.push(e);
      }
    }
    if (
      object.inheritedMembers !== undefined &&
      object.inheritedMembers !== null
    ) {
      for (const e of object.inheritedMembers) {
        message.inheritedMembers.push(e);
      }
    }
    return message;
  },
  toJSON(message: ACL_ChanGroup): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.inherited !== undefined &&
      (obj.inherited = message.inherited);
    message.inherit !== undefined && (obj.inherit = message.inherit);
    message.inheritable !== undefined &&
      (obj.inheritable = message.inheritable);
    if (message.add) {
      obj.add = message.add.map((e) => e);
    } else {
      obj.add = [];
    }
    if (message.remove) {
      obj.remove = message.remove.map((e) => e);
    } else {
      obj.remove = [];
    }
    if (message.inheritedMembers) {
      obj.inheritedMembers = message.inheritedMembers.map((e) => e);
    } else {
      obj.inheritedMembers = [];
    }
    return obj;
  },
};

export const ACL_ChanACL = {
  encode(
    message: ACL_ChanACL,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).bool(message.applyHere);
    writer.uint32(16).bool(message.applySubs);
    writer.uint32(24).bool(message.inherited);
    writer.uint32(32).uint32(message.userId);
    writer.uint32(42).string(message.group);
    writer.uint32(48).uint32(message.grant);
    writer.uint32(56).uint32(message.deny);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ACL_ChanACL {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseACL_ChanACL } as ACL_ChanACL;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.applyHere = reader.bool();
          break;
        case 2:
          message.applySubs = reader.bool();
          break;
        case 3:
          message.inherited = reader.bool();
          break;
        case 4:
          message.userId = reader.uint32();
          break;
        case 5:
          message.group = reader.string();
          break;
        case 6:
          message.grant = reader.uint32();
          break;
        case 7:
          message.deny = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ACL_ChanACL {
    const message = { ...baseACL_ChanACL } as ACL_ChanACL;
    if (object.applyHere !== undefined && object.applyHere !== null) {
      message.applyHere = Boolean(object.applyHere);
    } else {
      message.applyHere = false;
    }
    if (object.applySubs !== undefined && object.applySubs !== null) {
      message.applySubs = Boolean(object.applySubs);
    } else {
      message.applySubs = false;
    }
    if (object.inherited !== undefined && object.inherited !== null) {
      message.inherited = Boolean(object.inherited);
    } else {
      message.inherited = false;
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = Number(object.userId);
    } else {
      message.userId = 0;
    }
    if (object.group !== undefined && object.group !== null) {
      message.group = String(object.group);
    } else {
      message.group = '';
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = Number(object.grant);
    } else {
      message.grant = 0;
    }
    if (object.deny !== undefined && object.deny !== null) {
      message.deny = Number(object.deny);
    } else {
      message.deny = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ACL_ChanACL>): ACL_ChanACL {
    const message = { ...baseACL_ChanACL } as ACL_ChanACL;
    if (object.applyHere !== undefined && object.applyHere !== null) {
      message.applyHere = object.applyHere;
    } else {
      message.applyHere = false;
    }
    if (object.applySubs !== undefined && object.applySubs !== null) {
      message.applySubs = object.applySubs;
    } else {
      message.applySubs = false;
    }
    if (object.inherited !== undefined && object.inherited !== null) {
      message.inherited = object.inherited;
    } else {
      message.inherited = false;
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = 0;
    }
    if (object.group !== undefined && object.group !== null) {
      message.group = object.group;
    } else {
      message.group = '';
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant;
    } else {
      message.grant = 0;
    }
    if (object.deny !== undefined && object.deny !== null) {
      message.deny = object.deny;
    } else {
      message.deny = 0;
    }
    return message;
  },
  toJSON(message: ACL_ChanACL): unknown {
    const obj: any = {};
    message.applyHere !== undefined &&
      (obj.applyHere = message.applyHere);
    message.applySubs !== undefined &&
      (obj.applySubs = message.applySubs);
    message.inherited !== undefined &&
      (obj.inherited = message.inherited);
    message.userId !== undefined && (obj.userId = message.userId);
    message.group !== undefined && (obj.group = message.group);
    message.grant !== undefined && (obj.grant = message.grant);
    message.deny !== undefined && (obj.deny = message.deny);
    return obj;
  },
};

export const QueryUsers = {
  encode(
    message: QueryUsers,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.ids) {
      writer.uint32(v);
    }
    writer.ldelim();
    for (const v of message.names) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): QueryUsers {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryUsers } as QueryUsers;
    message.ids = [];
    message.names = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(reader.uint32());
            }
          } else {
            message.ids.push(reader.uint32());
          }
          break;
        case 2:
          message.names.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryUsers {
    const message = { ...baseQueryUsers } as QueryUsers;
    message.ids = [];
    message.names = [];
    if (object.ids !== undefined && object.ids !== null) {
      for (const e of object.ids) {
        message.ids.push(Number(e));
      }
    }
    if (object.names !== undefined && object.names !== null) {
      for (const e of object.names) {
        message.names.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<QueryUsers>): QueryUsers {
    const message = { ...baseQueryUsers } as QueryUsers;
    message.ids = [];
    message.names = [];
    if (object.ids !== undefined && object.ids !== null) {
      for (const e of object.ids) {
        message.ids.push(e);
      }
    }
    if (object.names !== undefined && object.names !== null) {
      for (const e of object.names) {
        message.names.push(e);
      }
    }
    return message;
  },
  toJSON(message: QueryUsers): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    if (message.names) {
      obj.names = message.names.map((e) => e);
    } else {
      obj.names = [];
    }
    return obj;
  },
};

export const CryptSetup = {
  encode(
    message: CryptSetup,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).bytes(message.key);
    writer.uint32(18).bytes(message.clientNonce);
    writer.uint32(26).bytes(message.serverNonce);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CryptSetup {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCryptSetup } as CryptSetup;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes();
          break;
        case 2:
          message.clientNonce = reader.bytes();
          break;
        case 3:
          message.serverNonce = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CryptSetup {
    const message = { ...baseCryptSetup } as CryptSetup;
    if (object.key !== undefined && object.key !== null) {
      message.key = bytesFromBase64(object.key);
    }
    if (
      object.clientNonce !== undefined &&
      object.clientNonce !== null
    ) {
      message.clientNonce = bytesFromBase64(object.clientNonce);
    }
    if (
      object.serverNonce !== undefined &&
      object.serverNonce !== null
    ) {
      message.serverNonce = bytesFromBase64(object.serverNonce);
    }
    return message;
  },
  fromPartial(object: DeepPartial<CryptSetup>): CryptSetup {
    const message = { ...baseCryptSetup } as CryptSetup;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = new Uint8Array();
    }
    if (
      object.clientNonce !== undefined &&
      object.clientNonce !== null
    ) {
      message.clientNonce = object.clientNonce;
    } else {
      message.clientNonce = new Uint8Array();
    }
    if (
      object.serverNonce !== undefined &&
      object.serverNonce !== null
    ) {
      message.serverNonce = object.serverNonce;
    } else {
      message.serverNonce = new Uint8Array();
    }
    return message;
  },
  toJSON(message: CryptSetup): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : new Uint8Array()
      ));
    message.clientNonce !== undefined &&
      (obj.clientNonce = base64FromBytes(
        message.clientNonce !== undefined
          ? message.clientNonce
          : new Uint8Array()
      ));
    message.serverNonce !== undefined &&
      (obj.serverNonce = base64FromBytes(
        message.serverNonce !== undefined
          ? message.serverNonce
          : new Uint8Array()
      ));
    return obj;
  },
};

export const ContextActionModify = {
  encode(
    message: ContextActionModify,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).string(message.action);
    writer.uint32(18).string(message.text);
    writer.uint32(24).uint32(message.context);
    writer.uint32(32).int32(message.operation);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): ContextActionModify {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseContextActionModify,
    } as ContextActionModify;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.action = reader.string();
          break;
        case 2:
          message.text = reader.string();
          break;
        case 3:
          message.context = reader.uint32();
          break;
        case 4:
          message.operation = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ContextActionModify {
    const message = {
      ...baseContextActionModify,
    } as ContextActionModify;
    if (object.action !== undefined && object.action !== null) {
      message.action = String(object.action);
    } else {
      message.action = '';
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = String(object.text);
    } else {
      message.text = '';
    }
    if (object.context !== undefined && object.context !== null) {
      message.context = Number(object.context);
    } else {
      message.context = 0;
    }
    if (object.operation !== undefined && object.operation !== null) {
      message.operation = contextActionModify_OperationFromJSON(
        object.operation
      );
    } else {
      message.operation = 0;
    }
    return message;
  },
  fromPartial(
    object: DeepPartial<ContextActionModify>
  ): ContextActionModify {
    const message = {
      ...baseContextActionModify,
    } as ContextActionModify;
    if (object.action !== undefined && object.action !== null) {
      message.action = object.action;
    } else {
      message.action = '';
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = object.text;
    } else {
      message.text = '';
    }
    if (object.context !== undefined && object.context !== null) {
      message.context = object.context;
    } else {
      message.context = 0;
    }
    if (object.operation !== undefined && object.operation !== null) {
      message.operation = object.operation;
    } else {
      message.operation = 0;
    }
    return message;
  },
  toJSON(message: ContextActionModify): unknown {
    const obj: any = {};
    message.action !== undefined && (obj.action = message.action);
    message.text !== undefined && (obj.text = message.text);
    message.context !== undefined && (obj.context = message.context);
    message.operation !== undefined &&
      (obj.operation = contextActionModify_OperationToJSON(
        message.operation
      ));
    return obj;
  },
};

export const ContextAction = {
  encode(
    message: ContextAction,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.session);
    writer.uint32(16).uint32(message.channelId);
    writer.uint32(26).string(message.action);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ContextAction {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseContextAction } as ContextAction;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = reader.uint32();
          break;
        case 2:
          message.channelId = reader.uint32();
          break;
        case 3:
          message.action = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ContextAction {
    const message = { ...baseContextAction } as ContextAction;
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = String(object.action);
    } else {
      message.action = '';
    }
    return message;
  },
  fromPartial(object: DeepPartial<ContextAction>): ContextAction {
    const message = { ...baseContextAction } as ContextAction;
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (object.action !== undefined && object.action !== null) {
      message.action = object.action;
    } else {
      message.action = '';
    }
    return message;
  },
  toJSON(message: ContextAction): unknown {
    const obj: any = {};
    message.session !== undefined && (obj.session = message.session);
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.action !== undefined && (obj.action = message.action);
    return obj;
  },
};

export const UserList = {
  encode(
    message: UserList,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.users) {
      UserList_User.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UserList {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserList } as UserList;
    message.users = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(
            UserList_User.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserList {
    const message = { ...baseUserList } as UserList;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(UserList_User.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserList>): UserList {
    const message = { ...baseUserList } as UserList;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(UserList_User.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: UserList): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) =>
        e ? UserList_User.toJSON(e) : undefined
      );
    } else {
      obj.users = [];
    }
    return obj;
  },
};

export const UserList_User = {
  encode(
    message: UserList_User,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.userId);
    writer.uint32(18).string(message.name);
    writer.uint32(26).string(message.lastSeen);
    writer.uint32(32).uint32(message.lastChannel);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UserList_User {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserList_User } as UserList_User;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.lastSeen = reader.string();
          break;
        case 4:
          message.lastChannel = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserList_User {
    const message = { ...baseUserList_User } as UserList_User;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = Number(object.userId);
    } else {
      message.userId = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = '';
    }
    if (object.lastSeen !== undefined && object.lastSeen !== null) {
      message.lastSeen = String(object.lastSeen);
    } else {
      message.lastSeen = '';
    }
    if (
      object.lastChannel !== undefined &&
      object.lastChannel !== null
    ) {
      message.lastChannel = Number(object.lastChannel);
    } else {
      message.lastChannel = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserList_User>): UserList_User {
    const message = { ...baseUserList_User } as UserList_User;
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId;
    } else {
      message.userId = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = '';
    }
    if (object.lastSeen !== undefined && object.lastSeen !== null) {
      message.lastSeen = object.lastSeen;
    } else {
      message.lastSeen = '';
    }
    if (
      object.lastChannel !== undefined &&
      object.lastChannel !== null
    ) {
      message.lastChannel = object.lastChannel;
    } else {
      message.lastChannel = 0;
    }
    return message;
  },
  toJSON(message: UserList_User): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.name !== undefined && (obj.name = message.name);
    message.lastSeen !== undefined &&
      (obj.lastSeen = message.lastSeen);
    message.lastChannel !== undefined &&
      (obj.lastChannel = message.lastChannel);
    return obj;
  },
};

export const VoiceTarget = {
  encode(
    message: VoiceTarget,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.id);
    for (const v of message.targets) {
      VoiceTarget_Target.encode(
        v!,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): VoiceTarget {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseVoiceTarget } as VoiceTarget;
    message.targets = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.targets.push(
            VoiceTarget_Target.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): VoiceTarget {
    const message = { ...baseVoiceTarget } as VoiceTarget;
    message.targets = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    if (object.targets !== undefined && object.targets !== null) {
      for (const e of object.targets) {
        message.targets.push(VoiceTarget_Target.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<VoiceTarget>): VoiceTarget {
    const message = { ...baseVoiceTarget } as VoiceTarget;
    message.targets = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    if (object.targets !== undefined && object.targets !== null) {
      for (const e of object.targets) {
        message.targets.push(VoiceTarget_Target.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: VoiceTarget): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    if (message.targets) {
      obj.targets = message.targets.map((e) =>
        e ? VoiceTarget_Target.toJSON(e) : undefined
      );
    } else {
      obj.targets = [];
    }
    return obj;
  },
};

export const VoiceTarget_Target = {
  encode(
    message: VoiceTarget_Target,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.session) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(16).uint32(message.channelId);
    writer.uint32(26).string(message.group);
    writer.uint32(32).bool(message.links);
    writer.uint32(40).bool(message.children);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): VoiceTarget_Target {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseVoiceTarget_Target,
    } as VoiceTarget_Target;
    message.session = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.session.push(reader.uint32());
            }
          } else {
            message.session.push(reader.uint32());
          }
          break;
        case 2:
          message.channelId = reader.uint32();
          break;
        case 3:
          message.group = reader.string();
          break;
        case 4:
          message.links = reader.bool();
          break;
        case 5:
          message.children = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): VoiceTarget_Target {
    const message = {
      ...baseVoiceTarget_Target,
    } as VoiceTarget_Target;
    message.session = [];
    if (object.session !== undefined && object.session !== null) {
      for (const e of object.session) {
        message.session.push(Number(e));
      }
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (object.group !== undefined && object.group !== null) {
      message.group = String(object.group);
    } else {
      message.group = '';
    }
    if (object.links !== undefined && object.links !== null) {
      message.links = Boolean(object.links);
    } else {
      message.links = false;
    }
    if (object.children !== undefined && object.children !== null) {
      message.children = Boolean(object.children);
    } else {
      message.children = false;
    }
    return message;
  },
  fromPartial(
    object: DeepPartial<VoiceTarget_Target>
  ): VoiceTarget_Target {
    const message = {
      ...baseVoiceTarget_Target,
    } as VoiceTarget_Target;
    message.session = [];
    if (object.session !== undefined && object.session !== null) {
      for (const e of object.session) {
        message.session.push(e);
      }
    }
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (object.group !== undefined && object.group !== null) {
      message.group = object.group;
    } else {
      message.group = '';
    }
    if (object.links !== undefined && object.links !== null) {
      message.links = object.links;
    } else {
      message.links = false;
    }
    if (object.children !== undefined && object.children !== null) {
      message.children = object.children;
    } else {
      message.children = false;
    }
    return message;
  },
  toJSON(message: VoiceTarget_Target): unknown {
    const obj: any = {};
    if (message.session) {
      obj.session = message.session.map((e) => e);
    } else {
      obj.session = [];
    }
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.group !== undefined && (obj.group = message.group);
    message.links !== undefined && (obj.links = message.links);
    message.children !== undefined &&
      (obj.children = message.children);
    return obj;
  },
};

export const PermissionQuery = {
  encode(
    message: PermissionQuery,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.channelId);
    writer.uint32(16).uint32(message.permissions);
    writer.uint32(24).bool(message.flush);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): PermissionQuery {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePermissionQuery } as PermissionQuery;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.channelId = reader.uint32();
          break;
        case 2:
          message.permissions = reader.uint32();
          break;
        case 3:
          message.flush = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PermissionQuery {
    const message = { ...basePermissionQuery } as PermissionQuery;
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = Number(object.channelId);
    } else {
      message.channelId = 0;
    }
    if (
      object.permissions !== undefined &&
      object.permissions !== null
    ) {
      message.permissions = Number(object.permissions);
    } else {
      message.permissions = 0;
    }
    if (object.flush !== undefined && object.flush !== null) {
      message.flush = Boolean(object.flush);
    } else {
      message.flush = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<PermissionQuery>): PermissionQuery {
    const message = { ...basePermissionQuery } as PermissionQuery;
    if (object.channelId !== undefined && object.channelId !== null) {
      message.channelId = object.channelId;
    } else {
      message.channelId = 0;
    }
    if (
      object.permissions !== undefined &&
      object.permissions !== null
    ) {
      message.permissions = object.permissions;
    } else {
      message.permissions = 0;
    }
    if (object.flush !== undefined && object.flush !== null) {
      message.flush = object.flush;
    } else {
      message.flush = false;
    }
    return message;
  },
  toJSON(message: PermissionQuery): unknown {
    const obj: any = {};
    message.channelId !== undefined &&
      (obj.channelId = message.channelId);
    message.permissions !== undefined &&
      (obj.permissions = message.permissions);
    message.flush !== undefined && (obj.flush = message.flush);
    return obj;
  },
};

export const CodecVersion = {
  encode(
    message: CodecVersion,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).int32(message.alpha);
    writer.uint32(16).int32(message.beta);
    writer.uint32(24).bool(message.preferAlpha);
    writer.uint32(32).bool(message.opus);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CodecVersion {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCodecVersion } as CodecVersion;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alpha = reader.int32();
          break;
        case 2:
          message.beta = reader.int32();
          break;
        case 3:
          message.preferAlpha = reader.bool();
          break;
        case 4:
          message.opus = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CodecVersion {
    const message = { ...baseCodecVersion } as CodecVersion;
    if (object.alpha !== undefined && object.alpha !== null) {
      message.alpha = Number(object.alpha);
    } else {
      message.alpha = 0;
    }
    if (object.beta !== undefined && object.beta !== null) {
      message.beta = Number(object.beta);
    } else {
      message.beta = 0;
    }
    if (
      object.preferAlpha !== undefined &&
      object.preferAlpha !== null
    ) {
      message.preferAlpha = Boolean(object.preferAlpha);
    } else {
      message.preferAlpha = false;
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = Boolean(object.opus);
    } else {
      message.opus = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<CodecVersion>): CodecVersion {
    const message = { ...baseCodecVersion } as CodecVersion;
    if (object.alpha !== undefined && object.alpha !== null) {
      message.alpha = object.alpha;
    } else {
      message.alpha = 0;
    }
    if (object.beta !== undefined && object.beta !== null) {
      message.beta = object.beta;
    } else {
      message.beta = 0;
    }
    if (
      object.preferAlpha !== undefined &&
      object.preferAlpha !== null
    ) {
      message.preferAlpha = object.preferAlpha;
    } else {
      message.preferAlpha = false;
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = object.opus;
    } else {
      message.opus = false;
    }
    return message;
  },
  toJSON(message: CodecVersion): unknown {
    const obj: any = {};
    message.alpha !== undefined && (obj.alpha = message.alpha);
    message.beta !== undefined && (obj.beta = message.beta);
    message.preferAlpha !== undefined &&
      (obj.preferAlpha = message.preferAlpha);
    message.opus !== undefined && (obj.opus = message.opus);
    return obj;
  },
};

export const UserStats = {
  encode(
    message: UserStats,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.session);
    writer.uint32(16).bool(message.statsOnly);
    for (const v of message.certificates) {
      writer.uint32(26).bytes(v!);
    }
    if (
      message.fromClient !== undefined &&
      message.fromClient !== undefined
    ) {
      UserStats_Stats.encode(
        message.fromClient,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (
      message.fromServer !== undefined &&
      message.fromServer !== undefined
    ) {
      UserStats_Stats.encode(
        message.fromServer,
        writer.uint32(42).fork()
      ).ldelim();
    }
    writer.uint32(48).uint32(message.udpPackets);
    writer.uint32(56).uint32(message.tcpPackets);
    writer.uint32(69).float(message.udpPingAvg);
    writer.uint32(77).float(message.udpPingVar);
    writer.uint32(85).float(message.tcpPingAvg);
    writer.uint32(93).float(message.tcpPingVar);
    if (
      message.version !== undefined &&
      message.version !== undefined
    ) {
      Version.encode(
        message.version,
        writer.uint32(98).fork()
      ).ldelim();
    }
    writer.uint32(106).fork();
    for (const v of message.celtVersions) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(114).bytes(message.address);
    writer.uint32(120).uint32(message.bandwidth);
    writer.uint32(128).uint32(message.onlinesecs);
    writer.uint32(136).uint32(message.idlesecs);
    writer.uint32(144).bool(message.strongCertificate);
    writer.uint32(152).bool(message.opus);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): UserStats {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserStats } as UserStats;
    message.certificates = [];
    message.celtVersions = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.session = reader.uint32();
          break;
        case 2:
          message.statsOnly = reader.bool();
          break;
        case 3:
          message.certificates.push(reader.bytes());
          break;
        case 4:
          message.fromClient = UserStats_Stats.decode(
            reader,
            reader.uint32()
          );
          break;
        case 5:
          message.fromServer = UserStats_Stats.decode(
            reader,
            reader.uint32()
          );
          break;
        case 6:
          message.udpPackets = reader.uint32();
          break;
        case 7:
          message.tcpPackets = reader.uint32();
          break;
        case 8:
          message.udpPingAvg = reader.float();
          break;
        case 9:
          message.udpPingVar = reader.float();
          break;
        case 10:
          message.tcpPingAvg = reader.float();
          break;
        case 11:
          message.tcpPingVar = reader.float();
          break;
        case 12:
          message.version = Version.decode(reader, reader.uint32());
          break;
        case 13:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.celtVersions.push(reader.int32());
            }
          } else {
            message.celtVersions.push(reader.int32());
          }
          break;
        case 14:
          message.address = reader.bytes();
          break;
        case 15:
          message.bandwidth = reader.uint32();
          break;
        case 16:
          message.onlinesecs = reader.uint32();
          break;
        case 17:
          message.idlesecs = reader.uint32();
          break;
        case 18:
          message.strongCertificate = reader.bool();
          break;
        case 19:
          message.opus = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserStats {
    const message = { ...baseUserStats } as UserStats;
    message.certificates = [];
    message.celtVersions = [];
    if (object.session !== undefined && object.session !== null) {
      message.session = Number(object.session);
    } else {
      message.session = 0;
    }
    if (object.statsOnly !== undefined && object.statsOnly !== null) {
      message.statsOnly = Boolean(object.statsOnly);
    } else {
      message.statsOnly = false;
    }
    if (
      object.certificates !== undefined &&
      object.certificates !== null
    ) {
      for (const e of object.certificates) {
        message.certificates.push(bytesFromBase64(e));
      }
    }
    if (
      object.fromClient !== undefined &&
      object.fromClient !== null
    ) {
      message.fromClient = UserStats_Stats.fromJSON(
        object.fromClient
      );
    } else {
      message.fromClient = undefined;
    }
    if (
      object.fromServer !== undefined &&
      object.fromServer !== null
    ) {
      message.fromServer = UserStats_Stats.fromJSON(
        object.fromServer
      );
    } else {
      message.fromServer = undefined;
    }
    if (
      object.udpPackets !== undefined &&
      object.udpPackets !== null
    ) {
      message.udpPackets = Number(object.udpPackets);
    } else {
      message.udpPackets = 0;
    }
    if (
      object.tcpPackets !== undefined &&
      object.tcpPackets !== null
    ) {
      message.tcpPackets = Number(object.tcpPackets);
    } else {
      message.tcpPackets = 0;
    }
    if (
      object.udpPingAvg !== undefined &&
      object.udpPingAvg !== null
    ) {
      message.udpPingAvg = Number(object.udpPingAvg);
    } else {
      message.udpPingAvg = 0;
    }
    if (
      object.udpPingVar !== undefined &&
      object.udpPingVar !== null
    ) {
      message.udpPingVar = Number(object.udpPingVar);
    } else {
      message.udpPingVar = 0;
    }
    if (
      object.tcpPingAvg !== undefined &&
      object.tcpPingAvg !== null
    ) {
      message.tcpPingAvg = Number(object.tcpPingAvg);
    } else {
      message.tcpPingAvg = 0;
    }
    if (
      object.tcpPingVar !== undefined &&
      object.tcpPingVar !== null
    ) {
      message.tcpPingVar = Number(object.tcpPingVar);
    } else {
      message.tcpPingVar = 0;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = Version.fromJSON(object.version);
    } else {
      message.version = undefined;
    }
    if (
      object.celtVersions !== undefined &&
      object.celtVersions !== null
    ) {
      for (const e of object.celtVersions) {
        message.celtVersions.push(Number(e));
      }
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = bytesFromBase64(object.address);
    }
    if (object.bandwidth !== undefined && object.bandwidth !== null) {
      message.bandwidth = Number(object.bandwidth);
    } else {
      message.bandwidth = 0;
    }
    if (
      object.onlinesecs !== undefined &&
      object.onlinesecs !== null
    ) {
      message.onlinesecs = Number(object.onlinesecs);
    } else {
      message.onlinesecs = 0;
    }
    if (object.idlesecs !== undefined && object.idlesecs !== null) {
      message.idlesecs = Number(object.idlesecs);
    } else {
      message.idlesecs = 0;
    }
    if (
      object.strongCertificate !== undefined &&
      object.strongCertificate !== null
    ) {
      message.strongCertificate = Boolean(object.strongCertificate);
    } else {
      message.strongCertificate = false;
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = Boolean(object.opus);
    } else {
      message.opus = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserStats>): UserStats {
    const message = { ...baseUserStats } as UserStats;
    message.certificates = [];
    message.celtVersions = [];
    if (object.session !== undefined && object.session !== null) {
      message.session = object.session;
    } else {
      message.session = 0;
    }
    if (object.statsOnly !== undefined && object.statsOnly !== null) {
      message.statsOnly = object.statsOnly;
    } else {
      message.statsOnly = false;
    }
    if (
      object.certificates !== undefined &&
      object.certificates !== null
    ) {
      for (const e of object.certificates) {
        message.certificates.push(e);
      }
    }
    if (
      object.fromClient !== undefined &&
      object.fromClient !== null
    ) {
      message.fromClient = UserStats_Stats.fromPartial(
        object.fromClient
      );
    } else {
      message.fromClient = undefined;
    }
    if (
      object.fromServer !== undefined &&
      object.fromServer !== null
    ) {
      message.fromServer = UserStats_Stats.fromPartial(
        object.fromServer
      );
    } else {
      message.fromServer = undefined;
    }
    if (
      object.udpPackets !== undefined &&
      object.udpPackets !== null
    ) {
      message.udpPackets = object.udpPackets;
    } else {
      message.udpPackets = 0;
    }
    if (
      object.tcpPackets !== undefined &&
      object.tcpPackets !== null
    ) {
      message.tcpPackets = object.tcpPackets;
    } else {
      message.tcpPackets = 0;
    }
    if (
      object.udpPingAvg !== undefined &&
      object.udpPingAvg !== null
    ) {
      message.udpPingAvg = object.udpPingAvg;
    } else {
      message.udpPingAvg = 0;
    }
    if (
      object.udpPingVar !== undefined &&
      object.udpPingVar !== null
    ) {
      message.udpPingVar = object.udpPingVar;
    } else {
      message.udpPingVar = 0;
    }
    if (
      object.tcpPingAvg !== undefined &&
      object.tcpPingAvg !== null
    ) {
      message.tcpPingAvg = object.tcpPingAvg;
    } else {
      message.tcpPingAvg = 0;
    }
    if (
      object.tcpPingVar !== undefined &&
      object.tcpPingVar !== null
    ) {
      message.tcpPingVar = object.tcpPingVar;
    } else {
      message.tcpPingVar = 0;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = Version.fromPartial(object.version);
    } else {
      message.version = undefined;
    }
    if (
      object.celtVersions !== undefined &&
      object.celtVersions !== null
    ) {
      for (const e of object.celtVersions) {
        message.celtVersions.push(e);
      }
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    } else {
      message.address = new Uint8Array();
    }
    if (object.bandwidth !== undefined && object.bandwidth !== null) {
      message.bandwidth = object.bandwidth;
    } else {
      message.bandwidth = 0;
    }
    if (
      object.onlinesecs !== undefined &&
      object.onlinesecs !== null
    ) {
      message.onlinesecs = object.onlinesecs;
    } else {
      message.onlinesecs = 0;
    }
    if (object.idlesecs !== undefined && object.idlesecs !== null) {
      message.idlesecs = object.idlesecs;
    } else {
      message.idlesecs = 0;
    }
    if (
      object.strongCertificate !== undefined &&
      object.strongCertificate !== null
    ) {
      message.strongCertificate = object.strongCertificate;
    } else {
      message.strongCertificate = false;
    }
    if (object.opus !== undefined && object.opus !== null) {
      message.opus = object.opus;
    } else {
      message.opus = false;
    }
    return message;
  },
  toJSON(message: UserStats): unknown {
    const obj: any = {};
    message.session !== undefined && (obj.session = message.session);
    message.statsOnly !== undefined &&
      (obj.statsOnly = message.statsOnly);
    if (message.certificates) {
      obj.certificates = message.certificates.map((e) =>
        base64FromBytes(e !== undefined ? e : new Uint8Array())
      );
    } else {
      obj.certificates = [];
    }
    message.fromClient !== undefined &&
      (obj.fromClient = message.fromClient
        ? UserStats_Stats.toJSON(message.fromClient)
        : undefined);
    message.fromServer !== undefined &&
      (obj.fromServer = message.fromServer
        ? UserStats_Stats.toJSON(message.fromServer)
        : undefined);
    message.udpPackets !== undefined &&
      (obj.udpPackets = message.udpPackets);
    message.tcpPackets !== undefined &&
      (obj.tcpPackets = message.tcpPackets);
    message.udpPingAvg !== undefined &&
      (obj.udpPingAvg = message.udpPingAvg);
    message.udpPingVar !== undefined &&
      (obj.udpPingVar = message.udpPingVar);
    message.tcpPingAvg !== undefined &&
      (obj.tcpPingAvg = message.tcpPingAvg);
    message.tcpPingVar !== undefined &&
      (obj.tcpPingVar = message.tcpPingVar);
    message.version !== undefined &&
      (obj.version = message.version
        ? Version.toJSON(message.version)
        : undefined);
    if (message.celtVersions) {
      obj.celtVersions = message.celtVersions.map((e) => e);
    } else {
      obj.celtVersions = [];
    }
    message.address !== undefined &&
      (obj.address = base64FromBytes(
        message.address !== undefined
          ? message.address
          : new Uint8Array()
      ));
    message.bandwidth !== undefined &&
      (obj.bandwidth = message.bandwidth);
    message.onlinesecs !== undefined &&
      (obj.onlinesecs = message.onlinesecs);
    message.idlesecs !== undefined &&
      (obj.idlesecs = message.idlesecs);
    message.strongCertificate !== undefined &&
      (obj.strongCertificate = message.strongCertificate);
    message.opus !== undefined && (obj.opus = message.opus);
    return obj;
  },
};

export const UserStats_Stats = {
  encode(
    message: UserStats_Stats,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.good);
    writer.uint32(16).uint32(message.late);
    writer.uint32(24).uint32(message.lost);
    writer.uint32(32).uint32(message.resync);
    return writer;
  },
  decode(
    input: Uint8Array | Reader,
    length?: number
  ): UserStats_Stats {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserStats_Stats } as UserStats_Stats;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.good = reader.uint32();
          break;
        case 2:
          message.late = reader.uint32();
          break;
        case 3:
          message.lost = reader.uint32();
          break;
        case 4:
          message.resync = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): UserStats_Stats {
    const message = { ...baseUserStats_Stats } as UserStats_Stats;
    if (object.good !== undefined && object.good !== null) {
      message.good = Number(object.good);
    } else {
      message.good = 0;
    }
    if (object.late !== undefined && object.late !== null) {
      message.late = Number(object.late);
    } else {
      message.late = 0;
    }
    if (object.lost !== undefined && object.lost !== null) {
      message.lost = Number(object.lost);
    } else {
      message.lost = 0;
    }
    if (object.resync !== undefined && object.resync !== null) {
      message.resync = Number(object.resync);
    } else {
      message.resync = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<UserStats_Stats>): UserStats_Stats {
    const message = { ...baseUserStats_Stats } as UserStats_Stats;
    if (object.good !== undefined && object.good !== null) {
      message.good = object.good;
    } else {
      message.good = 0;
    }
    if (object.late !== undefined && object.late !== null) {
      message.late = object.late;
    } else {
      message.late = 0;
    }
    if (object.lost !== undefined && object.lost !== null) {
      message.lost = object.lost;
    } else {
      message.lost = 0;
    }
    if (object.resync !== undefined && object.resync !== null) {
      message.resync = object.resync;
    } else {
      message.resync = 0;
    }
    return message;
  },
  toJSON(message: UserStats_Stats): unknown {
    const obj: any = {};
    message.good !== undefined && (obj.good = message.good);
    message.late !== undefined && (obj.late = message.late);
    message.lost !== undefined && (obj.lost = message.lost);
    message.resync !== undefined && (obj.resync = message.resync);
    return obj;
  },
};

export const RequestBlob = {
  encode(
    message: RequestBlob,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.sessionTexture) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(18).fork();
    for (const v of message.sessionComment) {
      writer.uint32(v);
    }
    writer.ldelim();
    writer.uint32(26).fork();
    for (const v of message.channelDescription) {
      writer.uint32(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): RequestBlob {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRequestBlob } as RequestBlob;
    message.sessionTexture = [];
    message.sessionComment = [];
    message.channelDescription = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.sessionTexture.push(reader.uint32());
            }
          } else {
            message.sessionTexture.push(reader.uint32());
          }
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.sessionComment.push(reader.uint32());
            }
          } else {
            message.sessionComment.push(reader.uint32());
          }
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.channelDescription.push(reader.uint32());
            }
          } else {
            message.channelDescription.push(reader.uint32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RequestBlob {
    const message = { ...baseRequestBlob } as RequestBlob;
    message.sessionTexture = [];
    message.sessionComment = [];
    message.channelDescription = [];
    if (
      object.sessionTexture !== undefined &&
      object.sessionTexture !== null
    ) {
      for (const e of object.sessionTexture) {
        message.sessionTexture.push(Number(e));
      }
    }
    if (
      object.sessionComment !== undefined &&
      object.sessionComment !== null
    ) {
      for (const e of object.sessionComment) {
        message.sessionComment.push(Number(e));
      }
    }
    if (
      object.channelDescription !== undefined &&
      object.channelDescription !== null
    ) {
      for (const e of object.channelDescription) {
        message.channelDescription.push(Number(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<RequestBlob>): RequestBlob {
    const message = { ...baseRequestBlob } as RequestBlob;
    message.sessionTexture = [];
    message.sessionComment = [];
    message.channelDescription = [];
    if (
      object.sessionTexture !== undefined &&
      object.sessionTexture !== null
    ) {
      for (const e of object.sessionTexture) {
        message.sessionTexture.push(e);
      }
    }
    if (
      object.sessionComment !== undefined &&
      object.sessionComment !== null
    ) {
      for (const e of object.sessionComment) {
        message.sessionComment.push(e);
      }
    }
    if (
      object.channelDescription !== undefined &&
      object.channelDescription !== null
    ) {
      for (const e of object.channelDescription) {
        message.channelDescription.push(e);
      }
    }
    return message;
  },
  toJSON(message: RequestBlob): unknown {
    const obj: any = {};
    if (message.sessionTexture) {
      obj.sessionTexture = message.sessionTexture.map((e) => e);
    } else {
      obj.sessionTexture = [];
    }
    if (message.sessionComment) {
      obj.sessionComment = message.sessionComment.map((e) => e);
    } else {
      obj.sessionComment = [];
    }
    if (message.channelDescription) {
      obj.channelDescription = message.channelDescription.map(
        (e) => e
      );
    } else {
      obj.channelDescription = [];
    }
    return obj;
  },
};

export const ServerConfig = {
  encode(
    message: ServerConfig,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.maxBandwidth);
    writer.uint32(18).string(message.welcomeText);
    writer.uint32(24).bool(message.allowHtml);
    writer.uint32(32).uint32(message.messageLength);
    writer.uint32(40).uint32(message.imageMessageLength);
    writer.uint32(48).uint32(message.maxUsers);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ServerConfig {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseServerConfig } as ServerConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxBandwidth = reader.uint32();
          break;
        case 2:
          message.welcomeText = reader.string();
          break;
        case 3:
          message.allowHtml = reader.bool();
          break;
        case 4:
          message.messageLength = reader.uint32();
          break;
        case 5:
          message.imageMessageLength = reader.uint32();
          break;
        case 6:
          message.maxUsers = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ServerConfig {
    const message = { ...baseServerConfig } as ServerConfig;
    if (
      object.maxBandwidth !== undefined &&
      object.maxBandwidth !== null
    ) {
      message.maxBandwidth = Number(object.maxBandwidth);
    } else {
      message.maxBandwidth = 0;
    }
    if (
      object.welcomeText !== undefined &&
      object.welcomeText !== null
    ) {
      message.welcomeText = String(object.welcomeText);
    } else {
      message.welcomeText = '';
    }
    if (object.allowHtml !== undefined && object.allowHtml !== null) {
      message.allowHtml = Boolean(object.allowHtml);
    } else {
      message.allowHtml = false;
    }
    if (
      object.messageLength !== undefined &&
      object.messageLength !== null
    ) {
      message.messageLength = Number(object.messageLength);
    } else {
      message.messageLength = 0;
    }
    if (
      object.imageMessageLength !== undefined &&
      object.imageMessageLength !== null
    ) {
      message.imageMessageLength = Number(object.imageMessageLength);
    } else {
      message.imageMessageLength = 0;
    }
    if (object.maxUsers !== undefined && object.maxUsers !== null) {
      message.maxUsers = Number(object.maxUsers);
    } else {
      message.maxUsers = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ServerConfig>): ServerConfig {
    const message = { ...baseServerConfig } as ServerConfig;
    if (
      object.maxBandwidth !== undefined &&
      object.maxBandwidth !== null
    ) {
      message.maxBandwidth = object.maxBandwidth;
    } else {
      message.maxBandwidth = 0;
    }
    if (
      object.welcomeText !== undefined &&
      object.welcomeText !== null
    ) {
      message.welcomeText = object.welcomeText;
    } else {
      message.welcomeText = '';
    }
    if (object.allowHtml !== undefined && object.allowHtml !== null) {
      message.allowHtml = object.allowHtml;
    } else {
      message.allowHtml = false;
    }
    if (
      object.messageLength !== undefined &&
      object.messageLength !== null
    ) {
      message.messageLength = object.messageLength;
    } else {
      message.messageLength = 0;
    }
    if (
      object.imageMessageLength !== undefined &&
      object.imageMessageLength !== null
    ) {
      message.imageMessageLength = object.imageMessageLength;
    } else {
      message.imageMessageLength = 0;
    }
    if (object.maxUsers !== undefined && object.maxUsers !== null) {
      message.maxUsers = object.maxUsers;
    } else {
      message.maxUsers = 0;
    }
    return message;
  },
  toJSON(message: ServerConfig): unknown {
    const obj: any = {};
    message.maxBandwidth !== undefined &&
      (obj.maxBandwidth = message.maxBandwidth);
    message.welcomeText !== undefined &&
      (obj.welcomeText = message.welcomeText);
    message.allowHtml !== undefined &&
      (obj.allowHtml = message.allowHtml);
    message.messageLength !== undefined &&
      (obj.messageLength = message.messageLength);
    message.imageMessageLength !== undefined &&
      (obj.imageMessageLength = message.imageMessageLength);
    message.maxUsers !== undefined &&
      (obj.maxUsers = message.maxUsers);
    return obj;
  },
};

export const SuggestConfig = {
  encode(
    message: SuggestConfig,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(8).uint32(message.version);
    writer.uint32(16).bool(message.positional);
    writer.uint32(24).bool(message.pushToTalk);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SuggestConfig {
    const reader =
      input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSuggestConfig } as SuggestConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        case 2:
          message.positional = reader.bool();
          break;
        case 3:
          message.pushToTalk = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SuggestConfig {
    const message = { ...baseSuggestConfig } as SuggestConfig;
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version);
    } else {
      message.version = 0;
    }
    if (
      object.positional !== undefined &&
      object.positional !== null
    ) {
      message.positional = Boolean(object.positional);
    } else {
      message.positional = false;
    }
    if (
      object.pushToTalk !== undefined &&
      object.pushToTalk !== null
    ) {
      message.pushToTalk = Boolean(object.pushToTalk);
    } else {
      message.pushToTalk = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SuggestConfig>): SuggestConfig {
    const message = { ...baseSuggestConfig } as SuggestConfig;
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    } else {
      message.version = 0;
    }
    if (
      object.positional !== undefined &&
      object.positional !== null
    ) {
      message.positional = object.positional;
    } else {
      message.positional = false;
    }
    if (
      object.pushToTalk !== undefined &&
      object.pushToTalk !== null
    ) {
      message.pushToTalk = object.pushToTalk;
    } else {
      message.pushToTalk = false;
    }
    return message;
  },
  toJSON(message: SuggestConfig): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    message.positional !== undefined &&
      (obj.positional = message.positional);
    message.pushToTalk !== undefined &&
      (obj.pushToTalk = message.pushToTalk);
    return obj;
  },
};

interface WindowBase64 {
  atob(b64: string): string;
  btoa(bin: string): string;
}

const windowBase64 = (globalThis as unknown) as WindowBase64;
const atob =
  windowBase64.atob ||
  ((b64: string) => Buffer.from(b64, 'base64').toString('binary'));
const btoa =
  windowBase64.btoa ||
  ((bin: string) => Buffer.from(bin, 'binary').toString('base64'));

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(''));
}
type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
