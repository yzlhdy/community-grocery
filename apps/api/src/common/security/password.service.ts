import { Injectable } from "@nestjs/common";
import { hash, verify } from "argon2";

/**
 * 统一管理密码哈希和密码校验。
 *
 * 默认使用 argon2 包提供的 Argon2id，适合用于保存密码哈希。
 */
@Injectable()
export class PasswordService {
  /**
   * 在入库前对明文密码进行哈希。
   */
  hashPassword(plainPassword: string) {
    return hash(plainPassword);
  }

  /**
   * 校验明文密码是否匹配 Argon2 哈希。
   */
  verifyPassword(hashValue: string, plainPassword: string) {
    return verify(hashValue, plainPassword);
  }
}
