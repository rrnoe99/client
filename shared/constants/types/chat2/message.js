// Types related to a message
// @flow
import * as Common from './common'
import * as RPCTypes from '../rpc-gen'
import * as I from 'immutable'
import HiddenString from '../../../util/hidden-string'
import type {DeviceType} from '../devices'

// The actual ID the server uses for operations (edit, delete etc)
export opaque type MessageID: number = number
export const numberToMessageID = (n: number): MessageID => n

// We use the ordinal as the primary ID throughout the UI. The reason we have this vs a messageID is
// 1. We don't have messageIDs for messages we're trying to send (pending messages)
// 2. When a message is sent we want to maintain the order of it from our perspective, even though we might have gotten newer messages before it actually went through. In order to make this work we keep the ordinal as-is even though we actually do get a real messageID.
// The ordinals for existing messages is usually 1:1 to message ids. Ordinals for pending messages are fractional increments of the last message we've seen
//
// ex:
// chris: Hi (id: 100, ordinal: 100)
// danny: Hey (id: 101, ordinal: 101)
// chris: this isn't sent yet (id: 0, ordinal: 101.001)
// danny: Are you there? (id: 102, ordinal: 102)
// (later we get an ordinal of 103, so it'll be (id: 103, ordinal: 101.001). We keep the ordinal so our list doesn't re-order itself from our perspective. On a later
// load it will be 100, 101, 102, 103 and be chris, danny, danny, chris
export opaque type Ordinal = number
export const numberToOrdinal = (n: number): Ordinal => n
export const ordinalToNumber = (o: Ordinal): number => o

export opaque type OutboxID: string = string
export const stringToOutboxID = (s: string): OutboxID => s
export const outboxIDToString = (o: OutboxID): string => o

export type MentionsAt = I.Set<string>
export type MentionsChannel = 'none' | 'all' | 'here'
export type MentionsChannelName = I.Map<string, Common.ConversationIDKey>

export type MessageExplodeDescription = {text: string, seconds: number}

// Message types have a lot of copy and paste. Originally I had this split out but this
// causes flow to get confused or makes the error messages a million times harder to understand

export type _MessagePlaceholder = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  type: 'placeholder',
}

export type MessagePlaceholder = I.RecordOf<_MessagePlaceholder>

// We keep deleted messages around so the bookkeeping is simpler
export type _MessageDeleted = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  deviceName: string,
  deviceRevokedAt: ?number,
  deviceType: DeviceType,
  hasBeenEdited: boolean,
  errorReason: ?string,
  id: MessageID,
  ordinal: Ordinal,
  outboxID: ?OutboxID,
  timestamp: number,
  type: 'deleted',
}
export type MessageDeleted = I.RecordOf<_MessageDeleted>

export type _MessageText = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  deviceName: string,
  deviceRevokedAt: ?number,
  deviceType: DeviceType,
  errorReason: ?string,
  exploded: boolean,
  explodedBy: string, // only if 'explode now' happened
  exploding: boolean,
  explodingTime: number,
  explodingUnreadable: boolean, // if we can't read this message bc we have no keys
  hasBeenEdited: boolean,
  id: MessageID,
  submitState: null | 'deleting' | 'editing' | 'pending' | 'failed',
  mentionsAt: MentionsAt,
  mentionsChannel: MentionsChannel,
  mentionsChannelName: MentionsChannelName,
  ordinal: Ordinal,
  outboxID: ?OutboxID,
  text: HiddenString,
  timestamp: number,
  type: 'text',
}
export type MessageText = I.RecordOf<_MessageText>

export type AttachmentType = 'image' | 'file'

export type _MessageAttachment = {
  attachmentType: AttachmentType,
  showPlayButton: boolean,
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  fileURL: string,
  previewURL: string,
  fileType: string, // MIME type
  deviceName: string,
  deviceRevokedAt: ?number,
  deviceType: DeviceType,
  downloadPath: ?string, // string if downloaded
  errorReason: ?string,
  exploded: boolean,
  explodedBy: string, // only if 'explode now' happened
  exploding: boolean,
  explodingTime: number,
  explodingUnreadable: boolean, // if we can't read this message bc we have no keys
  fileName: string,
  fileSize: number,
  hasBeenEdited: boolean,
  id: MessageID, // that of first attachment message, not second attachment-uploaded message
  ordinal: Ordinal,
  outboxID: ?OutboxID,
  previewHeight: number,
  previewWidth: number,
  submitState: null | 'deleting' | 'pending' | 'failed',
  timestamp: number,
  title: string,
  transferProgress: number, // 0-1 // only for the file
  transferState: 'uploading' | 'downloading' | 'remoteUploading' | null,
  previewTransferState: 'downloading' | null, // only for preview
  type: 'attachment',
}
export type MessageAttachment = I.RecordOf<_MessageAttachment>

// Note that all these MessageSystem* messages are generated by the sender's client
// at the time that the message is sent. Associated message data that relates to
// conversation (e.g. teamname, isAdmin) rather than the message may have changed since
// the message was created. Because of this it's probably more reliable to look at
// other places in the store to get that information when possible.
export type _MessageSystemInviteAccepted = {
  adder: string,
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  inviteType: 'none' | 'unknown' | 'keybase' | 'email' | 'sbs' | 'text',
  invitee: string,
  inviter: string,
  ordinal: Ordinal,
  team: string,
  timestamp: number,
  type: 'systemInviteAccepted',
}
export type MessageSystemInviteAccepted = I.RecordOf<_MessageSystemInviteAccepted>

export type _MessageSystemSimpleToComplex = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  team: string,
  type: 'systemSimpleToComplex',
}
export type MessageSystemSimpleToComplex = I.RecordOf<_MessageSystemSimpleToComplex>

export type _MessageSystemGitPush = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  pusher: string,
  refs: Array<RPCTypes.GitRefMetadata>,
  repo: string,
  repoID: string,
  team: string,
  timestamp: number,
  type: 'systemGitPush',
}
export type MessageSystemGitPush = I.RecordOf<_MessageSystemGitPush>

export type _MessageSystemAddedToTeam = {
  addee: string,
  adder: string,
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  isAdmin: boolean,
  ordinal: Ordinal,
  team: string,
  timestamp: number,
  type: 'systemAddedToTeam',
}
export type MessageSystemAddedToTeam = I.RecordOf<_MessageSystemAddedToTeam>

export type _MessageSystemJoined = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  type: 'systemJoined',
}
export type MessageSystemJoined = I.RecordOf<_MessageSystemJoined>

export type _MessageSystemLeft = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  type: 'systemLeft',
}
export type MessageSystemLeft = I.RecordOf<_MessageSystemLeft>

export type _MessageSystemText = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  text: HiddenString,
  type: 'systemText',
}
export type MessageSystemText = I.RecordOf<_MessageSystemText>

export type _MessageSetDescription = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  newDescription: HiddenString,
  type: 'setDescription',
}
export type MessageSetDescription = I.RecordOf<_MessageSetDescription>

export type _MessageSetChannelname = {
  author: string,
  conversationIDKey: Common.ConversationIDKey,
  id: MessageID,
  ordinal: Ordinal,
  timestamp: number,
  newChannelname: string,
  type: 'setChannelname',
}
export type MessageSetChannelname = I.RecordOf<_MessageSetChannelname>

export type Message =
  | MessageAttachment
  | MessageDeleted
  | MessageSetChannelname
  | MessageSetDescription
  | MessageSystemAddedToTeam
  | MessageSystemGitPush
  | MessageSystemInviteAccepted
  | MessageSystemJoined
  | MessageSystemLeft
  | MessageSystemSimpleToComplex
  | MessageSystemText
  | MessageText
  | MessagePlaceholder
