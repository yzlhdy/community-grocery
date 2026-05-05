import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { WechatLoginDto } from "./dto/wechat-login.dto";

@ApiTags("认证")
@Controller("auth")
/**
 * 后台和小程序认证接口。
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admin/login")
  @ApiOperation({ summary: "后台账号密码登录" })
  /**
   * 使用账号密码登录后台。
   */
  loginAdmin(@Body() dto: AdminLoginDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post("wechat/login")
  @ApiOperation({ summary: "小程序微信登录" })
  /**
   * 通过微信登录 code 换取小程序用户身份。
   */
  loginWechat(@Body() dto: WechatLoginDto) {
    return this.authService.loginWechat(dto);
  }
}
