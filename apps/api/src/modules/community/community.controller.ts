import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CommunityService } from "./community.service";
import { CommunityQueryDto } from "./dto/community-query.dto";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";

@ApiTags("小区")
@Controller("communities")
/**
 * 小区选择和后台管理接口。
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

  @Get("admin/page")
  @ApiBearerAuth()
  @ApiOperation({ summary: "后台分页查询小区" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 后台分页查询小区。
   */
  findPage(@Query() query: CommunityQueryDto) {
    return this.communityService.findPage(query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建小区" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 创建小区，需要后台管理员登录。
   */
  create(@Body() dto: CreateCommunityDto) {
    return this.communityService.create(dto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新小区" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 更新小区，需要后台管理员登录。
   */
  update(@Param("id") id: string, @Body() dto: UpdateCommunityDto) {
    return this.communityService.update(id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除小区" })
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * 删除小区，需要后台管理员登录。
   */
  delete(@Param("id") id: string) {
    return this.communityService.delete(id);
  }
}
