import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

/**
 * 后台账号密码登录参数。
 */
export class AdminLoginDto {
  /** 后台用户名。 */
  @ApiProperty({ description: "后台用户名", example: "admin" })
  @IsString()
  @MinLength(1)
  username!: string;

  /** 后台密码。 */
  @ApiProperty({ description: "后台密码", example: "admin123456" })
  @IsString()
  @MinLength(1)
  password!: string;
}
