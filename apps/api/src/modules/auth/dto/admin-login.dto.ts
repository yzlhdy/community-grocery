import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

/**
 * Payload for operator/admin password login.
 */
export class AdminLoginDto {
  /** Admin username. */
  @ApiProperty({ example: "admin" })
  @IsString()
  @MinLength(1)
  username!: string;

  /** Admin password. */
  @ApiProperty({ example: "admin123456" })
  @IsString()
  @MinLength(1)
  password!: string;
}
