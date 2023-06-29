import { Chat } from './Chat';
import { User } from './User';

export interface Conversation {
  id: number;

  type: string;

  conversation_meta: string | null;

  users?: User[];

  chats?: Chat[];

  created_at: Date;

  updated_at: Date;
}
