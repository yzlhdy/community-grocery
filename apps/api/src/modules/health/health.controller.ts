import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("健康检查")
@Controller("health")
/**
 * 面向基础设施和部署探针的健康检查接口。
 */
export class HealthController {
  /**
   * 返回 API 基础存活信息。
   */
  @Get()
  @ApiOperation({ summary: "健康检查" })
  getHealth() {
    return {
      status: "ok",
      service: "community-grocery-api",
    };
  }
}
