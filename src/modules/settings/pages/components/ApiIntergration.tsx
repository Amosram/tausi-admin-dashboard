'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

export default function ApiIntegrations() {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving API settings:', { googleMapsApiKey, googleClientId, googleClientSecret });
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="googleMapsApiKey" className="flex items-center gap-2">
                        Google Maps API Key
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter your Google Maps API key here</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="googleMapsApiKey"
            value={googleMapsApiKey}
            onChange={(e) => setGoogleMapsApiKey(e.target.value)}
            placeholder="Enter Google Maps API Key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleClientId">Google Client ID</Label>
          <Input
            id="googleClientId"
            value={googleClientId}
            onChange={(e) => setGoogleClientId(e.target.value)}
            placeholder="Enter Google Client ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleClientSecret">Google Client Secret</Label>
          <Input
            id="googleClientSecret"
            value={googleClientSecret}
            onChange={(e) => setGoogleClientSecret(e.target.value)}
            placeholder="Enter Google Client Secret"
            type="password"
          />
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSave} className="w-[50%] bg-green-600">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

