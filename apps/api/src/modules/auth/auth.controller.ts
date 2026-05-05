import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { WechatLoginDto } from "./dto/wechat-login.dto";

@ApiTags("auth")
@Controller("auth")
/**
 * Authentication endpoints for admin and mini program clients.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admin/login")
  /**
   * Logs in an admin user with username and password.
   */
  loginAdmin(@Body() dto: AdminLoginDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post("wechat/login")
  /**
   * Logs in a mini program customer through WeChat code exchange.
   */
  loginWechat(@Body() dto: WechatLoginDto) {
    return this.authService.loginWechat(dto);
  }
}
