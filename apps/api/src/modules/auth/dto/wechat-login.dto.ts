import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

/**
 * Payload for WeChat Mini Program login.
 */
export class WechatLoginDto {
  /** WeChat temporary login code from wx.login. */
  @ApiProperty({ example: "wx-login-code" })
  @IsString()
  @MinLength(1)
  code!: string;

  /** Optional nickname captured by the Mini Program. */
  @ApiPropertyOptional({ example: "张三" })
  @IsOptional()
  @IsString()
  nickname?: string;

  /** Optional avatar URL captured by the Mini Program. */
  @ApiPropertyOptional({ example: "https://example.com/avatar.png" })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
