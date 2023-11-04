import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";

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
}
