import { Conversation } from './Conversation';
import { User } from './User';

export interface Chat {
  id: number;

  user?: User;

  conversation?: Conversation;

  text: string;

  chat_meta: any;

  readed_at?: Date;

  created_at?: Date;

  deleted_at?: Date;

  deleted_by?: User;
}
