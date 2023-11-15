import { PrismaClient } from "@prisma/client";
import express from "express";
import { createClient } from "redis";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";
import cors from "cors";

const clnt = new PrismaClient();
const PORT = Number(process.env.PORT || 8888);
const app = express();
//const redisClnt = createClient();

app.use(cors());

const userRepo: IUserRepository = new UserRepository(clnt);
//const blacklistRepo: IBlacklistRepository = new BlacklistRepository(clnt);
const userHandler: IUserHandler = new UserHandler(userRepo);

const contentRepo: IContentRepository = new ContentRepository(clnt);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());

//-------------------------------------------------------------

app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome to VidHub").end();
});

//---------------------------------------------------------------

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);
userRouter.get("/:username", userHandler.getInfoByUsername);

//---------------------------------------------------------------

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.post("/login", userHandler.login);

authRouter.get("/me", jwtMiddleware.auth, userHandler.selfcheck);

//authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);

//---------------------------------------------------------------

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getById);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);
//--------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`VidHub API is up at ${PORT}`);
});
