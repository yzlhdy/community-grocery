/**
 * 微信小程序支付 API 所需参数。
 */
export interface WechatMiniProgramPayParams {
  /** Unix 时间戳字符串。 */
  timeStamp: string;
  /** 随机字符串。 */
  nonceStr: string;
  /** 微信预支付 package 值。 */
  package: string;
  /** 支付签名算法。 */
  signType: "RSA";
  /** 支付签名。 */
  paySign: string;
}

/**
 * 支付提供者创建预支付订单后的返回结果。
 */
export interface CreateWechatPaymentResult {
  /** 支付提供者侧预支付标识。 */
  prepayId: string;
  /** 小程序支付参数。 */
  payParams: WechatMiniProgramPayParams;
  /** 当前支付结果是否为本地开发模拟数据。 */
  mock: boolean;
}

/**
 * 微信支付集成边界。
 */
export interface WechatPaymentProvider {
  /**
   * 通过上游支付提供者创建小程序支付订单。
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
 * 微信支付提供者的依赖注入令牌。
 */
export const WECHAT_PAYMENT_PROVIDER = Symbol("WECHAT_PAYMENT_PROVIDER");
