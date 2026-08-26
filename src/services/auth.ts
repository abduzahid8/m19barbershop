export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const defaultGuest: AuthUser = {
  id: 'guest',
  email: 'guest@dev.local',
  name: 'Guest',
};
