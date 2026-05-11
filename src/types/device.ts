export const DEVICE_PLATFORMS = ['IOS', 'ANDROID'] as const;
export type DevicePlatform = (typeof DEVICE_PLATFORMS)[number];

export const DEVICE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type DeviceStatus = (typeof DEVICE_STATUSES)[number];

export interface Device {
  id: string;
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
  platform: DevicePlatform;
  appVersion: string;
  pushToken: string;
  status: DeviceStatus;
  lastSeenAt: Date | null;
  createdAt: Date;
}
