import { Module } from "@nestjs/common";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";

@Module({
  controllers: [CommunityController],
  providers: [CommunityService],
})
/**
 * Community module.
 */
export class CommunityModule {}
