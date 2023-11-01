import { PrismaClient } from "@prisma/client";
import express from "express";

const clnt = new PrismaClient();
const PORT = Number(process.env.PORT || 8888);
const app = express();

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to VidHub").end();
});

app.listen(PORT, () => {
  console.log(`VidHub API is up at ${PORT}`);
});
