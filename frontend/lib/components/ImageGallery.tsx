"use client";

import { useState } from "react";
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
}

export default function ImageGallery({ images, onImagesChange, folder = "products" }: ImageGalleryProps) {
  const handleAddImage = (url: string) => {
    const newImage: ImageGalleryItem = {
      image_url: url,
      alt_text: "",
      sort_order: images.length,
      is_primary: images.length === 0,
    };
    onImagesChange([...images, newImage]);
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
        {images.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={image.image_url}
                alt={image.alt_text || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleSetPrimary(index)}
                  title="Set as primary"
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleMoveImage(index, "up")}
                  disabled={index === 0}
                  title="Move up"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => handleMoveImage(index, "down")}
                  disabled={index === images.length - 1}
                  title="Move down"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
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
        ))}
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
      </div>
    </div>
  );
}
