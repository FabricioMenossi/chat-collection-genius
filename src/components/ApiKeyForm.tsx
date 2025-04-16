
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyFormProps {
  savedApiKey: string | null;
  onSaveApiKey: (apiKey: string) => void;
  onTestApiKey: (apiKey: string) => Promise<boolean>;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  savedApiKey,
  onSaveApiKey,
  onTestApiKey
}) => {
  const [apiKey, setApiKey] = useState(savedApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    onSaveApiKey(apiKey);
    
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsTesting(true);
      const valid = await onTestApiKey(apiKey);
      setIsValid(valid);
      
      if (valid) {
        toast({
          title: "Success",
          description: "API key is valid",
        });
      } else {
        toast({
          title: "Error",
          description: "API key is invalid",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Error",
        description: "Failed to test API key",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Your OpenAI API Key</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showApiKey ? "Hide API key" : "Show API key"}
                  </span>
                </button>
              </div>
            </div>
            {isValid !== null && (
              <div className={`flex items-center gap-1.5 text-sm mt-1.5 ${isValid ? 'text-green-600' : 'text-destructive'}`}>
                {isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>API key is valid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>API key is invalid</span>
                  </>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveApiKey}
              className="flex-1"
              disabled={!apiKey.trim()}
            >
              Save Key
            </Button>
            <Button
              variant="outline"
              onClick={handleTestApiKey}
              disabled={isTesting || !apiKey.trim()}
              className="flex-1"
            >
              {isTesting ? "Testing..." : "Test Key"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
