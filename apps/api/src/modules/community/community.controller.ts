import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommunityService } from "./community.service";

@ApiTags("小区")
@Controller("communities")
/**
 * 小区公开选择接口。
 */
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: "查询可选小区" })
  /**
   * 查询用户下单时可选择的小区。
   */
  findMany() {
    return this.communityService.findMany();
  }

}
