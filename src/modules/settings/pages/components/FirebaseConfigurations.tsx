'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FirebaseConfiguration() {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleTestConnection = () => {
    // Implement test connection functionality
    console.log('Testing Firebase connection with:', config);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving Firebase configuration:', config);
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <div className="flex space-x-4">
          <Button onClick={handleTestConnection} variant="outline"
            className="flex-1">
                        Test Connection
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-green-600">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}

