import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

/**
 * Simplified WeChat payment notification payload used by the first phase.
 */
export class WechatNotifyDto {
  /** Internal payment number. */
  @ApiProperty()
  @IsString()
  @MinLength(1)
  paymentNo!: string;

  /** Upstream WeChat transaction identifier. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  /** Payment result status. */
  @ApiPropertyOptional({ enum: ["SUCCESS", "FAILED"] })
  @IsOptional()
  @IsIn(["SUCCESS", "FAILED"])
  status?: "SUCCESS" | "FAILED";

  /** Raw callback payload for audit storage. */
  @ApiPropertyOptional()
  @IsOptional()
  rawPayload?: unknown;
}
