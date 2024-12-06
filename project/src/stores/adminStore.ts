import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminSettings, SiteVisitor, SiteAnalytics } from '../types/admin';
import { Theme } from '../types/theme';
import { defaultTheme } from '../themes/default';

interface AdminStore {
  settings: AdminSettings;
  visitors: SiteVisitor[];
  analytics: SiteAnalytics;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  updateTheme: (theme: Theme) => void;
  addVisitor: (visitor: SiteVisitor) => void;
  updateAnalytics: (analytics: Partial<SiteAnalytics>) => void;
  toggleMaintenanceMode: () => void;
  togglePublicAccess: () => void;
  addAllowedIP: (ip: string) => void;
  removeAllowedIP: (ip: string) => void;
  updateFonts: (fonts: AdminSettings['customization']['fonts']) => void;
  updateFontSizes: (sizes: AdminSettings['customization']['fontSizes']) => void;
  updateSpacing: (spacing: AdminSettings['customization']['spacing']) => void;
  updateEffects: (effects: AdminSettings['customization']['effects']) => void;
  updateSEO: (seo: AdminSettings['seo']) => void;
  updateSecurity: (security: AdminSettings['security']) => void;
  updateNotifications: (notifications: AdminSettings['notifications']) => void;
  updatePerformance: (performance: AdminSettings['performance']) => void;
}

const initialAnalytics: SiteAnalytics = {
  totalVisitors: 0,
  uniqueVisitors: 0,
  averageTimeOnSite: 0,
  bounceRate: 0,
  topPages: [],
  visitorsByCountry: [],
  visitorsByDevice: [],
};

const initialSettings: AdminSettings = {
  theme: defaultTheme,
  darkTheme: {
    background: '#1a1a1a',
    textColor: '#e0e0e0',
    primaryColor: '#6200ea',
    secondaryColor: '#03dac6',
    accentColor: '#ff4081',
    borderColor: '#333333',
    cardBackground: '#2a2a2a',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
  },
  AdminDashboard: {
    theme: {
      background: '#1a1a1a',
      textColor: '#e0e0e0',
      primaryColor: '#6200ea',
      secondaryColor: '#03dac6',
      accentColor: '#ff4081',
      borderColor: '#333333',
      cardBackground: '#2a2a2a',
      cardShadow: 'rgba(0, 0, 0, 0.5)',
    },
    darkTheme: {
      background: '#1a1a1a',
      textColor: '#e0e0e0',
      primaryColor: '#6200ea',
      secondaryColor: '#03dac6',
      accentColor: '#ff4081',
      borderColor: '#333333',
      cardBackground: '#2a2a2a',
      cardShadow: 'rgba(0, 0, 0, 0.5)',
    },
  },
  accessControl: {
    isPubliclyAccessible: true,
    allowedIPs: [],
    requireAuth: false,
    maintenanceMode: false,
  },
  notifications: {
    emailOnVisit: false,
    emailOnContact: true,
    emailOnError: true,
    notificationEmail: '',
  },
  seo: {
    title: 'Samuel - Portfolio',
    description: 'Personal portfolio showcasing my work and skills',
    keywords: ['portfolio', 'developer', 'software engineer'],
    ogImage: '/img/og-image.jpg',
    twitterCard: 'summary_large_image',
  },
  customization: {
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      code: 'Fira Code',
    },
    fontSizes: {
      base: 16,
      heading1: 48,
      heading2: 36,
      heading3: 24,
      body: 16,
      small: 14,
    },
    spacing: {
      containerPadding: '2rem',
      sectionSpacing: '4rem',
      elementSpacing: '1rem',
    },
    effects: {
      enableAnimations: true,
      cardShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      buttonShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      hoverEffects: true,
    },
  },
  performance: {
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enableCaching: true,
  },
  security: {
    maxLoginAttempts: 3,
    sessionTimeout: 3600,
    enableMFA: false,
    allowedOrigins: ['*'],
  },
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      settings: initialSettings,
      visitors: [],
      analytics: initialAnalytics,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      addVisitor: (visitor) =>
        set((state) => ({
          visitors: [...state.visitors, visitor],
        })),
      updateAnalytics: (newAnalytics) =>
        set((state) => ({
          analytics: { ...state.analytics, ...newAnalytics },
        })),
      toggleMaintenanceMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            accessControl: {
              ...state.settings.accessControl,
              maintenanceMode: !state.settings.accessControl.maintenanceMode,
            },
          },
        })),
      togglePublicAccess: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            accessControl: {
              ...state.settings.accessControl,
              isPubliclyAccessible: !state.settings.accessControl.isPubliclyAccessible,
            },
          },
        })),
      addAllowedIP: (ip) =>
        set((state) => ({
          settings: {
            ...state.settings,
            accessControl: {
              ...state.settings.accessControl,
              allowedIPs: [...state.settings.accessControl.allowedIPs, ip],
            },
          },
        })),
      removeAllowedIP: (ip) =>
        set((state) => ({
          settings: {
            ...state.settings,
            accessControl: {
              ...state.settings.accessControl,
              allowedIPs: state.settings.accessControl.allowedIPs.filter((i) => i !== ip),
            },
          },
        })),
      updateFonts: (fonts) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customization: {
              ...state.settings.customization,
              fonts,
            },
          },
        })),
      updateFontSizes: (fontSizes) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customization: {
              ...state.settings.customization,
              fontSizes,
            },
          },
        })),
      updateSpacing: (spacing) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customization: {
              ...state.settings.customization,
              spacing,
            },
          },
        })),
      updateEffects: (effects) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customization: {
              ...state.settings.customization,
              effects,
            },
          },
        })),
      updateSEO: (seo) =>
        set((state) => ({
          settings: {
            ...state.settings,
            seo,
          },
        })),
      updateSecurity: (security) =>
        set((state) => ({
          settings: {
            ...state.settings,
            security,
          },
        })),
      updateNotifications: (notifications) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications,
          },
        })),
      updatePerformance: (performance) =>
        set((state) => ({
          settings: {
            ...state.settings,
            performance,
          },
        })),
    }),
    {
      name: 'admin-storage',
    }
  )
);
