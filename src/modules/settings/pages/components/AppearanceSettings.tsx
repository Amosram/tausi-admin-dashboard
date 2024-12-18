'use client';

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';


interface AppearanceSettingsProps {
    primaryColor: string
    setPrimaryColor: (color: string) => void
    secondaryColor: string
    setSecondaryColor: (color: string) => void
    font: string
    setFont: (font: string) => void
}

export default function AppearanceSettings({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  font,
  setFont
}: AppearanceSettingsProps) {
  const [theme, setTheme] = useState('light');
  const [sidebarColor, setSidebarColor] = useState('default');
  const [density, setDensity] = useState(1);
  const [useCustomTheme, setUseCustomTheme] = useState(false);

  const handleSave = () => {
    console.log('Saving appearance settings:', {
      theme,
      sidebarColor,
      primaryColor,
      secondaryColor,
      font,
      density,
      useCustomTheme
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>
          <RadioGroup value={theme} onValueChange={setTheme}
            className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">Sync with computer</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sidebar Color</h3>
          <RadioGroup value={sidebarColor} onValueChange={setSidebarColor}
            className="grid grid-cols-3 gap-4">
            {['default', 'aubergine', 'midnight'].map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <RadioGroupItem value={color} id={color} />
                <Label htmlFor={color} className="capitalize">{color}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Custom Theme</h3>
            <Switch
              checked={useCustomTheme}
              onCheckedChange={setUseCustomTheme}
            />
          </div>
          {useCustomTheme && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Density</h3>
          <Slider
            value={[density]}
            onValueChange={(value) => setDensity(value[0])}
            max={3}
            step={1}
            className="w-[60%]"
          />
          <div className="text-sm text-muted-foreground">
            {density === 1 && "Comfortable"}
            {density === 2 && "Cozy"}
            {density === 3 && "Compact"}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Typography</h3>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: useCustomTheme ? primaryColor : (theme === 'dark' ? '#1a1d21' : '#ffffff'),
              color: useCustomTheme ? secondaryColor : (theme === 'dark' ? '#ffffff' : '#1a1d21'),
              fontFamily: font
            }}
          >
            <h4 className="text-lg font-bold mb-2">Preview Text</h4>
            <p>This is how your selected theme and customizations will look.</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleSave} className="w-[50%] bg-green-600">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

