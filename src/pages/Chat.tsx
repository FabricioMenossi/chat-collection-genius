
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import ChatMessage from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Info, Settings, Sparkles, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import ApiKeyForm from '@/components/ApiKeyForm';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Collection {
  id: string;
  name: string;
}

// Mock data
const mockCollections: Collection[] = [
  { id: '1', name: 'Research Papers' },
  { id: '2', name: 'Project Documentation' },
  { id: '3', name: 'Book Summaries' },
  { id: '4', name: 'Meeting Notes' },
  { id: '5', name: 'Machine Learning Resources' },
  { id: '6', name: 'Philosophy Texts' }
];

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('openai_api_key'));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load collections
  useEffect(() => {
    setCollections(mockCollections);
    
    // Check for collection in URL params
    const collectionId = searchParams.get('collection');
    if (collectionId) {
      setSelectedCollectionId(collectionId);
    }
  }, [searchParams]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your OpenAI API key in the settings",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCollectionId) {
      toast({
        title: "No collection selected",
        description: "Please select a collection to chat with",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const selectedCollection = collections.find(c => c.id === selectedCollectionId);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `This is a simulated response about "${selectedCollection?.name}" that would come from the RAG system with OpenAI: ${input}`,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setSearchParams({ collection: collectionId });
    
    // Clear messages when changing collection
    setMessages([]);
    
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      toast({
        title: `Chatting with "${collection.name}"`,
        description: "You can now ask questions about documents in this collection."
      });
    }
  };
  
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
  
  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const hasApiKey = !!apiKey;
  
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)] md:max-h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Chat</h1>
            <p className="text-muted-foreground">
              Ask questions about your documents
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasApiKey && (
              <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>API Key Set</span>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chat Settings</SheetTitle>
                  <SheetDescription>
                    Configure your OpenAI API key and other settings.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <ApiKeyForm
                    savedApiKey={apiKey}
                    onSaveApiKey={handleSaveApiKey}
                    onTestApiKey={handleTestApiKey}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <Select 
              value={selectedCollectionId} 
              onValueChange={handleCollectionChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="flex-1 overflow-y-auto pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                {selectedCollectionId 
                  ? "Ask questions about documents in this collection to get AI-powered answers." 
                  : "Select a collection from the dropdown above to start chatting."}
              </p>
              
              {!hasApiKey && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Info className="h-4 w-4" />
                      API Key Required
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>API Key Required</SheetTitle>
                      <SheetDescription>
                        You need to provide your OpenAI API key to use the chat functionality.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <ApiKeyForm
                        savedApiKey={apiKey}
                        onSaveApiKey={handleSaveApiKey}
                        onTestApiKey={handleTestApiKey}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  timestamp={formatTimestamp(message.timestamp)}
                />
              ))}
              
              {isProcessing && (
                <div className="flex gap-2 p-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse-opacity" />
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse-opacity" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse-opacity" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedCollectionId 
                ? "Ask a question about documents in this collection..." 
                : "Select a collection to start chatting..."}
              disabled={!selectedCollectionId || !hasApiKey || isProcessing}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || !selectedCollectionId || !hasApiKey || isProcessing}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          
          {!hasApiKey && (
            <p className="text-xs text-destructive mt-2">
              Please set your OpenAI API key in settings to use the chat.
            </p>
          )}
          
          {!selectedCollectionId && (
            <p className="text-xs text-muted-foreground mt-2">
              Select a collection from the dropdown to start chatting.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
