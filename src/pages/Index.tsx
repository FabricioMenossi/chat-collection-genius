
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import CollectionCard from '@/components/CollectionCard';
import CreateCollectionForm from '@/components/CreateCollectionForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, LockIcon } from 'lucide-react';

// Mock data types
interface Collection {
  id: string;
  name: string;
  description: string;
  documentsCount: number;
  isPublic: boolean;
  createdAt: Date;
}

// Mock data for collections
const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Research Papers',
    description: 'A collection of academic research papers on artificial intelligence',
    documentsCount: 12,
    isPublic: true,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Project Documentation',
    description: 'Technical documentation for internal projects',
    documentsCount: 5,
    isPublic: false,
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Book Summaries',
    description: 'Summaries of books I\'ve read recently',
    documentsCount: 8,
    isPublic: true,
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Meeting Notes',
    description: 'Notes from team meetings and client calls',
    documentsCount: 15,
    isPublic: false,
    createdAt: new Date('2023-01-05')
  }
];

// Mock public collections from other users
const mockPublicCollections: Collection[] = [
  {
    id: '5',
    name: 'Machine Learning Resources',
    description: 'Comprehensive collection of ML papers and tutorials',
    documentsCount: 24,
    isPublic: true,
    createdAt: new Date('2023-01-18')
  },
  {
    id: '6',
    name: 'Philosophy Texts',
    description: 'Classic philosophical texts from various traditions',
    documentsCount: 18,
    isPublic: true,
    createdAt: new Date('2023-02-12')
  }
];

const Index = () => {
  const [myCollections, setMyCollections] = useState<Collection[]>([]);
  const [publicCollections, setPublicCollections] = useState<Collection[]>([]);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-collections");
  const { toast } = useToast();

  // Load mock data
  useEffect(() => {
    setMyCollections(mockCollections);
    setPublicCollections(mockPublicCollections);
  }, []);

  const handleCreateCollection = (collection: { name: string; description: string; isPublic: boolean }) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: collection.name,
      description: collection.description,
      documentsCount: 0,
      isPublic: collection.isPublic,
      createdAt: new Date()
    };
    
    setMyCollections((prev) => [newCollection, ...prev]);
  };

  const handleDeleteCollection = (confirmed: boolean) => {
    if (confirmed && collectionToDelete) {
      setMyCollections((prev) => prev.filter((c) => c.id !== collectionToDelete));
      
      toast({
        title: "Collection deleted",
        description: "The collection has been deleted successfully."
      });
    }
    
    setCollectionToDelete(null);
  };

  const handleToggleVisibility = (id: string) => {
    setMyCollections((prev) => 
      prev.map((c) => 
        c.id === id 
          ? { ...c, isPublic: !c.isPublic } 
          : c
      )
    );
    
    toast({
      title: "Collection updated",
      description: "The collection visibility has been updated successfully."
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground">
            Manage your document collections
          </p>
        </div>
        <div>
          <CreateCollectionForm onCollectionCreate={handleCreateCollection} />
        </div>
      </div>

      <Tabs defaultValue="my-collections" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-collections" className="flex items-center gap-2">
            <LockIcon className="h-4 w-4" />
            My Collections
          </TabsTrigger>
          <TabsTrigger value="public-collections" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Public Collections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-collections">
          {myCollections.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">No collections yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first collection to start organizing your documents
              </p>
              <CreateCollectionForm onCollectionCreate={handleCreateCollection} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  id={collection.id}
                  name={collection.name}
                  description={collection.description}
                  documentsCount={collection.documentsCount}
                  isPublic={collection.isPublic}
                  onDelete={(id) => setCollectionToDelete(id)}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public-collections">
          {publicCollections.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">No public collections</h3>
              <p className="text-muted-foreground">
                Public collections from other users will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  id={collection.id}
                  name={collection.name}
                  description={collection.description}
                  documentsCount={collection.documentsCount}
                  isPublic={collection.isPublic}
                  onDelete={() => {}}
                  onToggleVisibility={() => {}}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!collectionToDelete} onOpenChange={(open) => !open && setCollectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone 
              and all documents within this collection will be deleted as well.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDeleteCollection(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteCollection(true)}
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

export default Index;
