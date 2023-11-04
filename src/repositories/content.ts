import { Prisma, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { DEFAULT_USER_FIELDS } from "./user";
import { IUpdateContentDto } from "../dto/content";

const INCLUDE_OWNERS: Prisma.ContentInclude = {
  User: {
    select: DEFAULT_USER_FIELDS,
  },
};

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(
    ownerId: string,
    content: ICreateContent
  ): Promise<IContent> {
    return await this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: ownerId },
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: INCLUDE_OWNERS,
    });
  }

  getById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }

  deleteById(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }

  updateById(id: number, data: IUpdateContentDto): Promise<IContent> {
    return this.prisma.content.update({
      data,
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }

  async getOwnerId(id: number): Promise<string> {
    const { ownerId } = await this.prisma.content.findUniqueOrThrow({
      select: { ownerId: true },
      where: { id },
    });
    return ownerId;
  }
}
