export interface Community {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
}

export interface PickupPoint {
  id: string;
  communityId: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  pickupTimeRange: string;
  leaderName?: string | null;
  leaderAvatarUrl?: string | null;
  servicePhone?: string | null;
  serviceTimeRange?: string | null;
  enabled: boolean;
}
