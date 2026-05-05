import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
/**
 * 安全基础设施模块。
 */
export class SecurityModule {}
