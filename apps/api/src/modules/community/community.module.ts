import { Module } from "@nestjs/common";
import { AdminOperationLogModule } from "../admin-operation-log/admin-operation-log.module";
import { AdminCommunityController } from "./admin-community.controller";
import { CommunityController } from "./community.controller";
import { CommunityRepository } from "./community.repository";
import { CommunityService } from "./community.service";

@Module({
  imports: [AdminOperationLogModule],
  controllers: [CommunityController, AdminCommunityController],
  providers: [CommunityService, CommunityRepository],
})
/**
 * 小区模块。
 */
export class CommunityModule {}
