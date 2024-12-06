import React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <label className="w-32 text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-sm rounded-lg bg-surface border border-accent/20 text-text-primary"
        />
      </div>
    </div>
  );
}
