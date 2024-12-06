import React from 'react';
import { Theme } from '../../types/theme';
import { AdminSettings } from '../../types/admin';
import { ColorPicker } from './ColorPicker';

interface ThemeEditorProps {
  settings: AdminSettings;
  updateTheme: (theme: Theme) => void;
}

export default function ThemeEditor({ settings, updateTheme }: ThemeEditorProps) {
  const { theme } = settings;

  const handleColorChange = (category: string, subCategory: string | null, color: string) => {
    const newTheme = { ...theme };
    if (subCategory) {
      (newTheme.colors as any)[category][subCategory] = color;
    } else {
      (newTheme.colors as any)[category] = color;
    }
    updateTheme(newTheme);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Theme Editor</h2>
        <p className="text-text-secondary mb-6">
          Customize your portfolio's appearance by adjusting the color scheme below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Primary Colors</h3>
          <div className="space-y-4">
            <ColorPicker
              label="Primary"
              color={theme.colors.primary}
              onChange={(color) => handleColorChange('primary', null, color)}
            />
            <ColorPicker
              label="Secondary"
              color={theme.colors.secondary}
              onChange={(color) => handleColorChange('secondary', null, color)}
            />
            <ColorPicker
              label="Accent"
              color={theme.colors.accent}
              onChange={(color) => handleColorChange('accent', null, color)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-medium">Background Colors</h3>
          <div className="space-y-4">
            <ColorPicker
              label="Background"
              color={theme.colors.background}
              onChange={(color) => handleColorChange('background', null, color)}
            />
            <ColorPicker
              label="Surface"
              color={theme.colors.surface}
              onChange={(color) => handleColorChange('surface', null, color)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-medium">Text Colors</h3>
          <div className="space-y-4">
            <ColorPicker
              label="Primary Text"
              color={theme.colors.text.primary}
              onChange={(color) => handleColorChange('text', 'primary', color)}
            />
            <ColorPicker
              label="Secondary Text"
              color={theme.colors.text.secondary}
              onChange={(color) => handleColorChange('text', 'secondary', color)}
            />
            <ColorPicker
              label="Accent Text"
              color={theme.colors.text.accent}
              onChange={(color) => handleColorChange('text', 'accent', color)}
            />
            <ColorPicker
              label="Muted Text"
              color={theme.colors.text.muted}
              onChange={(color) => handleColorChange('text', 'muted', color)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-medium">Status Colors</h3>
          <div className="space-y-4">
            <ColorPicker
              label="Success"
              color={theme.colors.status.success}
              onChange={(color) => handleColorChange('status', 'success', color)}
            />
            <ColorPicker
              label="Error"
              color={theme.colors.status.error}
              onChange={(color) => handleColorChange('status', 'error', color)}
            />
            <ColorPicker
              label="Warning"
              color={theme.colors.status.warning}
              onChange={(color) => handleColorChange('status', 'warning', color)}
            />
            <ColorPicker
              label="Info"
              color={theme.colors.status.info}
              onChange={(color) => handleColorChange('status', 'info', color)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Preview</h3>
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <h4
              className="text-lg font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Sample Card
            </h4>
            <p style={{ color: theme.colors.text.secondary }}>
              This is how your content will look with the current theme settings.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: theme.colors.primary, color: '#ffffff' }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: theme.colors.secondary, color: '#ffffff' }}
            >
              Secondary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: theme.colors.accent, color: '#ffffff' }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
