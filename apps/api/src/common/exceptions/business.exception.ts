import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-code.enum";

/**
 * 用于可预期领域规则和业务规则失败的异常。
 */
export class BusinessException extends HttpException {
  /**
   * 创建标准业务异常响应体。
   */
  constructor(
    readonly code: ErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    readonly details?: unknown,
  ) {
    super({ code, message, details }, status);
  }
}
