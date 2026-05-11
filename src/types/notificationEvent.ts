export const NOTIFICATION_CHANNELS = [
  'ORDER_UPDATE',
  'PROMO',
  'SUPPORT_REPLY',
  'PAYMENT',
  'SYSTEM',
] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = ['SENT', 'PARTIAL', 'FAILED'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export interface NotificationEvent {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  status: NotificationStatus;
  sentAt: Date;
}
