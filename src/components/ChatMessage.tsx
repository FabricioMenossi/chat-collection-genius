
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type MessageType = 'user' | 'ai';

interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp
}) => {
  return (
    <div className={cn(
      "flex w-full gap-3 p-4",
      type === 'user' ? "justify-end" : "justify-start"
    )}>
      {type === 'ai' && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "flex flex-col max-w-[80%]",
        type === 'user' ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "p-3",
          type === 'user' ? "chat-message-user" : "chat-message-ai"
        )}>
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {timestamp}
        </span>
      </div>
      {type === 'user' && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
