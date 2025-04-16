
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import DocumentUploadForm from '@/components/DocumentUploadForm';
import { useToast } from '@/hooks/use-toast';

interface Collection {
  id: string;
  name: string;
}

// Mock data
const mockCollections: Collection[] = [
  { id: '1', name: 'Research Papers' },
  { id: '2', name: 'Project Documentation' },
  { id: '3', name: 'Book Summaries' },
  { id: '4', name: 'Meeting Notes' }
];

const Upload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load collections
  useEffect(() => {
    setCollections(mockCollections);
  }, []);

  const handleUploadDocument = async (formData: FormData) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get the collection ID from the form data
    const collectionId = formData.get('collectionId') as string;
    
    toast({
      title: "Upload successful",
      description: "Your document has been uploaded and is being processed."
    });
    
    // Navigate to the collection detail page
    navigate(`/collections/${collectionId}`);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <p className="text-muted-foreground">
          Add a new document to your collection
        </p>
      </div>
      
      <DocumentUploadForm
        collections={collections}
        onUpload={handleUploadDocument}
      />
    </MainLayout>
  );
};

export default Upload;
