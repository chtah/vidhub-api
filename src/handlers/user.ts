import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { IBlacklistRepository, IUserRepository } from "../repositories";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import {
  JWT_SECRET,
  REQUIRED_RECORD_NOT_FOUND,
  getAuthToken,
} from "../utils/const";
import { AuthStatus } from "../middleware/jwt";
import mapToDto from "../utils/user.mapper";
import { IMessageDto } from "../dto/message";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  private blacklistRepo: IBlacklistRepository;

  constructor(repo: IUserRepository, blacklistRepo: IBlacklistRepository) {
    this.repo = repo;
    this.blacklistRepo = blacklistRepo;
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

    if (typeof name !== "string" || name.length === 0) {
      return res.status(400).json({ message: "name is invalid" });
    }

    if (typeof username !== "string" || username.length === 0) {
      return res.status(400).json({ message: "username is invalid" });
    }

    if (typeof plainPassword !== "string" || plainPassword.length < 5) {
      return res.status(400).json({ message: "password is invalid" });
    }

    try {
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
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(500).json({
          message: `name is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };

  public login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        const { password, id } = await this.repo.findByUsername(username);

        if (!verifyPassword(plainPassword, password))
          throw new Error("Invalid username or password");
        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "vidhub-api",
          subject: "user-credential",
        });
        return res.status(200).json({ accessToken }).end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" })
          .end();
      }
    };

  public selfcheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const { registeredAt, ...others } = await this.repo.findById(
        res.locals.user.id
      );

      return res
        .status(200)
        .json({ ...others, registeredAt: registeredAt.toISOString() })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(500).send({ message: "Internal Server Error" }).end();
    }
  };

  public getInfoByUsername: RequestHandler<
    { username: string },
    IUserDto | IErrorDto
  > = async (req, res) => {
    const { username } = req.params;
    try {
      const userInfo = await this.repo.findByUsername(username);

      return res.status(200).json(mapToDto(userInfo)).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === REQUIRED_RECORD_NOT_FOUND
      )
        return res.status(404).json({ message: `User not found` }).end();

      return res.status(500).json({ message: `Internal Server Error` }).end();
    }
  };

  public logout: RequestHandler<
    {},
    IMessageDto,
    undefined,
    undefined,
    AuthStatus
  > = async (req, res) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader)
        return res
          .status(400)
          .json({
            message: "Authorization header is expected",
          })
          .end();
      const authToken = getAuthToken(authHeader);
      const { exp } = verify(authToken, JWT_SECRET) as JwtPayload;
      if (!exp)
        return res
          .status(400)
          .json({
            message: "JWT is invalid",
          })
          .end();

      await this.blacklistRepo.addToBlacklist(authToken, exp * 1000);

      return res
        .status(200)
        .json({
          message: "You've been logged out",
        })
        .end();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Internal Server Error",
        })
        .end();
    }
  };
}
