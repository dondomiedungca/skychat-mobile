import { User } from './User';
import { UsersConversations } from './UsersConversations';

export interface RecentConversation {
  user_first_name: string;
  user_last_name: string;
  lastUser: string;
  lastMessage: string;
  unread: number;
  lastDateTime: string | Date;
  conversation_id: string;
  conversation_type: string;
  user_user_meta: {
    profile_photo: string;
  };
  user_partner?: User;
  users_conversations?: UsersConversations[];
}
