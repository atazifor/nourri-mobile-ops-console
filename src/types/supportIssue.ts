export const SUPPORT_CATEGORIES = [
  'DELIVERY',
  'PHARMACY',
  'GROCERY',
  'PAYMENT',
  'RIDER',
  'APP_BUG',
] as const;
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export const SUPPORT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number];

export const SUPPORT_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
] as const;
export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

export interface SupportIssue {
  id: string;
  subject: string;
  description: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  reportedByUid: string;
  reportedByName: string;
  reportedByEmail: string;
  orderRef?: string;
  createdAt: Date;
  updatedAt: Date;
}
