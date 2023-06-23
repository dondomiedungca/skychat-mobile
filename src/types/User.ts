export interface Role {
  id: string;
  name: string;
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
  picture?: string;
  googleId?: string;
}
