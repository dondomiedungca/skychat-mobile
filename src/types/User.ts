import { Conversation } from './Conversation';
import { RecentConversation } from './RecentConversation';
import { UsersConversations } from './UsersConversations';

export interface Role {
  id: string;
  name: string;
}

interface UserActivity {
  show_activity?: boolean;
  is_active?: boolean;
  last_active?: Date;
}
interface UserMeta {
  google_id?: string;
  profile_photo: string;
  activity?: UserActivity;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  verified_at?: Date;
  is_deleted?: Boolean;
  deleted_at?: Date;
  roles?: Role[];
  user_meta?: UserMeta;
  conversations?: Conversation[];
  users_conversations?: UsersConversations[];
  recent_conversations?: RecentConversation[];
}
