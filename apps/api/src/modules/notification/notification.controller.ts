import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { PageQueryDto } from "../../common/dto/page-query.dto";
import { NotificationService } from "./notification.service";

@ApiTags("通知")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("notifications")
/**
 * 小程序用户站内通知接口。
 */
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("mine")
  @ApiOperation({ summary: "查询我的通知" })
  /**
   * 查询当前登录用户通知列表。
   */
  findMine(@CurrentUser() user: AuthUser, @Query() query: PageQueryDto) {
    return this.notificationService.findMine(user.sub, query);
  }

  @Get("unread-count")
  @ApiOperation({ summary: "查询未读通知数量" })
  /**
   * 查询当前登录用户未读通知数量。
   */
  countUnread(@CurrentUser() user: AuthUser) {
    return this.notificationService.countUnread(user.sub);
  }

  @Post(":id/read")
  @ApiOperation({ summary: "标记通知已读" })
  /**
   * 将一条通知标记为已读。
   */
  markRead(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.notificationService.markRead(user.sub, id);
  }

  @Post("read-all")
  @ApiOperation({ summary: "全部通知标记已读" })
  /**
   * 将当前用户全部通知标记为已读。
   */
  markAllRead(@CurrentUser() user: AuthUser) {
    return this.notificationService.markAllRead(user.sub);
  }
}
