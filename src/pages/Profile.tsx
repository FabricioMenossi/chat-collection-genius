
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import ApiKeyForm from '@/components/ApiKeyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Key, User, LogOut } from 'lucide-react';

const Profile = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('openai_api_key'));
  const { toast } = useToast();

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  const handleTestApiKey = async (key: string): Promise<boolean> => {
    // Simulate API key testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // In a real app, this would validate with OpenAI
      }, 1000);
    });
  };

  const handleLogout = () => {
    // This would clear user session in a real app
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for third-party services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyForm
                savedApiKey={apiKey}
                onSaveApiKey={handleSaveApiKey}
                onTestApiKey={handleTestApiKey}
              />
              
              <div className="mt-6 bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">About OpenAI API Key</h3>
                <p className="text-sm text-muted-foreground">
                  The OpenAI API key is required to use the chat functionality. 
                  Your key is stored locally in your browser and is never sent to our servers. 
                  You need to have billing set up with OpenAI for the key to work.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <a 
                    href="https://platform.openai.com/account/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Get your OpenAI API key here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Account Information</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">user@example.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Account Type</p>
                      <p className="text-sm">Free</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm">July 2023</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Account Actions</h3>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout} 
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Profile;
