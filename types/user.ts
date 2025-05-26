import { AvatarType } from "./avatar";

export type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
  avatarId?: number | null | undefined;
};
