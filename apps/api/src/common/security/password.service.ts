import { Injectable } from "@nestjs/common";
import { hash, verify } from "argon2";

/**
 * Centralizes password hashing and verification.
 *
 * Argon2id is used by default through the argon2 package, which is more
 * suitable for password storage than general-purpose fast hashes.
 */
@Injectable()
export class PasswordService {
  /**
   * Hashes a plain password before storing it.
   */
  hashPassword(plainPassword: string) {
    return hash(plainPassword);
  }

  /**
   * Verifies a plain password against an Argon2 hash.
   */
  verifyPassword(hashValue: string, plainPassword: string) {
    return verify(hashValue, plainPassword);
  }
}
