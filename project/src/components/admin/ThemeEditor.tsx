import React, { useState } from 'react';
import usePortfolioStore from "../../store/portfolioStore";
import { ColorPicker } from './ColorPicker';

const ThemeEditor = () => {
  const { theme, updateTheme } = usePortfolioStore();
  const [successMessage, setSuccessMessage] = useState('');

  // Define the constant default theme colors
  const DEFAULT_THEME = {
    colors: {
      primary: '#00abf0', // Primary color for main elements
      secondary: '#00abf0', // Secondary color for accents
      accent: '#112e42', // Accent color
      background: '#081b29', // Main background color
      surface: '#081b29', // Surface color
      text: {
        primary: '#ffffff', // Updated to match About section text color
        secondary: '#4a5568', // Secondary text color
        muted: '#aaaaaa', // Muted text color
      },
      status: {
        success: '#28a745', // Success status color
        error: '#dc3545', // Error status color
        warning: '#ffc107', // Warning status color
        info: '#17a2b8', // Info status color
      },
    },
  };

  const handleColorChange = (colorKey: string, newColor: string) => {
    const newTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: newColor,
      },
    };
    updateTheme(newTheme); // Update the theme in the store
    setSuccessMessage('Theme updated successfully!'); // Feedback message
  };

  const handleSave = () => {
    // Save the theme to local storage
    localStorage.setItem('portfolioTheme', JSON.stringify(theme));
    setSuccessMessage('Themes saved successfully!'); // Set success message
  };

  const handleReset = () => {
    const resetTheme = { ...DEFAULT_THEME }; // Create a deep copy of the default theme
    updateTheme(resetTheme); // Reset to constant default theme colors
    setSuccessMessage('Themes reset to default settings successfully!'); // Set reset message
  };
const statusColor = theme.colors.status || 'defaultColor'; // Replace 'defaultColor' with an appropriate fallback color
  const containerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  };

  return (
    <div style={containerStyle}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Theme Editor</h2>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
          <p className="text-text-secondary mb-6">
            Customize your portfolio's appearance by adjusting the color scheme below.
          </p>
          <p style={{ color: 'red' }}>make the color changes in this section. you can <b>reset to default</b> if you have color matching problem !</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Primary Colors</h3>
            <div className="space-y-4">
              <ColorPicker
                label="Primary"
                color={theme.colors.primary}
                onChange={(color) => handleColorChange('primary', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Home, About, Services</p>
              <ColorPicker
                label="Secondary"
                color={theme.colors.secondary}
                onChange={(color) => handleColorChange('secondary', color)}
              />
              <p style={{ color: 'blue' }}>Affects: buttons colors mostly</p>
              </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium">Background Colors</h3>
            <div className="space-y-4">
              <ColorPicker
                label="Background"
                color={theme.colors.background}
                onChange={(color) => handleColorChange('background', color)}
              />
              <p style={{ color: 'blue' }}>Affects: entire background color </p>
              <ColorPicker
                label="Surface"
                color={theme.colors.surface}
                onChange={(color) => handleColorChange('surface', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Cards, Overlays, skill items, service items</p>
              <ColorPicker
                label="Accent"
                color={theme.colors.accent}
                onChange={(color) => handleColorChange('accent', color)}
              />
              <p style={{ color: 'blue' }}>Affects: affect some card background colors</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium">Text Colors</h3>
            <div className="space-y-4">
              <ColorPicker
                label="Primary Text"
                color={theme.colors.text.primary}
                onChange={(color) => handleColorChange('text.primary', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Headings, Titles</p>
              <ColorPicker
                label="Secondary Text"
                color={theme.colors.text.secondary}
                onChange={(color) => handleColorChange('text.secondary', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Body Text, Descriptions</p>
              <ColorPicker
                label="Muted Text"
                color={theme.colors.text.muted}
                onChange={(color) => handleColorChange('text.muted', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Footnotes, Captions</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium">Status Colors</h3>
            <div className="space-y-4">
              <ColorPicker
                label="Success"
                color={theme.colors.status.success}
                onChange={(color) => handleColorChange('status.success', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Success Messages, Confirmations</p>
              <ColorPicker
                label="Error"
                color={theme.colors.status.error}
                onChange={(color) => handleColorChange('status.error', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Error Messages, Alerts</p>
              <ColorPicker
                label="Warning"
                color={theme.colors.status.warning}
                onChange={(color) => handleColorChange('status.warning', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Warnings, Notifications</p>
              <ColorPicker
                label="Info"
                color={theme.colors.status.info}
                onChange={(color) => handleColorChange('status.info', color)}
              />
              <p style={{ color: 'blue' }}>Affects: Informational Messages, Tips</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleReset}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;