import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
/**
 * Security infrastructure module.
 */
export class SecurityModule {}
