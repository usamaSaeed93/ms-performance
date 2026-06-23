"use client";

import { useGetServicesQuery, useUpdateServiceMutation } from "@/lib/store/api/servicesApi";
import { useGetSettingsQuery, useUpdateSettingMutation } from "@/lib/store/api/settingsApi";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Loader2, Upload, ImageIcon, Palette, Eye } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SERVICE_PAGES, ServiceImageType } from "@/hooks/useServicePageImage";

// Color tags for services
const SERVICE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
    "ECU Remapping": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", label: "Software" },
    "Custom Exhausts": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "Fabrication" },
    "DPF & EGR Solutions": { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", label: "Emissions" },
    "Servicing": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "Hardware" },
};

// Map service titles to detail page slugs
const TITLE_TO_SLUG: Record<string, string> = {
    "ECU Remapping": "ecu-remapping",
    "Dyno Tests": "dyno-tests",
    "Custom Exhausts": "custom-exhausts",
    "DPF & EGR Services": "dpf-egr-services",
    "Turbo Upgrades": "turbo-upgrades",
};

// Tag style config for image uploaders
const TAG_STYLES: Record<string, { gradient: string; bg: string; text: string; ring: string; shadow: string }> = {
    "Hero": { gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200", shadow: "shadow-indigo-100" },
    "Content 1": { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", shadow: "shadow-emerald-100" },
    "Content 2": { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200", shadow: "shadow-violet-100" },
};

// Image uploader component with dynamic hover effects
function ImageUploader({
    label,
    tag,
    currentUrl,
    fallbackUrl,
    onUpload,
    isUploading,
}: {
    label: string;
    tag: string;
    currentUrl: string;
    fallbackUrl: string;
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [localUploading, setLocalUploading] = useState(false);

    const displayUrl = preview || currentUrl || fallbackUrl;
    const style = TAG_STYLES[tag] || TAG_STYLES["Hero"];

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setFile(f);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(f);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLocalUploading(true);
        try {
            await onUpload(file);
            setFile(null);
            setPreview(null);
            toast.success(`${label} updated`);
        } catch {
            toast.error(`Failed to update ${label}`);
        } finally {
            setLocalUploading(false);
        }
    };

    const busy = localUploading || isUploading;

    return (
        <div className={`rounded-xl border p-2.5 space-y-2 transition-all duration-200 hover:shadow-md ${style.shadow} hover:ring-1 ${style.ring}`}>
            {/* Tag header */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{label}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {tag}
                </span>
            </div>

            {/* Image preview with hover animation */}
            <div className="relative h-32 w-full rounded-lg overflow-hidden border bg-muted group cursor-pointer">
                {displayUrl && (
                    <Image
                        src={displayUrl}
                        alt={label}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                {/* Gradient sweep on hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t ${style.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

                {file ? (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-white">Ready to upload</span>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2.5">
                        <label className="cursor-pointer bg-white text-foreground text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                            📷 Change
                            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                        </label>
                    </div>
                )}
            </div>

            {/* Upload actions with gradient button */}
            {file && (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        onClick={handleUpload}
                        disabled={busy}
                        className={`flex-1 h-7 text-[11px] bg-gradient-to-r ${style.gradient} text-white border-0 hover:opacity-90`}
                    >
                        {busy ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                        {busy ? "Uploading..." : "Upload"}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setFile(null); setPreview(null); }}
                        className="h-7 text-[11px] px-2 text-muted-foreground"
                    >
                        ✕
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function ServicesPage() {
    const { data: services, isLoading } = useGetServicesQuery();
    const { data: settings } = useGetSettingsQuery();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [updateSetting] = useUpdateSettingMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        image_url: "",
        link: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const getSettingValue = useCallback((key: string) => {
        return settings?.find(s => s.key === key)?.value || "";
    }, [settings]);

    const handleEdit = (service: any) => {
        setSelectedService(service);
        setFormData({
            image_url: service.image_url || "",
            link: service.link || "",
            description: service.description || "",
        });
        setSelectedFile(null);
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
            toast.success("Thumbnail uploaded successfully");
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

    // Upload a detail page image and save the URL to settings
    const handleDetailImageUpload = async (settingsKey: string, description: string, file: File) => {
        const res = await uploadImage({ file, folder: "services" }).unwrap();
        await updateSetting({
            key: settingsKey,
            value: res.url,
            description,
            type: "string",
        }).unwrap();
    };

    const getColorTag = (title: string) => {
        return SERVICE_COLORS[title] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", label: "Service" };
    };

    const getSlug = (title: string) => TITLE_TO_SLUG[title] || "";

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const excludedTitles = new Set([
        "ECU Diagnostics",
        "Stage Upgrades",
        "Performance Tuning",
    ]);
    const selectedSlug = selectedService ? getSlug(selectedService.title) : "";
    const selectedConfig = selectedSlug ? SERVICE_PAGES[selectedSlug] : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                <p className="text-muted-foreground">
                    Manage the thumbnails, detail page images, and information for each service.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services?.filter((service) => !excludedTitles.has(service.title)).map((service) => {
                    const color = getColorTag(service.title);
                    const slug = getSlug(service.title);
                    const hasDetailImages = slug && SERVICE_PAGES[slug];

                    return (
                        <Card key={service.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
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
                                        <ImageIcon className="h-8 w-8 opacity-40" />
                                    </div>
                                )}
                                {/* Color tag overlay */}
                                <div className="absolute top-2 left-2 flex items-center gap-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text} backdrop-blur-sm`}>
                                        {color.label}
                                    </span>
                                    {hasDetailImages && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                                            <Eye className="h-2.5 w-2.5 inline mr-0.5" />
                                            Detail Page
                                        </span>
                                    )}
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full h-9 text-sm"
                                    onClick={() => handleEdit(service)}
                                >
                                    <Palette className="h-3.5 w-3.5 mr-1.5" />
                                    Manage Images & Details
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedService?.title}
                            {selectedService && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getColorTag(selectedService.title).bg} ${getColorTag(selectedService.title).text}`}>
                                    {getColorTag(selectedService.title).label}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Manage the thumbnail, detail page images, and information for this service.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-2">
                        {/* Thumbnail Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">Service Thumbnail</h3>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                                    Homepage Card
                                </span>
                            </div>

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

                            <div className="relative">
                                <label
                                    htmlFor="thumbnail"
                                    className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                        <p className="text-xs text-muted-foreground">
                                            {selectedFile ? (
                                                <span className="font-medium text-foreground">{selectedFile.name}</span>
                                            ) : (
                                                <>Click to select thumbnail</>
                                            )}
                                        </p>
                                    </div>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {selectedFile && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    onClick={handleUpload}
                                    size="sm"
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <><Loader2 className="mr-2 h-3 w-3 animate-spin" />Uploading...</>
                                    ) : (
                                        <><Upload className="mr-2 h-3 w-3" />Upload Thumbnail</>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Divider */}
                        {selectedConfig && (
                            <>
                                <div className="border-t" />

                                {/* Detail Page Images — dynamic section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-foreground">Detail Page Images</h3>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                                            {selectedService?.title} Detail Page
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        These 3 images appear on the <span className="font-medium text-foreground">{selectedService?.title}</span> detail page — the hero banner and two content section images.
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <ImageUploader
                                            label="Hero Banner"
                                            tag="Hero"
                                            currentUrl={getSettingValue(selectedConfig.hero.settingsKey)}
                                            fallbackUrl={selectedConfig.hero.fallbackImage}
                                            onUpload={(file) => handleDetailImageUpload(
                                                selectedConfig.hero.settingsKey,
                                                `Hero image for ${selectedService?.title} page`,
                                                file
                                            )}
                                            isUploading={isUploading}
                                        />
                                        <ImageUploader
                                            label="Content Left"
                                            tag="Content 1"
                                            currentUrl={getSettingValue(selectedConfig.content1.settingsKey)}
                                            fallbackUrl={selectedConfig.content1.fallbackImage}
                                            onUpload={(file) => handleDetailImageUpload(
                                                selectedConfig.content1.settingsKey,
                                                `Content image 1 for ${selectedService?.title} page`,
                                                file
                                            )}
                                            isUploading={isUploading}
                                        />
                                        <ImageUploader
                                            label="Content Right"
                                            tag="Content 2"
                                            currentUrl={getSettingValue(selectedConfig.content2.settingsKey)}
                                            fallbackUrl={selectedConfig.content2.fallbackImage}
                                            onUpload={(file) => handleDetailImageUpload(
                                                selectedConfig.content2.settingsKey,
                                                `Content image 2 for ${selectedService?.title} page`,
                                                file
                                            )}
                                            isUploading={isUploading}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Divider */}
                        <div className="border-t" />

                        {/* Text Fields */}
                        <div className="grid gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="link" className="text-xs font-medium">Link URL</Label>
                                <Input
                                    id="link"
                                    value={formData.link}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, link: e.target.value }))
                                    }
                                    className="h-9 text-sm"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="h-9 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={isUpdating} size="sm">
                            {isUpdating && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
