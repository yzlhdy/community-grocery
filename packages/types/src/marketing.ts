export type BannerScene = "HOME_TOP" | "HOME_PROMOTION";

export type PromotionType = "SECKILL" | "RECOMMEND";

export type CouponType = "FULL_REDUCTION";

export type CustomerCouponStatus = "AVAILABLE" | "USED" | "EXPIRED";

export interface HomeBanner {
  id: string;
  scene: BannerScene;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkType?: string | null;
  linkValue?: string | null;
  sort: number;
  enabled: boolean;
}

export interface CouponTemplate {
  id: string;
  type: CouponType;
  title: string;
  description?: string | null;
  thresholdAmount: number;
  discountAmount: number;
  enabled: boolean;
}
