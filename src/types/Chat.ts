import { IMessage } from 'react-native-gifted-chat';
import { Conversation } from './Conversation';
import { User } from './User';

export interface Chat {
  id: number;

  user?: User;

  conversation?: Conversation;

  text: string;

  chat_meta: IMessage;

  deleted_at?: Date;

  deleted_by?: User;
}
