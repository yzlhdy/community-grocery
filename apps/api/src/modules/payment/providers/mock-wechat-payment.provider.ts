import { Injectable } from "@nestjs/common";
import { createPaymentNo } from "../../../common/utils/order-number";
import type {
  CreateWechatPaymentResult,
  WechatPaymentProvider,
} from "./wechat-payment.types";

/**
 * 本地开发使用的微信支付提供者。
 *
 * 后续接入真实微信支付签名和证书时，只需要替换该提供者，
 * 不需要改动支付应用服务代码。
 */
@Injectable()
export class MockWechatPaymentProvider implements WechatPaymentProvider {
  /**
   * 创建可预测的模拟小程序支付参数。
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
