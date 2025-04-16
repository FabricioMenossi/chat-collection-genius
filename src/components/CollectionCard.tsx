
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Lock, MessageSquare, File, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  documentsCount: number;
  isPublic: boolean;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  name,
  description,
  documentsCount,
  isPublic,
  onDelete,
  onToggleVisibility
}) => {
  return (
    <Card className={cn(
      "collection-card h-full flex flex-col",
      isPublic ? "border-primary/20" : ""
    )}>
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">{name}</h3>
              {isPublic ? (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Eye className="h-3 w-3" /> Public
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Lock className="h-3 w-3" /> Private
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/collections/${id}`}>View Collection</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/chat?collection=${id}`}>Chat with Collection</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleVisibility(id)}>
                {isPublic ? "Make Private" : "Make Public"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(id)}
              >
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <File className="h-3.5 w-3.5" />
          <span>{documentsCount} document{documentsCount !== 1 ? 's' : ''}</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-8 px-2">
          <Link to={`/chat?collection=${id}`} className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollectionCard;
