export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registeredAt: string;
}

export interface ICreateUserDto /*extends Pick<IUserDto,"name"|"username">*/ /*CODE THAT COMMENT SAME BELOW*/ {
  name: string;
  username: string;
  password: string;
}
