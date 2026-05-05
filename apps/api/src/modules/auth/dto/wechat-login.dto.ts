import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

/**
 * 微信小程序登录参数。
 */
export class WechatLoginDto {
  /** `wx.login` 返回的临时登录 code。 */
  @ApiProperty({ description: "wx.login 返回的临时登录 code", example: "wx-login-code" })
  @IsString()
  @MinLength(1)
  code!: string;

  /** 小程序侧采集的可选昵称。 */
  @ApiPropertyOptional({ description: "小程序侧采集的可选昵称", example: "张三" })
  @IsOptional()
  @IsString()
  nickname?: string;

  /** 小程序侧采集的可选头像地址。 */
  @ApiPropertyOptional({
    description: "小程序侧采集的可选头像地址",
    example: "https://example.com/avatar.png",
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
