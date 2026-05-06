import type { Community, PickupPoint } from "../../generated/prisma/client";

type CommunityWithPickupPoints = Community & { pickupPoints?: PickupPoint[] };

/**
 * 将小区数据库对象转换为接口响应对象。
 */
export function presentCommunity(community: CommunityWithPickupPoints) {
  return {
    id: community.id,
    name: community.name,
    address: community.address,
    enabled: community.enabled,
    pickupPoints: community.pickupPoints?.map(presentPickupPoint),
    createdAt: community.createdAt,
    updatedAt: community.updatedAt,
  };
}

/**
 * 将自提点数据库对象转换为接口响应对象。
 */
export function presentPickupPoint(pickupPoint: PickupPoint) {
  return {
    id: pickupPoint.id,
    communityId: pickupPoint.communityId,
    name: pickupPoint.name,
    address: pickupPoint.address,
    contactName: pickupPoint.contactName,
    contactPhone: pickupPoint.contactPhone,
    pickupTimeRange: pickupPoint.pickupTimeRange,
    leaderName: pickupPoint.leaderName,
    leaderAvatarUrl: pickupPoint.leaderAvatarUrl,
    servicePhone: pickupPoint.servicePhone,
    serviceTimeRange: pickupPoint.serviceTimeRange,
    enabled: pickupPoint.enabled,
    createdAt: pickupPoint.createdAt,
    updatedAt: pickupPoint.updatedAt,
  };
}
