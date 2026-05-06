import { Module } from "@nestjs/common";
import { AdminOperationLogService } from "./admin-operation-log.service";

/**
 * 后台操作审计日志模块。
 */
@Module({
  providers: [AdminOperationLogService],
  exports: [AdminOperationLogService],
})
export class AdminOperationLogModule {}
