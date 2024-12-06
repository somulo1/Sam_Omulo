import React, { useState } from 'react';
import { AdminSettings } from '../../types/admin';
import { produce } from 'immer';
import { AdminComponentProps } from '../../types/admin';

interface CustomizationSettingsProps extends AdminComponentProps {
  settings: AdminSettings;
  updateSettings: (updatedSettings: Partial<AdminSettings>) => void;
}

export function CustomizationSettings({ settings, updateSettings }: CustomizationSettingsProps) {
  const [localSettings, setLocalSettings] = useState({
    primaryColor: settings.customization?.primaryColor || '#3B82F6',
    secondaryColor: settings.customization?.secondaryColor || '#10B981',
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
        primaryColor: localSettings.primaryColor,
        secondaryColor: localSettings.secondaryColor,
        fontFamily: localSettings.fontFamily,
        borderRadius: localSettings.borderRadius,
        fonts: localSettings.fonts,
        fontSizes: localSettings.fontSizes,
        spacing: localSettings.spacing,
        effects: localSettings.effects,
      }
    });
  };

  return (
    <div className="space-y-6 p-6 bg-surface rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Site Customization</h2>

      {/* Color Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-text-secondary mb-2">
            Primary Color
          </label>
          <input
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={localSettings.primaryColor}
            onChange={handleInputChange}
            className="w-full h-12 p-1 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-text-secondary mb-2">
            Secondary Color
          </label>
          <input
            type="color"
            id="secondaryColor"
            name="secondaryColor"
            value={localSettings.secondaryColor}
            onChange={handleInputChange}
            className="w-full h-12 p-1 border rounded-md"
          />
        </div>
      </div>

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

          <div>
            <label htmlFor="bodyFontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Body Font Size
            </label>
            <input
              type="number"
              id="bodyFontSize"
              name="fontSizes.body"
              value={localSettings.fontSizes.body}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="smallFontSize" className="block text-sm font-medium text-text-secondary mb-2">
              Small Font Size
            </label>
            <input
              type="number"
              id="smallFontSize"
              name="fontSizes.small"
              value={localSettings.fontSizes.small}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h3 className="text-lg font-medium mb-2">Spacing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="containerPadding" className="block text-sm font-medium text-text-secondary mb-2">
              Container Padding
            </label>
            <input
              type="text"
              id="containerPadding"
              name="spacing.containerPadding"
              value={localSettings.spacing.containerPadding}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="sectionSpacing" className="block text-sm font-medium text-text-secondary mb-2">
              Section Spacing
            </label>
            <input
              type="text"
              id="sectionSpacing"
              name="spacing.sectionSpacing"
              value={localSettings.spacing.sectionSpacing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="elementSpacing" className="block text-sm font-medium text-text-secondary mb-2">
              Element Spacing
            </label>
            <input
              type="text"
              id="elementSpacing"
              name="spacing.elementSpacing"
              value={localSettings.spacing.elementSpacing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Effects */}
      <div>
        <h3 className="text-lg font-medium mb-2">Effects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="enableAnimations" className="block text-sm font-medium text-text-secondary mb-2">
              Enable Animations
            </label>
            <select
              id="enableAnimations"
              name="effects.enableAnimations"
              value={localSettings.effects.enableAnimations ? 'true' : 'false'}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="cardShadow" className="block text-sm font-medium text-text-secondary mb-2">
              Card Shadow
            </label>
            <input
              type="text"
              id="cardShadow"
              name="effects.cardShadow"
              value={localSettings.effects.cardShadow}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="buttonShadow" className="block text-sm font-medium text-text-secondary mb-2">
              Button Shadow
            </label>
            <input
              type="text"
              id="buttonShadow"
              name="effects.buttonShadow"
              value={localSettings.effects.buttonShadow}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="hoverEffects" className="block text-sm font-medium text-text-secondary mb-2">
              Hover Effects
            </label>
            <select
              id="hoverEffects"
              name="effects.hoverEffects"
              value={localSettings.effects.hoverEffects}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Save Customization
        </button>
      </div>
    </div>
  );
}
