'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';

export default function GeneralSettings() {
  const [appName, setAppName] = useState('My Dashboard');
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving general settings:', { appName, logo });
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="appName">App Name</Label>
          <Input
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="Enter app name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">Logo Upload</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button asChild className='bg-black'>
              <label htmlFor="logo" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Upload Logo
              </label>
            </Button>
            {logo && (
              <img src={logo} alt="App Logo"
                className="h-12 w-12 object-contain" />
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSave} className="w-[50%] bg-green-600">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

