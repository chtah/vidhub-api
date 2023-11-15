import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { ICreateContentDto, IUpdateContentDto } from "../dto/content";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface ICreateContent
  extends Omit<Content, "ownerId" | "id" | "createdAt" | "updatedAt"> {}

export interface IContent extends Content {
  User: IUser;
}

/*Same as above IUser*/
// export interface IUser
//   extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface IContentRepository {
  create(ownerId: string, content: ICreateContent): Promise<IContent>;
  getAll(): Promise<IContent[]>;
  getById(id: number): Promise<IContent>;
  getOwnerId(id: number): Promise<string>;
  updateById(id: number, data: IUpdateContentDto): Promise<IContent>;
  deleteById(id: number): Promise<IContent>;
}

export interface IBlacklistRepository {
  addToBlacklist(token: string, exp: number): Promise<void>;
  isAlreadyBlacklisted(token: string): Promise<boolean>;
}
