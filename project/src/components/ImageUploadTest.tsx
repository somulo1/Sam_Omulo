import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UploadResponse {
  path: string;
  url: string | null;
  error: Error | null;
}

export function ImageUploadTest() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponses, setUploadResponses] = useState<UploadResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    const newResponses: UploadResponse[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }

        const timestamp = new Date().getTime();
        const fileExt = file.name.split('.').pop();
        const fileName = `test-${timestamp}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to portfolio-images bucket
        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        newResponses.push({
          path: filePath,
          url: data.publicUrl,
          error: null
        });
      }

      setUploadResponses(prev => [...prev, ...newResponses]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('portfolio-images')
        .remove([path]);

      if (error) throw error;

      setUploadResponses(prev => prev.filter(response => response.path !== path));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deletion');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Storage Test</h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <label className="block mb-2">
          <span className="text-gray-700">Upload Images (Max 5MB each)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
        
        {isUploading && (
          <div className="mt-2 text-blue-600">
            Uploading...
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-2 gap-4">
        {uploadResponses.map((response, index) => (
          <div key={index} className="border rounded-lg p-4">
            {response.url && (
              <img
                src={response.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <div className="text-sm text-gray-500 truncate mb-2">
              {response.path}
            </div>
            <button
              onClick={() => handleDelete(response.path)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
