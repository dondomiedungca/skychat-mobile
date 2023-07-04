import { Conversation } from './Conversation';
import { UsersConversations } from './UsersConversations';

export interface Role {
  id: string;
  name: string;
}

interface UserActivity {
  showActivity?: boolean;
  isActive?: boolean;
  lastActive?: Date;
}
interface UserMeta {
  google_id?: string;
  profile_photo: string;
  activity?: UserActivity;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
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
}
