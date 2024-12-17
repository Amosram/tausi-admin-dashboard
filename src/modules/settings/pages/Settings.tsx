'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeneralSettings from './components/GeneralSettings';
import AppearanceSettings from './components/AppearanceSettings';
import AboutSettings from './components/AboutSettings';
import { Settings, Key, Database, Palette, Info } from 'lucide-react';
import ApiIntegrations from './components/ApiIntergration';
import FirebaseConfiguration from './components/FirebaseConfigurations';

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState('#1264A3');
  const [secondaryColor, setSecondaryColor] = useState('#2EB67D');
  const [font, setFont] = useState('Lato');

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Settings</CardTitle>
          <CardDescription>Manage your dashboard preferences and configurations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API
              </TabsTrigger>
              <TabsTrigger value="firebase" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Firebase
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="api">
              <ApiIntegrations />
            </TabsContent>
            <TabsContent value="firebase">
              <FirebaseConfiguration />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings
                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                secondaryColor={secondaryColor}
                setSecondaryColor={setSecondaryColor}
                font={font}
                setFont={setFont}
              />
            </TabsContent>
            <TabsContent value="about">
              <AboutSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}