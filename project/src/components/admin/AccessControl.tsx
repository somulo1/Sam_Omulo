import React, { useState } from 'react';
import { AdminSettings } from '../../types/admin';
import { Switch } from '@headlessui/react';

interface AccessControlProps {
  settings: AdminSettings;
  toggleMaintenanceMode: () => void;
  togglePublicAccess: () => void;
  addAllowedIP: (ip: string) => void;
  removeAllowedIP: (ip: string) => void;
}

export default function AccessControl({
  settings,
  toggleMaintenanceMode,
  togglePublicAccess,
  addAllowedIP,
  removeAllowedIP,
}: AccessControlProps) {
  const [newIP, setNewIP] = useState('');
  const { accessControl } = settings;

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIP && /^(\d{1,3}\.){3}\d{1,3}$/.test(newIP)) {
      addAllowedIP(newIP);
      setNewIP('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Access Control</h2>
        <p className="text-text-secondary mb-6">
          Manage who can access your portfolio and when.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Public Access</h3>
            <p className="text-sm text-text-secondary">
              Allow anyone to view your portfolio
            </p>
          </div>
          <Switch
            checked={accessControl.isPubliclyAccessible}
            onChange={togglePublicAccess}
            className={`${
              accessControl.isPubliclyAccessible ? 'bg-primary' : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                accessControl.isPubliclyAccessible ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Maintenance Mode</h3>
            <p className="text-sm text-text-secondary">
              Show a maintenance page to visitors
            </p>
          </div>
          <Switch
            checked={accessControl.maintenanceMode}
            onChange={toggleMaintenanceMode}
            className={`${
              accessControl.maintenanceMode ? 'bg-primary' : 'bg-accent'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                accessControl.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="border-t border-accent/20 pt-6">
          <h3 className="text-lg font-medium mb-4">IP Whitelist</h3>
          <form onSubmit={handleAddIP} className="flex space-x-4 mb-4">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="Enter IP address"
              className="flex-1 px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Add IP
            </button>
          </form>

          <div className="space-y-2">
            {accessControl.allowedIPs.map((ip) => (
              <div
                key={ip}
                className="flex items-center justify-between p-2 rounded-lg bg-surface"
              >
                <span className="text-text-primary">{ip}</span>
                <button
                  onClick={() => removeAllowedIP(ip)}
                  className="text-status-error hover:text-status-error/80 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
