import React, { useState, useEffect } from 'react';
import { AdminSettings, SiteAnalytics } from '../../types/admin';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsProps {
  settings: AdminSettings;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockAnalyticsData: SiteAnalytics = {
  totalVisitors: 1000,
  uniqueVisitors: 800,
  averageTimeOnSite: 300,
  bounceRate: 20,
  topPages: [
    { path: '/home', views: 500 },
    { path: '/about', views: 300 },
    { path: '/contact', views: 200 },
  ],
  visitorsByCountry: [
    { country: 'USA', count: 600 },
    { country: 'Canada', count: 200 },
    { country: 'UK', count: 200 },
  ],
  visitorsByDevice: [
    { device: 'Desktop', count: 600 },
    { device: 'Mobile', count: 200 },
    { device: 'Tablet', count: 200 },
  ],
  visitorsByBrowser: [
    { browser: 'Chrome', count: 400 },
    { browser: 'Firefox', count: 200 },
    { browser: 'Safari', count: 200 },
    { browser: 'Edge', count: 100 },
    { browser: 'Opera', count: 100 },
  ],
  visitorsByOS: [
    { os: 'Windows', count: 500 },
    { os: 'MacOS', count: 300 },
    { os: 'Linux', count: 200 },
  ],
  visitorsByScreenResolution: [
    { resolution: '1920x1080', count: 400 },
    { resolution: '1366x768', count: 300 },
    { resolution: '360x640', count: 200 },
    { resolution: '3840x2160', count: 100 },
  ],
  visitorsByLanguage: [
    { language: 'English', count: 600 },
    { language: 'Spanish', count: 200 },
    { language: 'French', count: 100 },
    { language: 'German', count: 100 },
  ],
};

export default function Analytics({ settings }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<SiteAnalytics | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = () => {
      setTimeout(() => {
        setAnalytics(mockAnalyticsData);
      }, 1000);
    };

    fetchAnalyticsData();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Full Site Analysis</h2>
        <p className="text-text-secondary mb-6">
          Track and analyze your portfolio's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Total Visitors
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {analytics.totalVisitors.toLocaleString()}
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Unique Visitors
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {analytics.uniqueVisitors.toLocaleString()}
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Avg. Time on Site
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {Math.round(analytics.averageTimeOnSite / 60)}m
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            Bounce Rate
          </h3>
          <p className="text-3xl font-bold text-text-primary">
            {analytics.bounceRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Top Pages</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topPages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="path"
                  tick={{ fill: settings.theme.colors.text.secondary }}
                />
                <YAxis tick={{ fill: settings.theme.colors.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="views"
                  fill={settings.theme.colors.primary}
                  name="Page Views"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by Country</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByCountry}
                  dataKey="count"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByCountry.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by Device</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByDevice}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByDevice.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by Browser</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByBrowser}
                  dataKey="count"
                  nameKey="browser"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByBrowser.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by OS</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByOS}
                  dataKey="count"
                  nameKey="os"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByOS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by Screen Resolution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByScreenResolution}
                  dataKey="count"
                  nameKey="resolution"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByScreenResolution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="text-lg font-medium mb-4">Visitors by Language</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.visitorsByLanguage}
                  dataKey="count"
                  nameKey="language"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.visitorsByLanguage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: settings.theme.colors.surface,
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
