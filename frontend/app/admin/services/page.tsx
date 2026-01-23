"use client";

import { useGetServicesQuery, useUpdateServiceMutation } from "@/lib/store/api/servicesApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";

export default function ServicesPage() {
    const { data: services, isLoading } = useGetServicesQuery();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        image_url: "",
        link: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleEdit = (service: any) => {
        setSelectedService(service);
        setFormData({
            image_url: service.image_url || "",
            link: service.link || "",
            description: service.description || "",
        });
        setIsOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            const res = await uploadImage({
                file: selectedFile,
                folder: "services",
            }).unwrap();
            setFormData((prev) => ({ ...prev, image_url: res.url }));
            toast.success("Image uploaded successfully");
            setSelectedFile(null);
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleSave = async () => {
        if (!selectedService) return;
        try {
            await updateService({
                id: selectedService.id,
                ...formData,
            }).unwrap();
            toast.success("Service updated successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to update service");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                <p className="text-muted-foreground">
                    Manage the images and details of the homepage services.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services?.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                        <div className="relative aspect-video w-full bg-muted">
                            {service.image_url ? (
                                <Image
                                    src={service.image_url}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleEdit(service)}
                            >
                                Edit Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service: {selectedService?.title}</DialogTitle>
                        <DialogDescription>
                            Update the image, link, or description for this service.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label>Service Image</Label>

                            {/* Image Preview */}
                            {(formData.image_url || selectedFile) && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                                    {selectedFile ? (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : formData.image_url ? (
                                        <img
                                            src={formData.image_url}
                                            alt="Current"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                    {selectedFile && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <span className="text-xs font-medium text-white px-2 py-1 rounded bg-black/60">
                                                Ready to upload
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="relative">
                                <label
                                    htmlFor="image"
                                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                                        <p className="text-sm text-muted-foreground">
                                            {selectedFile ? (
                                                <span className="font-medium text-foreground">{selectedFile.name}</span>
                                            ) : (
                                                <>Click to select an image</>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                    </div>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Upload Button */}
                            {selectedFile && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    onClick={handleUpload}
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Image
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Current URL (read-only) */}
                            {formData.image_url && !selectedFile && (
                                <p className="text-xs text-muted-foreground truncate">
                                    Current: {formData.image_url}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input
                                id="link"
                                value={formData.link}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
