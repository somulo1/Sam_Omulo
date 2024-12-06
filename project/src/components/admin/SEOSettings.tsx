import React from 'react';
import { AdminSettings } from '../../types/admin';

interface SEOSettingsProps {
  settings: AdminSettings;
  updateSEO: (seo: AdminSettings['seo']) => void;
}

export function SEOSettings({ settings, updateSEO }: SEOSettingsProps) {
  const handleChange = (field: keyof AdminSettings['seo'], value: string) => {
    updateSEO({
      ...settings.seo,
      [field]: field === 'keywords' ? value.split(',').map((k) => k.trim()) : value,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">SEO Settings</h2>
        <p className="text-text-secondary mb-6">
          Optimize your portfolio for search engines.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Page Title
          </label>
          <input
            type="text"
            id="title"
            value={settings.seo.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your portfolio title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Meta Description
          </label>
          <textarea
            id="description"
            value={settings.seo.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Brief description of your portfolio"
          />
        </div>

        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            value={settings.seo.keywords.join(', ')}
            onChange={(e) => handleChange('keywords', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="portfolio, developer, skills (comma separated)"
          />
        </div>

        <div>
          <label
            htmlFor="ogImage"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Open Graph Image URL
          </label>
          <input
            type="text"
            id="ogImage"
            value={settings.seo.ogImage}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/og-image.jpg"
          />
        </div>

        <div>
          <label
            htmlFor="twitterCard"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Twitter Card Type
          </label>
          <select
            id="twitterCard"
            value={settings.seo.twitterCard}
            onChange={(e) => handleChange('twitterCard', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-accent/20 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="p-4 rounded-lg bg-surface/50 space-y-2">
            <div className="text-text-primary font-medium">
              {settings.seo.title}
            </div>
            <div className="text-text-accent text-sm">
              {window.location.origin}
            </div>
            <div className="text-text-secondary text-sm">
              {settings.seo.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
