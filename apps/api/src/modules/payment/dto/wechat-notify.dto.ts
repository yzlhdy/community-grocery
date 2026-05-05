import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

/**
 * 第一阶段使用的简化微信支付回调参数。
 */
export class WechatNotifyDto {
  /** 内部支付单号。 */
  @ApiProperty({ description: "内部支付单号" })
  @IsString()
  @MinLength(1)
  paymentNo!: string;

  /** 微信侧交易单号。 */
  @ApiPropertyOptional({ description: "微信侧交易单号" })
  @IsOptional()
  @IsString()
  transactionId?: string;

  /** 支付结果状态。 */
  @ApiPropertyOptional({ description: "支付结果状态", enum: ["SUCCESS", "FAILED"] })
  @IsOptional()
  @IsIn(["SUCCESS", "FAILED"])
  status?: "SUCCESS" | "FAILED";

  /** 用于审计留存的原始回调内容。 */
  @ApiPropertyOptional({ description: "用于审计留存的原始回调内容" })
  @IsOptional()
  rawPayload?: unknown;
}
