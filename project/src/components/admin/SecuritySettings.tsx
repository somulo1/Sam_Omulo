import React from 'react';
import { AdminSettings } from '../../types/admin';
import { Switch } from '@headlessui/react';

interface SecuritySettingsProps {
  settings: AdminSettings;
  updateSecurity: (security: AdminSettings['security']) => void;
}

export default function SecuritySettings({
  settings,
  updateSecurity,
}: SecuritySettingsProps) {
  const handleChange = (field: keyof AdminSettings['security'], value: any) => {
    updateSecurity({
      ...settings.security,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
        <p className="text-text-secondary mb-6">
          Configure security settings for your portfolio.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="maxLoginAttempts"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Maximum Login Attempts
          </label>
          <input
            type="number"
            id="maxLoginAttempts"
            value={settings.security.maxLoginAttempts}
            onChange={(e) =>
              handleChange('maxLoginAttempts', parseInt(e.target.value))
            }
            min={1}
            max={10}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-text-secondary">
            Number of failed login attempts before account lockout
          </p>
        </div>

        <div>
          <label
            htmlFor="sessionTimeout"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Session Timeout (seconds)
          </label>
          <input
            type="number"
            id="sessionTimeout"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              handleChange('sessionTimeout', parseInt(e.target.value))
            }
            min={300}
            max={86400}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-text-secondary">
            Time before user is automatically logged out (5 minutes to 24 hours)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Multi-Factor Authentication</h3>
            <p className="text-sm text-text-secondary">
              Require 2FA for admin access
            </p>
          </div>
          <Switch
            checked={settings.security.enableMFA}
            onChange={(checked) => handleChange('enableMFA', checked)}
            className={`${
              settings.security.enableMFA ? 'bg-primary' : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                settings.security.enableMFA ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div>
          <label
            htmlFor="allowedOrigins"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Allowed Origins
          </label>
          <textarea
            id="allowedOrigins"
            value={settings.security.allowedOrigins.join('\n')}
            onChange={(e) =>
              handleChange(
                'allowedOrigins',
                e.target.value.split('\n').filter(Boolean)
              )
            }
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com&#10;https://api.example.com"
          />
          <p className="mt-1 text-sm text-text-secondary">
            List of allowed origins for CORS (one per line)
          </p>
        </div>

        <div className="pt-4 border-t border-accent/20">
          <h3 className="text-lg font-medium mb-4">Security Recommendations</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Use strong, unique passwords for admin access
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Enable MFA for additional security
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Regularly review and update security settings
            </li>
            <li className="flex items-start">
              <span className="text-status-success mr-2">✓</span>
              Keep your system and dependencies up to date
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
