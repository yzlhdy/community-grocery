import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
/**
 * 通知模块，负责站内消息并预留外部消息通道。
 */
export class NotificationModule {}
