// import { RedisClientType } from "redis";
// import { IBlacklistRepository } from ".";
// import { BLACKLIST_REDIS_VALUE } from "../utils/const";

// export default class BlacklistRepository implements IBlacklistRepository {
//   private clnt: RedisClientType;

//   constructor(clnt: RedisClientType) {
//     this.clnt = clnt;
//   }

//   async addToBlacklist(token: string, exp: number): Promise<void> {
//     await this.clnt.SET(`bl_${token}`, BLACKLIST_REDIS_VALUE); //ex add "1" to redis
//     await this.clnt.EXPIREAT(`bl_${token}`, exp); //handle exp by redis
//     return;
//   }

//   async isAlreadyBlacklisted(token: string): Promise<boolean> {
//     const val = await this.clnt.GET(`bl_${token}`);
//     return val === BLACKLIST_REDIS_VALUE; //check "1" is appear if not token expire
//   }
// }
