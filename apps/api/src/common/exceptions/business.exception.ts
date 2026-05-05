import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-code.enum";

/**
 * Exception used for predictable domain and business-rule failures.
 */
export class BusinessException extends HttpException {
  /**
   * Creates a standard business exception payload.
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
