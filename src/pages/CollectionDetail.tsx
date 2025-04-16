
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import DocumentCard from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Lock, 
  ArrowLeft, 
  Upload, 
  Search, 
  MessageSquare,
  Trash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Tag {
  id: string;
  name: string;
}

interface Document {
  id: string;
  title: string;
  author: string;
  releaseDate: string;
  tags: Tag[];
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Introduction to Artificial Intelligence',
    author: 'John Smith',
    releaseDate: '2022-05-15',
    tags: [
      { id: '1', name: 'AI' },
      { id: '2', name: 'Introduction' }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    author: 'Sarah Johnson',
    releaseDate: '2022-06-20',
    tags: [
      { id: '3', name: 'Machine Learning' },
      { id: '4', name: 'Fundamentals' }
    ]
  },
  {
    id: '3',
    title: 'Deep Learning Applications',
    author: 'David Chen',
    releaseDate: '2022-07-10',
    tags: [
      { id: '5', name: 'Deep Learning' },
      { id: '6', name: 'Applications' }
    ]
  }
];

const mockCollections = [
  {
    id: '1',
    name: 'Research Papers',
    description: 'A collection of academic research papers on artificial intelligence',
    isPublic: true,
  },
  {
    id: '2',
    name: 'Project Documentation',
    description: 'Technical documentation for internal projects',
    isPublic: false,
  }
];

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [collection, setCollection] = useState<{ id: string; name: string; description: string; isPublic: boolean } | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Load mock data
  useEffect(() => {
    const foundCollection = mockCollections.find(c => c.id === id);
    if (foundCollection) {
      setCollection(foundCollection);
      setDocuments(mockDocuments);
    }
  }, [id]);
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleToggleVisibility = () => {
    if (collection) {
      setCollection({
        ...collection,
        isPublic: !collection.isPublic
      });
      
      toast({
        title: `Collection is now ${!collection.isPublic ? 'public' : 'private'}`,
        description: `Other users ${!collection.isPublic ? 'can' : 'cannot'} see this collection now.`
      });
    }
  };
  
  const handleDeleteDocument = (confirmed: boolean) => {
    if (confirmed && documentToDelete) {
      setDocuments(docs => docs.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: "Document deleted",
        description: "The document has been removed from this collection"
      });
    }
    
    setDocumentToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  if (!collection) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Collection not found</h2>
          <p className="text-muted-foreground mb-4">The collection you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link to="/">Go back to collections</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mb-4"
        >
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              {collection.isPublic ? (
                <Badge variant="outline" className="gap-1">
                  <Eye className="h-3.5 w-3.5" /> Public
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3.5 w-3.5" /> Private
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{collection.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="gap-1"
            >
              <Link to={`/chat?collection=${collection.id}`}>
                <MessageSquare className="h-4 w-4" />
                Chat with Collection
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="gap-1"
            >
              <Link to={`/upload?collection=${collection.id}`}>
                <Upload className="h-4 w-4" />
                Add Document
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center ml-4 gap-2">
          <Label htmlFor="public-toggle" className="cursor-pointer">
            {collection.isPublic ? "Public" : "Private"}
          </Label>
          <Switch
            id="public-toggle"
            checked={collection.isPublic}
            onCheckedChange={handleToggleVisibility}
          />
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Documents ({filteredDocuments.length})</h2>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/30">
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium mb-2">No matching documents</h3>
              <p className="text-muted-foreground mb-4">
                No documents match your search term "{searchTerm}"
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No documents in this collection</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first document to this collection
              </p>
              <Button asChild>
                <Link to={`/upload?collection=${collection.id}`} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Add Document
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              author={doc.author}
              releaseDate={doc.releaseDate}
              tags={doc.tags}
              onDelete={(id) => {
                setDocumentToDelete(id);
                setIsDeleteDialogOpen(true);
              }}
              onView={(id) => {
                toast({
                  title: "View document",
                  description: "Viewing document functionality would be implemented here"
                });
              }}
            />
          ))}
        </div>
      )}
      
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document from the collection? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDeleteDocument(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteDocument(true)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default CollectionDetail;
