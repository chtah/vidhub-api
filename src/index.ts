import { PrismaClient } from "@prisma/client";
import express from "express";
import { IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";

const clnt = new PrismaClient();
const PORT = Number(process.env.PORT || 8888);

const app = express();

const userRepo: IUserRepository = new UserRepository(clnt);

const userHandler: IUserHandler = new UserHandler(userRepo);

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VidHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

app.listen(PORT, () => {
  console.log(`VidHub API is up at ${PORT}`);
});
