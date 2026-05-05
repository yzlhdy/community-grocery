import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PasswordService } from "../../common/security/password.service";
import type { AdminLoginDto } from "./dto/admin-login.dto";
import type { WechatLoginDto } from "./dto/wechat-login.dto";

interface WechatSession {
  openid: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
/**
 * Handles admin password authentication and WeChat customer authentication.
 */
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Authenticates a backend user and returns a JWT for admin APIs.
   */
  async loginAdmin(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { username: dto.username },
    });

    if (!admin || !admin.enabled) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const matched = await this.passwordService.verifyPassword(admin.passwordHash, dto.password);
    if (!matched) {
      throw new UnauthorizedException("Invalid username or password");
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: admin.id,
        role: "admin",
        username: admin.username,
      }),
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  /**
   * Authenticates or creates a customer from a WeChat Mini Program login code.
   */
  async loginWechat(dto: WechatLoginDto) {
    const session = await this.getWechatSession(dto.code);
    if (session.errcode || !session.openid) {
      throw new UnauthorizedException(session.errmsg ?? "Wechat login failed");
    }

    const customer = await this.prisma.customer.upsert({
      where: { openId: session.openid },
      update: {
        unionId: session.unionid,
        nickname: dto.nickname,
        avatarUrl: dto.avatarUrl,
      },
      create: {
        openId: session.openid,
        unionId: session.unionid,
        nickname: dto.nickname,
        avatarUrl: dto.avatarUrl,
      },
    });

    return {
      accessToken: await this.jwtService.signAsync({
        sub: customer.id,
        role: "customer",
        openId: customer.openId,
      }),
      customer,
    };
  }

  /**
   * Exchanges a WeChat login code for a session; falls back to dev mode if
   * WeChat credentials are not configured locally.
   */
  private async getWechatSession(code: string): Promise<WechatSession> {
    const appId = this.configService.get<string>("WECHAT_APP_ID");
    const secret = this.configService.get<string>("WECHAT_APP_SECRET");

    if (!appId || !secret) {
      return {
        openid: `dev-${code}`,
      };
    }

    const params = new URLSearchParams({
      appid: appId,
      secret,
      js_code: code,
      grant_type: "authorization_code",
    });
    const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`);
    return (await response.json()) as WechatSession;
  }
}
