export interface Role {
  id: string;
  name: string;
}

interface UserMeta {
  google_id?: string;
  profile_photo: string;
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
}
