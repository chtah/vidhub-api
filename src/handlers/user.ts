import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import { IUserRepository } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;
    // const name = req.body.name
    // const username = req.body.username
    // const plainPassword = req.body.password
    /*SAME AS ABOVE*/

    const {
      id: registerdId,
      name: registeredName,
      registeredAt,
      username: registeredUsername,
    } = await this.repo.create({
      name,
      username,
      password: hashPassword(plainPassword),
    });

    return res
      .status(201)
      .json({
        id: registerdId,
        name: registeredName,
        registeredAt: `${registeredAt}`, //registeredAt is Date need to change to string
        username: registeredUsername,
      })
      .end();
  };
}
