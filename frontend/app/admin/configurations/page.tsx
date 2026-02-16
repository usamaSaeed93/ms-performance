"use client";

import { useGetSettingsQuery, useUpdateSettingMutation } from "@/lib/store/api/settingsApi";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export default function ConfigurationsPage() {
    const { data: settings, isLoading } = useGetSettingsQuery();
    const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const [ecommerceEnabled, setEcommerceEnabled] = useState(false);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);

    useEffect(() => {
        if (settings) {
            const ecommerceSetting = settings.find(s => s.key === "ecommerce_enabled");
            if (ecommerceSetting) {
                setEcommerceEnabled(ecommerceSetting.value === "true");
            } else {
                setEcommerceEnabled(true);
            }
        }
    }, [settings]);

    const heroImageUrl = settings?.find(s => s.key === "hero_image_url")?.value || "";

    const handleToggle = async (checked: boolean) => {
        try {
            setEcommerceEnabled(checked);
            await updateSetting({
                key: "ecommerce_enabled",
                value: checked ? "true" : "false",
                description: "Global toggle for e-commerce functionality",
                type: "boolean"
            }).unwrap();
            toast.success(`E-commerce ${checked ? "enabled" : "disabled"}`);
        } catch (error) {
            setEcommerceEnabled(!checked);
            toast.error("Failed to update setting");
        }
    };

    const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            setHeroFile(f);
            const reader = new FileReader();
            reader.onload = (ev) => setHeroPreview(ev.target?.result as string);
            reader.readAsDataURL(f);
        }
    };

    const handleHeroUpload = async () => {
        if (!heroFile) return;
        try {
            const res = await uploadImage({ file: heroFile, folder: "hero" }).unwrap();
            await updateSetting({
                key: "hero_image_url",
                value: res.url,
                description: "Homepage hero background image",
                type: "string"
            }).unwrap();
            toast.success("Hero image updated");
            setHeroFile(null);
            setHeroPreview(null);
        } catch (error) {
            toast.error("Failed to update hero image");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const displayUrl = heroPreview || heroImageUrl || "/images/services/hero-dyno-v2-ue.png";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configurations for the application.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Homepage Hero Image */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Homepage Hero Image
                        </CardTitle>
                        <CardDescription>
                            Set the background image for the homepage hero section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Preview */}
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border bg-muted group">
                            <Image src={displayUrl} alt="Hero" fill className="object-cover" />
                            {heroFile && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                                        Ready to upload
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Upload */}
                        <div className="relative">
                            <label
                                htmlFor="hero-image"
                                className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">
                                    {heroFile ? (
                                        <span className="font-medium text-foreground">{heroFile.name}</span>
                                    ) : (
                                        <>Click to select hero image</>
                                    )}
                                </p>
                                <Input
                                    id="hero-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleHeroFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {heroFile && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleHeroUpload}
                                    disabled={isUploading || isUpdating}
                                    className="flex-1"
                                    size="sm"
                                >
                                    {(isUploading || isUpdating) ? (
                                        <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</>
                                    ) : (
                                        <><Upload className="h-3 w-3 mr-1" /> Upload & Save</>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setHeroFile(null); setHeroPreview(null); }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}

                        {heroImageUrl && !heroFile && (
                            <p className="text-xs text-muted-foreground truncate">
                                Current: {heroImageUrl}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Feature Toggles</CardTitle>
                        <CardDescription>
                            Enable or disable major features of the website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="ecommerce-toggle" className="text-base font-medium">
                                    E-commerce Functionality
                                </Label>
                                <span className="text-sm text-muted-foreground">
                                    When disabled, the Shop, Products, Cart, and other e-commerce related
                                    features will be hidden from the website.
                                </span>
                            </div>
                            <Switch
                                id="ecommerce-toggle"
                                checked={ecommerceEnabled}
                                onCheckedChange={handleToggle}
                                disabled={isUpdating}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Info */}
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground text-center">
                            💡 Service detail page images are managed from the{" "}
                            <a href="/admin/services" className="text-primary underline hover:no-underline font-medium">
                                Services
                            </a>{" "}
                            page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
