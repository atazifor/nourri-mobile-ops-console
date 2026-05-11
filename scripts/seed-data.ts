// Realistic Yaoundé / Nourri Express seed data.
//
// Names, neighborhoods, and restaurants are intentionally Cameroon-flavored;
// phone numbers use the +237 6XX XX XX XX format. Currency in copy is XAF.
// Times are seeded relative to "now" so the dataset always looks fresh.

const NOW = Date.now();
const minutesAgo = (n: number): Date => new Date(NOW - n * 60_000);
const hoursAgo = (n: number): Date => new Date(NOW - n * 3_600_000);
const daysAgo = (n: number): Date => new Date(NOW - n * 86_400_000);

interface SeedDoc<T> {
  id: string;
  data: T;
}

// ---------------------------------------------------------------- mobile users

interface MobileUserSeed {
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'SUPPORT';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt: Date;
  lastActiveAt: Date | null;
}

export const mobileUsers: SeedDoc<MobileUserSeed>[] = [
  // customers
  {
    id: 'mu_001',
    data: {
      name: 'Aminatou Tchamba',
      email: 'aminatou.tchamba@gmail.com',
      phone: '+237 691 23 45 67',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: daysAgo(94),
      lastActiveAt: hoursAgo(3),
    },
  },
  {
    id: 'mu_002',
    data: {
      name: 'Bertrand Eyong',
      email: 'bertrand.eyong@yahoo.fr',
      phone: '+237 670 88 12 34',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: daysAgo(62),
      lastActiveAt: minutesAgo(42),
    },
  },
  {
    id: 'mu_003',
    data: {
      name: 'Sandrine Mbarga',
      email: 'sandrine.mbarga@outlook.com',
      phone: '+237 656 90 14 22',
      role: 'CUSTOMER',
      status: 'PENDING',
      createdAt: daysAgo(2),
      lastActiveAt: hoursAgo(6),
    },
  },
  {
    id: 'mu_004',
    data: {
      name: 'Clarisse Ngono',
      email: 'clarisse.ngono@gmail.com',
      phone: '+237 698 11 22 33',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: daysAgo(180),
      lastActiveAt: hoursAgo(20),
    },
  },
  {
    id: 'mu_005',
    data: {
      name: 'Patrick Atangana',
      email: 'patrick.atangana@gmail.com',
      phone: '+237 677 45 67 89',
      role: 'CUSTOMER',
      status: 'SUSPENDED',
      createdAt: daysAgo(140),
      lastActiveAt: daysAgo(8),
    },
  },
  {
    id: 'mu_006',
    data: {
      name: 'Honorine Ngoumou',
      email: 'honorine.ngoumou@gmail.com',
      phone: '+237 691 76 54 32',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: daysAgo(28),
      lastActiveAt: hoursAgo(1),
    },
  },
  {
    id: 'mu_007',
    data: {
      name: 'Achille Fotso',
      email: 'achille.fotso@gmail.com',
      phone: '+237 670 33 44 55',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: daysAgo(11),
      lastActiveAt: hoursAgo(11),
    },
  },
  // riders
  {
    id: 'mu_008',
    data: {
      name: 'Eric Mbida',
      email: 'eric.mbida.rider@nourri.cm',
      phone: '+237 691 78 90 12',
      role: 'RIDER',
      status: 'ACTIVE',
      createdAt: daysAgo(210),
      lastActiveAt: minutesAgo(12),
    },
  },
  {
    id: 'mu_009',
    data: {
      name: 'Christian Nkeng',
      email: 'christian.nkeng.rider@nourri.cm',
      phone: '+237 670 33 21 44',
      role: 'RIDER',
      status: 'ACTIVE',
      createdAt: daysAgo(155),
      lastActiveAt: minutesAgo(34),
    },
  },
  {
    id: 'mu_010',
    data: {
      name: 'Brice Fouda',
      email: 'brice.fouda.rider@nourri.cm',
      phone: '+237 656 78 90 12',
      role: 'RIDER',
      status: 'SUSPENDED',
      createdAt: daysAgo(98),
      lastActiveAt: daysAgo(4),
    },
  },
  {
    id: 'mu_011',
    data: {
      name: 'Hortense Ngassa',
      email: 'hortense.ngassa.rider@nourri.cm',
      phone: '+237 698 22 33 44',
      role: 'RIDER',
      status: 'PENDING',
      createdAt: daysAgo(3),
      lastActiveAt: hoursAgo(7),
    },
  },
  // restaurants
  {
    id: 'mu_012',
    data: {
      name: 'Chez Tantine Pauline (Mvog-Mbi)',
      email: 'pauline.mvogmbi@nourripartners.cm',
      phone: '+237 222 23 14 50',
      role: 'RESTAURANT',
      status: 'ACTIVE',
      createdAt: daysAgo(312),
      lastActiveAt: minutesAgo(8),
    },
  },
  {
    id: 'mu_013',
    data: {
      name: 'Brochetterie du Carrefour Bastos',
      email: 'carrefour.bastos@nourripartners.cm',
      phone: '+237 222 21 45 67',
      role: 'RESTAURANT',
      status: 'ACTIVE',
      createdAt: daysAgo(245),
      lastActiveAt: hoursAgo(2),
    },
  },
  {
    id: 'mu_014',
    data: {
      name: 'Le Refuge — Nlongkak',
      email: 'lerefuge.nlongkak@nourripartners.cm',
      phone: '+237 222 22 34 56',
      role: 'RESTAURANT',
      status: 'PENDING',
      createdAt: daysAgo(6),
      lastActiveAt: hoursAgo(18),
    },
  },
  {
    id: 'mu_015',
    data: {
      name: 'Saveurs du 237 (Biyem-Assi)',
      email: 'saveurs237.biyemassi@nourripartners.cm',
      phone: '+237 222 25 67 89',
      role: 'RESTAURANT',
      status: 'ACTIVE',
      createdAt: daysAgo(178),
      lastActiveAt: minutesAgo(55),
    },
  },
  {
    id: 'mu_016',
    data: {
      name: 'Pharma Plus Mfandena',
      email: 'pharma.mfandena@nourripartners.cm',
      phone: '+237 222 20 88 11',
      role: 'RESTAURANT',
      status: 'ACTIVE',
      createdAt: daysAgo(120),
      lastActiveAt: hoursAgo(4),
    },
  },
  {
    id: 'mu_017',
    data: {
      name: 'Marché Express Tsinga',
      email: 'marche.tsinga@nourripartners.cm',
      phone: '+237 222 24 56 78',
      role: 'RESTAURANT',
      status: 'ACTIVE',
      createdAt: daysAgo(67),
      lastActiveAt: hoursAgo(9),
    },
  },
  // support staff
  {
    id: 'mu_018',
    data: {
      name: 'Larissa Tabi',
      email: 'larissa.tabi@nourri.cm',
      phone: '+237 670 11 22 33',
      role: 'SUPPORT',
      status: 'ACTIVE',
      createdAt: daysAgo(420),
      lastActiveAt: minutesAgo(5),
    },
  },
  {
    id: 'mu_019',
    data: {
      name: 'Stéphane Bell',
      email: 'stephane.bell@nourri.cm',
      phone: '+237 691 88 99 00',
      role: 'SUPPORT',
      status: 'ACTIVE',
      createdAt: daysAgo(298),
      lastActiveAt: minutesAgo(22),
    },
  },
];

// ---------------------------------------------------------------- devices

interface DeviceSeed {
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
  platform: 'IOS' | 'ANDROID';
  appVersion: string;
  pushToken: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastSeenAt: Date | null;
  createdAt: Date;
}

const fakeToken = (label: string): string =>
  `fcm_${label}_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 14)}`;

export const devices: SeedDoc<DeviceSeed>[] = [
  {
    id: 'dev_001',
    data: {
      ownerUid: 'mu_001',
      ownerName: 'Aminatou Tchamba',
      ownerEmail: 'aminatou.tchamba@gmail.com',
      platform: 'IOS',
      appVersion: '2.5.0',
      pushToken: fakeToken('ios'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(3),
      createdAt: daysAgo(94),
    },
  },
  {
    id: 'dev_002',
    data: {
      ownerUid: 'mu_002',
      ownerName: 'Bertrand Eyong',
      ownerEmail: 'bertrand.eyong@yahoo.fr',
      platform: 'ANDROID',
      appVersion: '2.4.7',
      pushToken: fakeToken('and'),
      status: 'ACTIVE',
      lastSeenAt: minutesAgo(42),
      createdAt: daysAgo(62),
    },
  },
  {
    id: 'dev_003',
    data: {
      ownerUid: 'mu_004',
      ownerName: 'Clarisse Ngono',
      ownerEmail: 'clarisse.ngono@gmail.com',
      platform: 'ANDROID',
      appVersion: '2.4.7',
      pushToken: fakeToken('and'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(20),
      createdAt: daysAgo(180),
    },
  },
  {
    id: 'dev_004',
    data: {
      ownerUid: 'mu_004',
      ownerName: 'Clarisse Ngono',
      ownerEmail: 'clarisse.ngono@gmail.com',
      platform: 'IOS',
      appVersion: '2.5.0',
      pushToken: fakeToken('ios'),
      status: 'INACTIVE',
      lastSeenAt: daysAgo(34),
      createdAt: daysAgo(120),
    },
  },
  {
    id: 'dev_005',
    data: {
      ownerUid: 'mu_005',
      ownerName: 'Patrick Atangana',
      ownerEmail: 'patrick.atangana@gmail.com',
      platform: 'ANDROID',
      appVersion: '2.3.2',
      pushToken: fakeToken('and'),
      status: 'INACTIVE',
      lastSeenAt: daysAgo(8),
      createdAt: daysAgo(140),
    },
  },
  {
    id: 'dev_006',
    data: {
      ownerUid: 'mu_006',
      ownerName: 'Honorine Ngoumou',
      ownerEmail: 'honorine.ngoumou@gmail.com',
      platform: 'IOS',
      appVersion: '2.5.0',
      pushToken: fakeToken('ios'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(1),
      createdAt: daysAgo(28),
    },
  },
  {
    id: 'dev_007',
    data: {
      ownerUid: 'mu_007',
      ownerName: 'Achille Fotso',
      ownerEmail: 'achille.fotso@gmail.com',
      platform: 'ANDROID',
      appVersion: '2.5.0-beta.3',
      pushToken: fakeToken('and'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(11),
      createdAt: daysAgo(11),
    },
  },
  {
    id: 'dev_008',
    data: {
      ownerUid: 'mu_008',
      ownerName: 'Eric Mbida',
      ownerEmail: 'eric.mbida.rider@nourri.cm',
      platform: 'ANDROID',
      appVersion: 'rider-1.8.4',
      pushToken: fakeToken('rider'),
      status: 'ACTIVE',
      lastSeenAt: minutesAgo(12),
      createdAt: daysAgo(210),
    },
  },
  {
    id: 'dev_009',
    data: {
      ownerUid: 'mu_009',
      ownerName: 'Christian Nkeng',
      ownerEmail: 'christian.nkeng.rider@nourri.cm',
      platform: 'ANDROID',
      appVersion: 'rider-1.8.4',
      pushToken: fakeToken('rider'),
      status: 'ACTIVE',
      lastSeenAt: minutesAgo(34),
      createdAt: daysAgo(155),
    },
  },
  {
    id: 'dev_010',
    data: {
      ownerUid: 'mu_010',
      ownerName: 'Brice Fouda',
      ownerEmail: 'brice.fouda.rider@nourri.cm',
      platform: 'ANDROID',
      appVersion: 'rider-1.7.2',
      pushToken: fakeToken('rider'),
      status: 'INACTIVE',
      lastSeenAt: daysAgo(4),
      createdAt: daysAgo(98),
    },
  },
  {
    id: 'dev_011',
    data: {
      ownerUid: 'mu_012',
      ownerName: 'Chez Tantine Pauline (Mvog-Mbi)',
      ownerEmail: 'pauline.mvogmbi@nourripartners.cm',
      platform: 'ANDROID',
      appVersion: 'partner-1.4.0',
      pushToken: fakeToken('partner'),
      status: 'ACTIVE',
      lastSeenAt: minutesAgo(8),
      createdAt: daysAgo(312),
    },
  },
  {
    id: 'dev_012',
    data: {
      ownerUid: 'mu_013',
      ownerName: 'Brochetterie du Carrefour Bastos',
      ownerEmail: 'carrefour.bastos@nourripartners.cm',
      platform: 'IOS',
      appVersion: 'partner-1.4.0',
      pushToken: fakeToken('partner'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(2),
      createdAt: daysAgo(245),
    },
  },
  {
    id: 'dev_013',
    data: {
      ownerUid: 'mu_015',
      ownerName: 'Saveurs du 237 (Biyem-Assi)',
      ownerEmail: 'saveurs237.biyemassi@nourripartners.cm',
      platform: 'ANDROID',
      appVersion: 'partner-1.4.0',
      pushToken: fakeToken('partner'),
      status: 'ACTIVE',
      lastSeenAt: minutesAgo(55),
      createdAt: daysAgo(178),
    },
  },
  {
    id: 'dev_014',
    data: {
      ownerUid: 'mu_016',
      ownerName: 'Pharma Plus Mfandena',
      ownerEmail: 'pharma.mfandena@nourripartners.cm',
      platform: 'ANDROID',
      appVersion: 'partner-1.3.9',
      pushToken: fakeToken('partner'),
      status: 'ACTIVE',
      lastSeenAt: hoursAgo(4),
      createdAt: daysAgo(120),
    },
  },
  {
    id: 'dev_015',
    data: {
      ownerUid: 'mu_001',
      ownerName: 'Aminatou Tchamba',
      ownerEmail: 'aminatou.tchamba@gmail.com',
      platform: 'ANDROID',
      appVersion: '2.4.6',
      pushToken: fakeToken('and'),
      status: 'INACTIVE',
      lastSeenAt: daysAgo(58),
      createdAt: daysAgo(180),
    },
  },
];

// ---------------------------------------------------------------- support issues

interface SupportIssueSeed {
  subject: string;
  description: string;
  category:
    | 'DELIVERY'
    | 'PHARMACY'
    | 'GROCERY'
    | 'PAYMENT'
    | 'RIDER'
    | 'APP_BUG';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedByUid: string;
  reportedByName: string;
  reportedByEmail: string;
  orderRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const supportIssues: SeedDoc<SupportIssueSeed>[] = [
  {
    id: 'si_001',
    data: {
      subject: 'Rider GPS lost in Bastos — customer waiting 50min',
      description:
        'Rider Eric Mbida went offline near Carrefour Bastos. Customer Aminatou is calling support. Order not yet handed off.',
      category: 'DELIVERY',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      reportedByUid: 'mu_001',
      reportedByName: 'Aminatou Tchamba',
      reportedByEmail: 'aminatou.tchamba@gmail.com',
      orderRef: 'N-31802',
      createdAt: hoursAgo(1),
      updatedAt: minutesAgo(18),
    },
  },
  {
    id: 'si_002',
    data: {
      subject: 'Pharmacy order missing antimalarial (Coartem)',
      description:
        'Customer reports the antimalarial was not in the package delivered from Pharma Plus Mfandena. Other items present.',
      category: 'PHARMACY',
      priority: 'HIGH',
      status: 'OPEN',
      reportedByUid: 'mu_004',
      reportedByName: 'Clarisse Ngono',
      reportedByEmail: 'clarisse.ngono@gmail.com',
      orderRef: 'N-31774',
      createdAt: hoursAgo(4),
      updatedAt: hoursAgo(4),
    },
  },
  {
    id: 'si_003',
    data: {
      subject: 'Wrong items delivered from Marché Express Tsinga',
      description:
        'Customer ordered 2kg rice and 1L oil, received 1kg rice and 500ml oil. Asking for partial refund.',
      category: 'GROCERY',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      reportedByUid: 'mu_002',
      reportedByName: 'Bertrand Eyong',
      reportedByEmail: 'bertrand.eyong@yahoo.fr',
      orderRef: 'N-31702',
      createdAt: hoursAgo(11),
      updatedAt: hoursAgo(5),
    },
  },
  {
    id: 'si_004',
    data: {
      subject: 'App crashes after order placement (Android 13)',
      description:
        'App force-closes immediately after tapping "Confirm payment" with Orange Money. Reproducible on multiple test devices.',
      category: 'APP_BUG',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      reportedByUid: 'mu_007',
      reportedByName: 'Achille Fotso',
      reportedByEmail: 'achille.fotso@gmail.com',
      createdAt: hoursAgo(18),
      updatedAt: hoursAgo(2),
    },
  },
  {
    id: 'si_005',
    data: {
      subject: 'Orange Money payment declined twice',
      description:
        'Customer attempted to pay 8,400 XAF for a grocery order, declined both times despite sufficient balance.',
      category: 'PAYMENT',
      priority: 'HIGH',
      status: 'OPEN',
      reportedByUid: 'mu_006',
      reportedByName: 'Honorine Ngoumou',
      reportedByEmail: 'honorine.ngoumou@gmail.com',
      orderRef: 'N-31901',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(2),
    },
  },
  {
    id: 'si_006',
    data: {
      subject: 'Restaurant Le Refuge marked open but not accepting orders',
      description:
        'Customer kept getting "restaurant unavailable" despite status showing OPEN. Partner contacted, app re-synced.',
      category: 'DELIVERY',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      reportedByUid: 'mu_002',
      reportedByName: 'Bertrand Eyong',
      reportedByEmail: 'bertrand.eyong@yahoo.fr',
      createdAt: daysAgo(1),
      updatedAt: hoursAgo(8),
    },
  },
  {
    id: 'si_007',
    data: {
      subject: 'Double charge on order N-30041',
      description:
        'Customer reports being debited 5,600 XAF twice via Orange Money for a single confirmed order.',
      category: 'PAYMENT',
      priority: 'URGENT',
      status: 'OPEN',
      reportedByUid: 'mu_001',
      reportedByName: 'Aminatou Tchamba',
      reportedByEmail: 'aminatou.tchamba@gmail.com',
      orderRef: 'N-30041',
      createdAt: hoursAgo(7),
      updatedAt: hoursAgo(7),
    },
  },
  {
    id: 'si_008',
    data: {
      subject: 'Rider missing tip from delivery N-29918',
      description:
        'Customer added 500 XAF tip in-app but rider says they never received it.',
      category: 'RIDER',
      priority: 'LOW',
      status: 'CLOSED',
      reportedByUid: 'mu_008',
      reportedByName: 'Eric Mbida',
      reportedByEmail: 'eric.mbida.rider@nourri.cm',
      orderRef: 'N-29918',
      createdAt: daysAgo(4),
      updatedAt: daysAgo(2),
    },
  },
  {
    id: 'si_009',
    data: {
      subject: 'Push notifications not arriving on iOS 17.4',
      description:
        'Multiple iOS users report no push notifications after the 2.5.0 release. APNs token registration suspected.',
      category: 'APP_BUG',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      reportedByUid: 'mu_001',
      reportedByName: 'Aminatou Tchamba',
      reportedByEmail: 'aminatou.tchamba@gmail.com',
      createdAt: hoursAgo(36),
      updatedAt: hoursAgo(6),
    },
  },
  {
    id: 'si_010',
    data: {
      subject: 'Pharmacy prescription upload fails on submission',
      description:
        'Uploading prescription photo errors with "Upload failed (413)" — likely image size limit. Fixed in 2.5.0.',
      category: 'APP_BUG',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      reportedByUid: 'mu_004',
      reportedByName: 'Clarisse Ngono',
      reportedByEmail: 'clarisse.ngono@gmail.com',
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1),
    },
  },
  {
    id: 'si_011',
    data: {
      subject: 'Order cancelled but card debited',
      description:
        'Customer cancelled within the grace period but card was still charged 3,200 XAF. Refund initiated.',
      category: 'PAYMENT',
      priority: 'HIGH',
      status: 'RESOLVED',
      reportedByUid: 'mu_006',
      reportedByName: 'Honorine Ngoumou',
      reportedByEmail: 'honorine.ngoumou@gmail.com',
      orderRef: 'N-31544',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
  },
  {
    id: 'si_012',
    data: {
      subject: 'Cold chain compromise reported on grocery delivery (Nsam)',
      description:
        'Customer reports frozen items arrived thawed. Rider delivery time was within SLA — bag insulation may be the cause.',
      category: 'GROCERY',
      priority: 'URGENT',
      status: 'OPEN',
      reportedByUid: 'mu_007',
      reportedByName: 'Achille Fotso',
      reportedByEmail: 'achille.fotso@gmail.com',
      orderRef: 'N-31888',
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3),
    },
  },
  {
    id: 'si_013',
    data: {
      subject: 'App shows wrong delivery ETA in Essos',
      description:
        'Estimated delivery shown as 15 min for Essos pickups, actual is closer to 40 min. Map zone may need update.',
      category: 'APP_BUG',
      priority: 'LOW',
      status: 'OPEN',
      reportedByUid: 'mu_002',
      reportedByName: 'Bertrand Eyong',
      reportedByEmail: 'bertrand.eyong@yahoo.fr',
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  },
];

// ---------------------------------------------------------------- notifications

interface NotificationEventSeed {
  channel: 'ORDER_UPDATE' | 'PROMO' | 'SUPPORT_REPLY' | 'PAYMENT' | 'SYSTEM';
  title: string;
  body: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'SENT' | 'PARTIAL' | 'FAILED';
  sentAt: Date;
}

export const notificationEvents: SeedDoc<NotificationEventSeed>[] = [
  {
    id: 'ne_001',
    data: {
      channel: 'ORDER_UPDATE',
      title: 'Your order #N-31802 is on the way',
      body: 'Eric Mbida is heading to your address in Bastos. ETA 12 min.',
      recipientCount: 1,
      deliveredCount: 1,
      failedCount: 0,
      status: 'SENT',
      sentAt: hoursAgo(1),
    },
  },
  {
    id: 'ne_002',
    data: {
      channel: 'PROMO',
      title: '15% off pharmacy orders this weekend',
      body: 'Use code PHARMA15 at checkout. Valid Saturday & Sunday across Yaoundé.',
      recipientCount: 8420,
      deliveredCount: 8019,
      failedCount: 401,
      status: 'PARTIAL',
      sentAt: hoursAgo(5),
    },
  },
  {
    id: 'ne_003',
    data: {
      channel: 'SUPPORT_REPLY',
      title: 'Reply on your support ticket',
      body: 'Larissa from support replied to your ticket about order N-31774.',
      recipientCount: 1,
      deliveredCount: 1,
      failedCount: 0,
      status: 'SENT',
      sentAt: hoursAgo(3),
    },
  },
  {
    id: 'ne_004',
    data: {
      channel: 'SYSTEM',
      title: 'Scheduled maintenance Sunday 02:00 WAT',
      body: 'The Nourri Express app will be briefly unavailable Sunday 02:00–02:30 WAT for maintenance.',
      recipientCount: 12450,
      deliveredCount: 12450,
      failedCount: 0,
      status: 'SENT',
      sentAt: daysAgo(1),
    },
  },
  {
    id: 'ne_005',
    data: {
      channel: 'PAYMENT',
      title: 'Payment confirmed: 3,200 XAF',
      body: 'Your Orange Money payment for order #N-30041 was received.',
      recipientCount: 1,
      deliveredCount: 1,
      failedCount: 0,
      status: 'SENT',
      sentAt: hoursAgo(7),
    },
  },
  {
    id: 'ne_006',
    data: {
      channel: 'ORDER_UPDATE',
      title: 'Rate your delivery from Chez Tantine Pauline',
      body: 'How was your meal? Tap to leave a quick rating.',
      recipientCount: 312,
      deliveredCount: 0,
      failedCount: 312,
      status: 'FAILED',
      sentAt: hoursAgo(9),
    },
  },
  {
    id: 'ne_007',
    data: {
      channel: 'PROMO',
      title: 'Free first delivery for new customers',
      body: 'Welcome to Nourri Express — your first delivery in Yaoundé is on us.',
      recipientCount: 580,
      deliveredCount: 0,
      failedCount: 580,
      status: 'FAILED',
      sentAt: daysAgo(2),
    },
  },
  {
    id: 'ne_008',
    data: {
      channel: 'ORDER_UPDATE',
      title: 'Heavy traffic in Bastos — order delayed 15 min',
      body: 'We notified your customer. The rider is on the way.',
      recipientCount: 1,
      deliveredCount: 1,
      failedCount: 0,
      status: 'SENT',
      sentAt: minutesAgo(38),
    },
  },
  {
    id: 'ne_009',
    data: {
      channel: 'PROMO',
      title: 'Your saved restaurant is back online',
      body: 'Brochetterie du Carrefour Bastos is open and accepting orders.',
      recipientCount: 940,
      deliveredCount: 887,
      failedCount: 53,
      status: 'PARTIAL',
      sentAt: daysAgo(1),
    },
  },
  {
    id: 'ne_010',
    data: {
      channel: 'SYSTEM',
      title: 'Action required: verify your account',
      body: 'Confirm your phone number to keep using Nourri Express.',
      recipientCount: 76,
      deliveredCount: 74,
      failedCount: 2,
      status: 'PARTIAL',
      sentAt: daysAgo(3),
    },
  },
  {
    id: 'ne_011',
    data: {
      channel: 'ORDER_UPDATE',
      title: 'Driver assigned to your order',
      body: 'Christian Nkeng will pick up your order from Saveurs du 237.',
      recipientCount: 1,
      deliveredCount: 1,
      failedCount: 0,
      status: 'SENT',
      sentAt: minutesAgo(22),
    },
  },
  {
    id: 'ne_012',
    data: {
      channel: 'PAYMENT',
      title: 'Mobile money payment failed — please retry',
      body: 'Your last attempt to pay 8,400 XAF didn’t go through.',
      recipientCount: 1,
      deliveredCount: 0,
      failedCount: 1,
      status: 'FAILED',
      sentAt: hoursAgo(2),
    },
  },
];

// ---------------------------------------------------------------- audit logs

interface AuditLogSeed {
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  performedByEmail: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: Date;
}

export const auditLogs: SeedDoc<AuditLogSeed>[] = [
  {
    id: 'al_seed_001',
    data: {
      action: 'UPDATE_MOBILE_USER_STATUS',
      entityType: 'mobileUser',
      entityId: 'mu_005',
      performedBy: 'ops-admin',
      performedByEmail: 'ops-admin@nourri.cm',
      before: { status: 'ACTIVE' },
      after: { status: 'SUSPENDED' },
      createdAt: daysAgo(8),
    },
  },
  {
    id: 'al_seed_002',
    data: {
      action: 'UPDATE_SUPPORT_ISSUE_STATUS',
      entityType: 'supportIssue',
      entityId: 'si_006',
      performedBy: 'ops-admin',
      performedByEmail: 'larissa.tabi@nourri.cm',
      before: { status: 'IN_PROGRESS' },
      after: { status: 'RESOLVED' },
      createdAt: hoursAgo(8),
    },
  },
  {
    id: 'al_seed_003',
    data: {
      action: 'UPDATE_SUPPORT_ISSUE_STATUS',
      entityType: 'supportIssue',
      entityId: 'si_010',
      performedBy: 'ops-admin',
      performedByEmail: 'stephane.bell@nourri.cm',
      before: { status: 'IN_PROGRESS' },
      after: { status: 'RESOLVED' },
      createdAt: daysAgo(1),
    },
  },
  {
    id: 'al_seed_004',
    data: {
      action: 'UPDATE_MOBILE_USER_STATUS',
      entityType: 'mobileUser',
      entityId: 'mu_010',
      performedBy: 'ops-admin',
      performedByEmail: 'ops-admin@nourri.cm',
      before: { status: 'ACTIVE' },
      after: { status: 'SUSPENDED' },
      createdAt: daysAgo(4),
    },
  },
  {
    id: 'al_seed_005',
    data: {
      action: 'UPDATE_SUPPORT_ISSUE_STATUS',
      entityType: 'supportIssue',
      entityId: 'si_011',
      performedBy: 'ops-admin',
      performedByEmail: 'larissa.tabi@nourri.cm',
      before: { status: 'IN_PROGRESS' },
      after: { status: 'RESOLVED' },
      createdAt: daysAgo(1),
    },
  },
  {
    id: 'al_seed_006',
    data: {
      action: 'UPDATE_SUPPORT_ISSUE_STATUS',
      entityType: 'supportIssue',
      entityId: 'si_008',
      performedBy: 'ops-admin',
      performedByEmail: 'stephane.bell@nourri.cm',
      before: { status: 'RESOLVED' },
      after: { status: 'CLOSED' },
      createdAt: daysAgo(2),
    },
  },
];
