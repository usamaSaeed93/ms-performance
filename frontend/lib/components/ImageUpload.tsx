"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";

interface ImageUploadProps {
  folder?: string;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  multiple?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ImageUpload({
  folder = "products",
  onUploadComplete,
  onUploadError,
  className = "",
  multiple = true,
}: ImageUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // Check backend availability on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('[ImageUpload] Checking backend health at:', `${API_BASE_URL}/docs`);
      const response = await fetch(`${API_BASE_URL}/docs`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      console.log('[ImageUpload] Backend health check response:', response.status, response.ok);
      setBackendAvailable(response.ok);
    } catch (error) {
      console.warn('[ImageUpload] Backend health check failed:', error);
      setBackendAvailable(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('[ImageUpload] No files selected');
      return;
    }

    const fileArray = Array.from(files);
    console.log('[ImageUpload] Files selected:', fileArray.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    // Validate all files first
    const validationErrors: string[] = [];
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        validationErrors.push(`"${file.name}" is not an image file`);
      }
      if (file.size > 10 * 1024 * 1024) {
        validationErrors.push(`"${file.name}" exceeds 10MB limit`);
      }
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        console.error('[ImageUpload] Validation error:', error);
        toast.error(error);
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check backend before uploading
    if (backendAvailable === false) {
      const errorMsg = "Backend server is not available. Please ensure the backend is running on port 8000.";
      console.error('[ImageUpload]', errorMsg);
      toast.error(errorMsg);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Initialize progress tracking
    const initialProgress: UploadProgress[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadProgress(initialProgress);

    // Upload all files
    await handleUploadMultiple(fileArray, initialProgress);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (
    file: File, 
    index: number,
    retryCount = 0
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    const MAX_RETRIES = 2;
    
    try {
      console.log(`[ImageUpload] Starting upload for file ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        folder,
        retryCount,
      });

      // Update status to uploading
      setUploadProgress(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'uploading', progress: 0 };
        return updated;
      });

      // Use RTK Query mutation with timeout wrapper
      console.log(`[ImageUpload] Calling uploadImage mutation for ${file.name}...`);
      
      const uploadPromise = uploadImage({ file, folder }).unwrap();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 35 seconds')), 35000)
      );
      
      const result = await Promise.race([uploadPromise, timeoutPromise]) as any;
      
      console.log(`[ImageUpload] Upload successful for ${file.name}:`, result);

      // Update progress to 100%
      setUploadProgress(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'success', progress: 100 };
        return updated;
      });
      
      onUploadComplete?.(result.url);
      return { success: true, url: result.url };
    } catch (error: any) {
      console.error(`[ImageUpload] Error uploading ${file.name}:`, {
        error,
        message: error?.data?.message || error?.message,
        status: error?.status,
        retryCount,
      });
      
      const errorMessage = error?.data?.message || error?.message || 'Failed to upload image';
      
      // Retry logic
      if (retryCount < MAX_RETRIES && (
        errorMessage.includes('timeout') || 
        errorMessage.includes('network') ||
        errorMessage.includes('Failed to fetch') ||
        error?.status === 'FETCH_ERROR'
      )) {
        console.log(`[ImageUpload] Retrying upload for ${file.name} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return uploadFile(file, index, retryCount + 1);
      }

      setUploadProgress(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: 'error', 
          error: errorMessage 
        };
        return updated;
      });

      onUploadError?.(`Failed to upload ${file.name}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const handleUploadMultiple = async (
    files: File[], 
    progressArray: UploadProgress[]
  ) => {
    const uploadToast = toast.loading(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);
    
    console.log('[ImageUpload] Starting batch upload:', {
      fileCount: files.length,
      files: files.map(f => ({ name: f.name, size: f.size })),
    });
    
    // Serialize uploads to avoid concurrent request issues
    const results: Array<{ success: boolean; url?: string; error?: string }> = [];
    
    for (let i = 0; i < files.length; i++) {
      console.log(`[ImageUpload] Uploading file ${i + 1} of ${files.length}`);
      const result = await uploadFile(files[i], i);
      results.push(result);
      
      // Small delay between uploads to avoid overwhelming the server
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    try {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      console.log('[ImageUpload] Batch upload complete:', {
        successCount,
        failCount,
        results,
      });
      
      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}`, { id: uploadToast });
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`Uploaded ${successCount} image${successCount > 1 ? 's' : ''}, ${failCount} failed`, { id: uploadToast });
      } else {
        toast.error("Failed to upload all images. Check console for details.", { id: uploadToast });
      }
    } catch (error: any) {
      console.error("[ImageUpload] Unexpected error during upload:", error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`, { id: uploadToast });
    } finally {
      // Reset state after a short delay to show final status
      setTimeout(() => {
        setUploadProgress([]);
      }, 2000);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getUploadStatusText = () => {
    if (uploadProgress.length === 0) return null;
    
    const successCount = uploadProgress.filter(p => p.status === 'success').length;
    const errorCount = uploadProgress.filter(p => p.status === 'error').length;
    const uploadingCount = uploadProgress.filter(p => p.status === 'uploading').length;
    const total = uploadProgress.length;

    if (successCount === total) {
      return `Uploaded ${successCount} of ${total}`;
    }
    if (errorCount > 0) {
      return `Uploaded ${successCount}, Failed ${errorCount} of ${total}`;
    }
    if (uploadingCount > 0) {
      return `Uploading ${successCount + uploadingCount} of ${total}...`;
    }
    return `Preparing ${total} file${total > 1 ? 's' : ''}...`;
  };

  const uploading = uploadProgress.length > 0 || isUploading;

  return (
    <div className={className}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        multiple={multiple}
        disabled={uploading}
      />

      {backendAvailable === false && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Backend server not available. Please start the backend server.</span>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={uploading || backendAvailable === false}
        className="w-full h-48 flex flex-col items-center justify-center gap-2 border-dashed"
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="font-medium">{getUploadStatusText() || "Uploading..."}</span>
            {uploadProgress.length > 0 && (
              <div className="w-full max-w-xs mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${(uploadProgress.filter(p => p.status === 'success' || p.status === 'uploading').length / uploadProgress.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Upload className="h-8 w-8" />
            <span>{multiple ? "Click to upload images" : "Click to upload image"}</span>
            <span className="text-xs text-muted-foreground">Max 10MB per file</span>
          </>
        )}
      </Button>

      {/* Show individual file status */}
      {uploadProgress.length > 0 && uploadProgress.some(p => p.status === 'error') && (
        <div className="mt-4 space-y-2">
          {uploadProgress.map((progress, index) => (
            progress.status === 'error' && (
              <div key={index} className="text-xs text-destructive p-2 bg-destructive/10 rounded">
                <strong>{progress.file.name}:</strong> {progress.error}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
