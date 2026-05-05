/**
 * Parameters required by WeChat Mini Program payment API.
 */
export interface WechatMiniProgramPayParams {
  /** Unix timestamp string. */
  timeStamp: string;
  /** Random nonce string. */
  nonceStr: string;
  /** WeChat prepay package value. */
  package: string;
  /** Payment signature algorithm. */
  signType: "RSA";
  /** Payment signature. */
  paySign: string;
}

/**
 * Result returned by a payment provider after creating a prepay order.
 */
export interface CreateWechatPaymentResult {
  /** Provider prepay identifier. */
  prepayId: string;
  /** Mini Program payment parameters. */
  payParams: WechatMiniProgramPayParams;
  /** Whether this provider result is mocked for local development. */
  mock: boolean;
}

/**
 * Provider boundary for WeChat payment integration.
 */
export interface WechatPaymentProvider {
  /**
   * Creates a Mini Program payment order with the upstream provider.
   */
  createMiniProgramPayment(input: {
    paymentNo: string;
    orderNo: string;
    amountFen: number;
    description: string;
    openId?: string;
  }): Promise<CreateWechatPaymentResult>;
}

/**
 * DI token for the WeChat payment provider.
 */
export const WECHAT_PAYMENT_PROVIDER = Symbol("WECHAT_PAYMENT_PROVIDER");
