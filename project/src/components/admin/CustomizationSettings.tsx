import React, { useState } from 'react';
import { AdminSettings } from '../../types/admin';
import { produce } from 'immer';
import { AdminComponentProps } from '../../types/admin';

interface CustomizationSettingsProps extends AdminComponentProps {
  settings: AdminSettings;
  updateSettings: (updatedSettings: Partial<AdminSettings>) => void;
  onAddNew: (type: "project" | "skill" | "service") => void;
}

export function CustomizationSettings({ settings, updateSettings, onAddNew }: CustomizationSettingsProps) {
  const [localSettings, setLocalSettings] = useState({
    fontFamily: settings.customization?.fonts?.body || 'Inter, sans-serif',
    borderRadius: settings.customization?.borderRadius || '0.5rem',
    fonts: {
      heading: settings.customization?.fonts?.heading || 'Arial, sans-serif',
      body: settings.customization?.fonts?.body || 'Inter, sans-serif',
      code: settings.customization?.fonts?.code || 'Courier, monospace',
    },
    fontSizes: {
      base: settings.customization?.fontSizes?.base || 16,
      heading1: settings.customization?.fontSizes?.heading1 || 32,
      heading2: settings.customization?.fontSizes?.heading2 || 24,
      heading3: settings.customization?.fontSizes?.heading3 || 20,
      body: settings.customization?.fontSizes?.body || 16,
      small: settings.customization?.fontSizes?.small || 12,
    },
    spacing: {
      containerPadding: settings.customization?.spacing?.containerPadding || '1rem',
      sectionSpacing: settings.customization?.spacing?.sectionSpacing || '2rem',
      elementSpacing: settings.customization?.spacing?.elementSpacing || '1rem',
    },
    effects: {
      enableAnimations: settings.customization?.effects?.enableAnimations ?? true,
      cardShadow: settings.customization?.effects?.cardShadow || '0 4px 6px rgba(0,0,0,0.1)',
      buttonShadow: settings.customization?.effects?.buttonShadow || '0 2px 4px rgba(0,0,0,0.1)',
      hoverEffects: settings.customization?.effects?.hoverEffects ?? true,
    }
  });

  const [notification, setNotification] = useState<string | null>(null); // State for notification

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert string values to boolean for boolean fields
    const processedValue = 
      value === 'true' ? true : 
      value === 'false' ? false : 
      value;

    setLocalSettings((prevSettings) => {
      const updatedSettings = produce(prevSettings, (draft) => {
        draft[name] = processedValue;
      });
      updateSettings(updatedSettings);
      return updatedSettings;
    });
  };

  const handleSave = () => {
    updateSettings({
      customization: {
        fontFamily: localSettings.fontFamily,
        borderRadius: localSettings.borderRadius,
        fonts: localSettings.fonts,
        fontSizes: localSettings.fontSizes,
        spacing: localSettings.spacing,
        effects: localSettings.effects,
      }
    });
    setNotification("Settings saved successfully!"); // Set notification message
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  const handleRestore = () => {
    setLocalSettings({
      fontFamily: settings.customization?.fonts?.body || 'Inter, sans-serif',
      borderRadius: settings.customization?.borderRadius || '0.5rem',
      fonts: {
        heading: settings.customization?.fonts?.heading || 'Arial, sans-serif',
        body: settings.customization?.fonts?.body || 'Inter, sans-serif',
        code: settings.customization?.fonts?.code || 'Courier, monospace',
      },
      fontSizes: {
        base: settings.customization?.fontSizes?.base || 16,
        heading1: settings.customization?.fontSizes?.heading1 || 32,
        heading2: settings.customization?.fontSizes?.heading2 || 24,
        heading3: settings.customization?.fontSizes?.heading3 || 20,
        body: settings.customization?.fontSizes?.body || 16,
        small: settings.customization?.fontSizes?.small || 12,
      },
      spacing: {
        containerPadding: settings.customization?.spacing?.containerPadding || '1rem',
        sectionSpacing: settings.customization?.spacing?.sectionSpacing || '2rem',
        elementSpacing: settings.customization?.spacing?.elementSpacing || '1rem',
      },
      effects: {
        enableAnimations: settings.customization?.effects?.enableAnimations ?? true,
        cardShadow: settings.customization?.effects?.cardShadow || '0 4px 6px rgba(0,0,0,0.1)',
        buttonShadow: settings.customization?.effects?.buttonShadow || '0 2px 4px rgba(0,0,0,0.1)',
        hoverEffects: settings.customization?.effects?.hoverEffects ?? true,
      }
    });
    setNotification("Settings restored to default!"); // Set notification message
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  return (
    <div className="space-y-6 p-6 bg-surface rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Site Customization</h2>

      {notification && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          {notification}
        </div>
      )}

      {/* Font Customization */}
      <div>
        <label htmlFor="fontFamily" className="block text-sm font-medium text-text-secondary mb-2">
          Font Family
        </label>
        <select
          id="fontFamily"
          name="fontFamily"
          value={localSettings.fontFamily}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Open Sans, sans-serif">Open Sans</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <label htmlFor="borderRadius" className="block text-sm font-medium text-text-secondary mb-2">
          Border Radius
        </label>
        <select
          id="borderRadius"
          name="borderRadius"
          value={localSettings.borderRadius}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="0">None</option>
          <option value="0.25rem">Small</option>
          <option value="0.5rem">Medium</option>
          <option value="1rem">Large</option>
        </select>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="text-lg font-medium mb-2">Font Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="baseFontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Base Font Size
            </label>
            <input
              type="number"
              id="baseFontSize"
              name="fontSizes.base"
              value={localSettings.fontSizes.base}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="heading1FontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Heading 1 Font Size
            </label>
            <input
              type="number"
              id="heading1FontSize"
              name="fontSizes.heading1"
              value={localSettings.fontSizes.heading1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="heading2FontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Heading 2 Font Size
            </label>
            <input
              type="number"
              id="heading2FontSize"
              name="fontSizes.heading2"
              value={localSettings.fontSizes.heading2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="heading3FontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Heading 3 Font Size
            </label>
            <input
              type="number"
              id="heading3FontSize"
              name="fontSizes.heading3"
              value={localSettings.fontSizes.heading3}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Save and Restore Buttons */}
      <div className="flex justify-end space-x-4">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Save
        </button>
        <button onClick={handleRestore} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
          Restore
        </button>
      </div>
    </div>
  );
}