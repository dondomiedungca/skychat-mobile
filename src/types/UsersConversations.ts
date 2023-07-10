import { Conversation } from './Conversation';
import { User } from './User';

export interface UsersConversations {
  id: number;

  display_name: string;

  user: User;

  related_to: User;

  conversation: Conversation;

  deleted_at: Date;
}
