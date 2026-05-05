import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { ErrorCode } from "../exceptions/error-code.enum";
import type { ApiErrorResponse } from "../interfaces/api-error.interface";

@Catch()
/**
 * 将抛出的异常转换为统一 API 错误响应。
 */
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 同时处理 Nest HTTP 异常和未知运行时异常。
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : undefined;
    const objectPayload = typeof payload === "object" && payload !== null ? payload : undefined;
    const message =
      objectPayload && "message" in objectPayload
        ? (objectPayload as { message: string | string[] }).message
        : exception instanceof Error
          ? exception.message
          : "服务器内部错误";
    const code =
      objectPayload && "code" in objectPayload
        ? String((objectPayload as { code: string }).code)
        : this.resolveDefaultCode(status);
    const details =
      objectPayload && "details" in objectPayload
        ? (objectPayload as { details: unknown }).details
        : undefined;

    const body: ApiErrorResponse = {
      success: false,
      code,
      statusCode: status,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  /**
   * 将常见 HTTP 状态码映射为稳定 API 错误码。
   */
  private resolveDefaultCode(status: number) {
    if (status === HttpStatus.UNAUTHORIZED) return ErrorCode.UNAUTHORIZED;
    if (status === HttpStatus.FORBIDDEN) return ErrorCode.FORBIDDEN;
    if (status === HttpStatus.NOT_FOUND) return ErrorCode.NOT_FOUND;
    if (status === HttpStatus.BAD_REQUEST) return ErrorCode.VALIDATION_FAILED;
    return ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
