import React from 'react';
import { AdminSettings } from '../../types/admin';
import { Switch } from '@headlessui/react';

interface NotificationSettingsProps {
  settings: AdminSettings;
  updateNotifications: (notifications: AdminSettings['notifications']) => void;
}

export function NotificationSettings({
  settings,
  updateNotifications,
}: NotificationSettingsProps) {
  const handleChange = (
    field: keyof AdminSettings['notifications'],
    value: any
  ) => {
    updateNotifications({
      ...settings.notifications,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
        <p className="text-text-secondary mb-6">
          Configure when and how you receive notifications.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="notificationEmail"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Notification Email
          </label>
          <input
            type="email"
            id="notificationEmail"
            value={settings.notifications.notificationEmail}
            onChange={(e) => handleChange('notificationEmail', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
          <p className="mt-1 text-sm text-text-secondary">
            Email address where notifications will be sent
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">New Visitor Notifications</h3>
              <p className="text-sm text-text-secondary">
                Receive an email when someone visits your portfolio
              </p>
            </div>
            <Switch
              checked={settings.notifications.emailOnVisit}
              onChange={(checked) => handleChange('emailOnVisit', checked)}
              className={`${
                settings.notifications.emailOnVisit ? 'bg-primary' : 'bg-accent'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.notifications.emailOnVisit
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Contact Form Notifications</h3>
              <p className="text-sm text-text-secondary">
                Receive an email when someone submits the contact form
              </p>
            </div>
            <Switch
              checked={settings.notifications.emailOnContact}
              onChange={(checked) => handleChange('emailOnContact', checked)}
              className={`${
                settings.notifications.emailOnContact ? 'bg-primary' : 'bg-accent'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.notifications.emailOnContact
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Error Notifications</h3>
              <p className="text-sm text-text-secondary">
                Receive an email when an error occurs
              </p>
            </div>
            <Switch
              checked={settings.notifications.emailOnError}
              onChange={(checked) => handleChange('emailOnError', checked)}
              className={`${
                settings.notifications.emailOnError ? 'bg-primary' : 'bg-accent'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.notifications.emailOnError
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>

        <div className="pt-4 border-t border-accent/20">
          <h3 className="text-lg font-medium mb-4">Email Preview</h3>
          <div className="p-4 rounded-lg bg-surface/50 space-y-4">
            <div className="space-y-2">
              <div className="text-text-primary font-medium">New Visitor</div>
              <div className="text-text-secondary text-sm">
                A new visitor from [Location] has viewed your portfolio.
                <br />
                Time: [Timestamp]
                <br />
                Page: [URL]
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-text-primary font-medium">Contact Form</div>
              <div className="text-text-secondary text-sm">
                You have received a new message from [Name].
                <br />
                Email: [Email]
                <br />
                Message: [Content]
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-text-primary font-medium">Error Alert</div>
              <div className="text-text-secondary text-sm">
                An error occurred on your portfolio.
                <br />
                Error: [Error Message]
                <br />
                Stack Trace: [Stack Trace]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
