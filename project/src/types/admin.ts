import { Theme } from './theme';

export interface SiteVisitor {
  id: string;
  ip: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  visitTime: Date;
  pageViews: {
    path: string;
    timestamp: Date;
    timeSpent: number;
  }[];
  referrer: string;
}

export interface SiteAnalytics {
  totalVisitors: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: {
    path: string;
    views: number;
    averageTimeSpent: number;
  }[];
  visitorsByCountry: {
    country: string;
    count: number;
  }[];
  visitorsByDevice: {
    device: string;
    count: number;
  }[];
}

export interface AdminSettings {
  theme: Theme;
  accessControl: {
    isPubliclyAccessible: boolean;
    allowedIPs: string[];
    requireAuth: boolean;
    maintenanceMode: boolean;
  };
  notifications: {
    emailOnVisit: boolean;
    emailOnContact: boolean;
    emailOnError: boolean;
    notificationEmail: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
  customization: {
    fonts: {
      heading: string;
      body: string;
      code: string;
    };
    fontSizes: {
      base: number;
      heading1: number;
      heading2: number;
      heading3: number;
      body: number;
      small: number;
    };
    spacing: {
      containerPadding: string;
      sectionSpacing: string;
      elementSpacing: string;
    };
    effects: {
      enableAnimations: boolean;
      cardShadow: string;
      buttonShadow: string;
      hoverEffects: boolean;
    };
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  performance: {
    enableImageOptimization: boolean;
    enableCodeSplitting: boolean;
    enableCaching: boolean;
    cdnEndpoint?: string;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    enableMFA: boolean;
    allowedOrigins: string[];
  };
}

export interface AdminComponentProps {
  settings: AdminSettings;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  updateTheme: (theme: Theme) => void;
  toggleMaintenanceMode: () => void;
  togglePublicAccess: () => void;
  addAllowedIP: (ip: string) => void;
  removeAllowedIP: (ip: string) => void;
  updateFonts: (fonts: { heading: string; body: string; code: string }) => void;
  updateFontSizes: (sizes: { base: number; heading1: number; heading2: number; heading3: number; body: number; small: number }) => void;
  updateSpacing: (spacing: { containerPadding: string; sectionSpacing: string; elementSpacing: string }) => void;
  updateEffects: (effects: { enableAnimations: boolean; cardShadow: string; buttonShadow: string; hoverEffects: boolean }) => void;
  updateSEO: (seoSettings: { title: string; description: string; keywords: string[]; ogImage: string; twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player' }) => void;
  updateSecurity: (securitySettings: { maxLoginAttempts: number; sessionTimeout: number; enableMFA: boolean; allowedOrigins: string[] }) => void;
  updateNotifications: (notificationSettings: { emailOnVisit: boolean; emailOnContact: boolean; emailOnError: boolean; notificationEmail: string }) => void;
  updatePerformance: (performanceSettings: { enableImageOptimization: boolean; enableCodeSplitting: boolean; enableCaching: boolean; cdnEndpoint?: string }) => void;
}
