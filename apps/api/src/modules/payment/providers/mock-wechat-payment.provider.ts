import { Injectable } from "@nestjs/common";
import { createPaymentNo } from "../../../common/utils/order-number";
import type {
  CreateWechatPaymentResult,
  WechatPaymentProvider,
} from "./wechat-payment.types";

/**
 * Local-development WeChat payment provider.
 *
 * Real WeChat Pay signing and certificate handling should replace this provider
 * without changing payment application-service code.
 */
@Injectable()
export class MockWechatPaymentProvider implements WechatPaymentProvider {
  /**
   * Creates deterministic mock Mini Program payment parameters.
   */
  async createMiniProgramPayment(input: {
    paymentNo: string;
    orderNo: string;
    amountFen: number;
    description: string;
  }): Promise<CreateWechatPaymentResult> {
    return {
      prepayId: input.paymentNo,
      mock: true,
      payParams: {
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: createPaymentNo(),
        package: `prepay_id=${input.paymentNo}`,
        signType: "RSA",
        paySign: "mock-pay-sign",
      },
    };
  }
}
