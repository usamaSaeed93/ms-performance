"use client";

import { useState, useRef, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, MoveUp, MoveDown, Star } from "lucide-react";

export interface ImageGalleryItem {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
  is_primary?: boolean;
}

interface ImageGalleryProps {
  images: ImageGalleryItem[];
  onImagesChange: (images: ImageGalleryItem[]) => void;
  folder?: string;
  validationError?: string;
  onValidationChange?: (hasError: boolean) => void;
}

interface ImageGalleryProps {
  images: ImageGalleryItem[];
  onImagesChange: (images: ImageGalleryItem[]) => void;
  folder?: string;
  validationError?: string;
  onValidationChange?: (hasError: boolean) => void;
}

export default function ImageGallery({ 
  images, 
  onImagesChange, 
  folder = "products",
  validationError,
  onValidationChange,
}: ImageGalleryProps) {
  // Use ref to track current images state to avoid stale closure issues with multiple uploads
  const imagesRef = useRef<ImageGalleryItem[]>(images);
  
  // Keep ref in sync with prop changes
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Validate images
  useEffect(() => {
    const hasError = !!validationError;
    onValidationChange?.(hasError);
  }, [validationError, onValidationChange]);
  
  const handleAddImage = (url: string) => {
    // Use ref to get the most current images state, avoiding stale closures
    const currentImages = imagesRef.current;
    const newImage: ImageGalleryItem = {
      image_url: url,
      alt_text: "",
      sort_order: currentImages.length,
      is_primary: currentImages.length === 0,
    };
    // Always append to current images array to ensure all uploads are included
    const updatedImages = [...currentImages, newImage];
    imagesRef.current = updatedImages; // Update ref immediately
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    onImagesChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onImagesChange(newImages);
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      newImages.forEach((img, i) => {
        img.sort_order = i;
      });
      onImagesChange(newImages);
    }
  };

  const handleAltTextChange = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index].alt_text = altText;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          // Ensure image URLs are absolute - prefix relative URLs with backend base URL
          const imageUrl = image.image_url.startsWith('http') || image.image_url.startsWith('//')
            ? image.image_url
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${image.image_url}`;
          
          return (
            <Card key={image.image_url || index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={imageUrl}
                  alt={image.alt_text || `Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    e.currentTarget.src = '/placeholder-image.png'; // Fallback if image fails to load
                  }}
                />
                {image.is_primary && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-md shadow-lg flex items-center gap-1 z-10">
                    <Star className="h-3 w-3 fill-white" />
                    Primary
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 shadow-lg"
                    size="icon"
                    onClick={() => handleSetPrimary(index)}
                    title="Set as primary"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg"
                    size="icon"
                    onClick={() => handleMoveImage(index, "up")}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 shadow-lg"
                    size="icon"
                    onClick={() => handleMoveImage(index, "down")}
                    disabled={index === images.length - 1}
                    title="Move down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <Input
                  type="text"
                  value={image.alt_text || ""}
                  onChange={(e) => handleAltTextChange(index, e.target.value)}
                  placeholder="Alt text"
                  className="text-xs"
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <ImageUpload
          folder={folder}
          onUploadComplete={handleAddImage}
          onUploadError={(error) => {
            // Error handling is done in ImageUpload component via toast
            console.error("Image upload error:", error);
          }}
          multiple={true}
        />
        {validationError && (
          <p className="text-sm text-destructive mt-2">{validationError}</p>
        )}
      </div>
    </div>
  );
}
