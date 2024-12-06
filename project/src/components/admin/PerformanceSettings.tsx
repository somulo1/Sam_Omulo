import React from 'react';
import { AdminSettings } from '../../types/admin';
import { Switch } from '@headlessui/react';


interface PerformanceSettingsProps {
  settings: AdminSettings;
  updatePerformance: (performance: AdminSettings['performance']) => void;
}

export function PerformanceSettings({
  settings,
  updatePerformance,
}: PerformanceSettingsProps) {
  const handleChange = (
    field: keyof AdminSettings['performance'],
    value: any
  ) => {
    updatePerformance({
      ...settings.performance,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Performance Settings</h2>
        <p className="text-text-secondary mb-6">
          Optimize your portfolio's performance and loading speed.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Image Optimization</h3>
            <p className="text-sm text-text-secondary">
              Automatically optimize and compress images
            </p>
          </div>
          <Switch
            checked={settings.performance.enableImageOptimization}
            onChange={(checked) =>
              handleChange('enableImageOptimization', checked)
            }
            className={`${
              settings.performance.enableImageOptimization
                ? 'bg-primary'
                : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                settings.performance.enableImageOptimization
                  ? 'translate-x-6'
                  : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Code Splitting</h3>
            <p className="text-sm text-text-secondary">
              Split code into smaller chunks for faster loading
            </p>
          </div>
          <Switch
            checked={settings.performance.enableCodeSplitting}
            onChange={(checked) => handleChange('enableCodeSplitting', checked)}
            className={`${
              settings.performance.enableCodeSplitting
                ? 'bg-primary'
                : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                settings.performance.enableCodeSplitting
                  ? 'translate-x-6'
                  : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Browser Caching</h3>
            <p className="text-sm text-text-secondary">
              Enable browser caching for faster repeat visits
            </p>
          </div>
          <Switch
            checked={settings.performance.enableCaching}
            onChange={(checked) => handleChange('enableCaching', checked)}
            className={`${
              settings.performance.enableCaching ? 'bg-primary' : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                settings.performance.enableCaching
                  ? 'translate-x-6'
                  : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div>
          <label
            htmlFor="cdnEndpoint"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            CDN Endpoint (Optional)
          </label>
          <input
            type="text"
            id="cdnEndpoint"
            value={settings.performance.cdnEndpoint || ''}
            onChange={(e) => handleChange('cdnEndpoint', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://cdn.example.com"
          />
          <p className="mt-1 text-sm text-text-secondary">
            Content Delivery Network endpoint for faster asset delivery
          </p>
        </div>

        <div className="pt-4 border-t border-accent/20">
          <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface/50">
              <div className="text-sm font-medium text-text-secondary mb-1">
                First Contentful Paint
              </div>
              <div className="text-2xl font-bold text-text-primary">0.8s</div>
            </div>
            <div className="p-4 rounded-lg bg-surface/50">
              <div className="text-sm font-medium text-text-secondary mb-1">
                Time to Interactive
              </div>
              <div className="text-2xl font-bold text-text-primary">1.2s</div>
            </div>
            <div className="p-4 rounded-lg bg-surface/50">
              <div className="text-sm font-medium text-text-secondary mb-1">
                Largest Contentful Paint
              </div>
              <div className="text-2xl font-bold text-text-primary">1.5s</div>
            </div>
            <div className="p-4 rounded-lg bg-surface/50">
              <div className="text-sm font-medium text-text-secondary mb-1">
                Cumulative Layout Shift
              </div>
              <div className="text-2xl font-bold text-text-primary">0.1</div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-medium mb-4">Optimization Tips</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Use WebP format for images when possible
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Implement lazy loading for images and components
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Minimize JavaScript and CSS bundle sizes
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Enable compression for text-based assets
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
