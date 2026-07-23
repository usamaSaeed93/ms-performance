"use client";

import { useGetSettingsQuery, useUpdateSettingMutation } from "@/lib/store/api/settingsApi";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, ImageIcon, Trash2, Type, FlaskConical, CheckCircle2, XCircle, BarChart3, Plus } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { resolveVRM, type VRMResponse } from "@/lib/api/vrm";
import {
    DEFAULT_GAINS_CALCULATOR_HERO_IMAGE,
    DEFAULT_HOME_ABOUT_CONTENT,
    DEFAULT_HOME_ABOUT_IMAGE,
    DEFAULT_SERVICES_PAGE_HERO_IMAGE,
    GAINS_CALCULATOR_HERO_IMAGE_KEY,
    HOME_ABOUT_CONTENT_KEY,
    HOME_ABOUT_IMAGE_KEY,
    SERVICES_PAGE_HERO_IMAGE_KEY,
    parseHomeAboutContent,
    type HomeAboutContent,
} from "@/lib/constants/homeAboutContent";
import {
    DEFAULT_STATS,
    HOME_STATS_KEY,
    parseStats,
    type StatItem,
} from "@/lib/constants/stats";

export default function ConfigurationsPage() {
    const { data: settings, isLoading } = useGetSettingsQuery();
    const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const [ecommerceEnabled, setEcommerceEnabled] = useState(false);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [heroTexts, setHeroTexts] = useState<{ subtitle: string; heading: string }[]>([]);
    const [savingTextIndex, setSavingTextIndex] = useState<number | null>(null);

    const [servicesHeroFile, setServicesHeroFile] = useState<File | null>(null);
    const [servicesHeroPreview, setServicesHeroPreview] = useState<string | null>(null);
    const [gainsHeroFile, setGainsHeroFile] = useState<File | null>(null);
    const [gainsHeroPreview, setGainsHeroPreview] = useState<string | null>(null);
    const [homeAboutFile, setHomeAboutFile] = useState<File | null>(null);
    const [homeAboutPreview, setHomeAboutPreview] = useState<string | null>(null);
    const [homeAboutContent, setHomeAboutContent] = useState<HomeAboutContent>(DEFAULT_HOME_ABOUT_CONTENT);
    const [savingHomeAbout, setSavingHomeAbout] = useState(false);

    const [homeStats, setHomeStats] = useState<StatItem[]>(DEFAULT_STATS);
    const [savingStats, setSavingStats] = useState(false);

    // VRM tester state
    const [vrmRegex, setVrmRegex] = useState("");
    const [savingVrmRegex, setSavingVrmRegex] = useState(false);
    const [testReg, setTestReg] = useState("");
    const [vrmTesting, setVrmTesting] = useState(false);
    const [vrmResult, setVrmResult] = useState<VRMResponse | null>(null);
    const [vrmTestError, setVrmTestError] = useState<string | null>(null);
    const [regexMatch, setRegexMatch] = useState<boolean | null>(null);

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
    const heroImagesRaw = settings?.find(s => s.key === "hero_image_urls")?.value || "";

    useEffect(() => {
        if (!settings) return;
        let images: string[] = [];
        if (heroImagesRaw) {
            try {
                const parsed = JSON.parse(heroImagesRaw);
                if (Array.isArray(parsed)) {
                    images = parsed.filter((url) => typeof url === "string" && url.trim().length > 0);
                }
            } catch {
                images = heroImagesRaw.split(",").map((url) => url.trim()).filter(Boolean);
            }
        }
        if (images.length === 0 && heroImageUrl) {
            images = [heroImageUrl];
        }
        setHeroImages(images);

        // Load VRM regex
        const savedVrmRegex = settings.find(s => s.key === "vrm_regex")?.value;
        if (savedVrmRegex) setVrmRegex(savedVrmRegex);

        // Load hero texts
        const heroTextsRaw = settings.find(s => s.key === "hero_texts")?.value;
        if (heroTextsRaw) {
            try {
                const parsed = JSON.parse(heroTextsRaw);
                if (Array.isArray(parsed)) {
                    setHeroTexts(parsed);
                    return;
                }
            } catch {}
        }
        setHeroTexts([]);

        const aboutRaw = settings.find((s) => s.key === HOME_ABOUT_CONTENT_KEY)?.value;
        setHomeAboutContent(parseHomeAboutContent(aboutRaw));

        const statsRaw = settings.find((s) => s.key === HOME_STATS_KEY)?.value;
        setHomeStats(parseStats(statsRaw));
    }, [settings, heroImagesRaw, heroImageUrl]);

    const servicesHeroImageUrl =
        settings?.find((s) => s.key === SERVICES_PAGE_HERO_IMAGE_KEY)?.value ||
        DEFAULT_SERVICES_PAGE_HERO_IMAGE;
    const gainsHeroImageUrl =
        settings?.find((s) => s.key === GAINS_CALCULATOR_HERO_IMAGE_KEY)?.value ||
        DEFAULT_GAINS_CALCULATOR_HERO_IMAGE;
    const homeAboutImageUrl =
        settings?.find((s) => s.key === HOME_ABOUT_IMAGE_KEY)?.value || DEFAULT_HOME_ABOUT_IMAGE;

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

    const persistHeroImages = async (images: string[]) => {
        await updateSetting({
            key: "hero_image_urls",
            value: JSON.stringify(images),
            description: "Homepage hero carousel images",
            type: "string"
        }).unwrap();
        await updateSetting({
            key: "hero_image_url",
            value: images[0] || "",
            description: "Homepage hero background image",
            type: "string"
        }).unwrap();
    };

    const handleHeroUpload = async () => {
        if (!heroFile) return;
        try {
            const res = await uploadImage({ file: heroFile, folder: "hero" }).unwrap();
            const nextImages = [...heroImages, res.url];
            await persistHeroImages(nextImages);
            setHeroImages(nextImages);
            toast.success("Hero images updated");
            setHeroFile(null);
            setHeroPreview(null);
        } catch (error) {
            toast.error("Failed to update hero images");
        }
    };

    const handleRemoveHeroImage = async (url: string) => {
        const nextImages = heroImages.filter((image) => image !== url);
        try {
            await persistHeroImages(nextImages);
            setHeroImages(nextImages);
            toast.success("Hero image removed");
        } catch (error) {
            toast.error("Failed to remove hero image");
        }
    };

    const handleHeroTextChange = (index: number, field: "subtitle" | "heading", value: string) => {
        setHeroTexts((prev) => {
            const next = [...prev];
            if (!next[index]) next[index] = { subtitle: "", heading: "" };
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleSaveHeroText = async (index: number) => {
        setSavingTextIndex(index);
        // Build a full array sized to match heroImages length
        const full: { subtitle: string; heading: string }[] = heroImages.map((_, i) => ({
            subtitle: heroTexts[i]?.subtitle || "",
            heading: heroTexts[i]?.heading || "",
        }));
        try {
            await updateSetting({
                key: "hero_texts",
                value: JSON.stringify(full),
                description: "Per-slide hero text (subtitle + heading) for homepage carousel",
                type: "string",
            }).unwrap();
            toast.success(`Slide ${index + 1} text saved`);
        } catch {
            toast.error("Failed to save hero text");
        } finally {
            setSavingTextIndex(null);
        }
    };

    const handleSingleImageUpload = async (
        file: File,
        key: string,
        description: string,
        folder: string,
        onDone: () => void
    ) => {
        try {
            const res = await uploadImage({ file, folder }).unwrap();
            await updateSetting({
                key,
                value: res.url,
                description,
                type: "string",
            }).unwrap();
            onDone();
            toast.success("Image updated");
        } catch {
            toast.error("Failed to update image");
        }
    };

    const handleSaveHomeAboutContent = async () => {
        setSavingHomeAbout(true);
        try {
            await updateSetting({
                key: HOME_ABOUT_CONTENT_KEY,
                value: JSON.stringify(homeAboutContent),
                description: "Homepage Customized Performance Solutions section text",
                type: "string",
            }).unwrap();
            toast.success("Homepage about text saved");
        } catch {
            toast.error("Failed to save homepage about text");
        } finally {
            setSavingHomeAbout(false);
        }
    };

    const handleStatChange = (index: number, field: "value" | "label", value: string) => {
        setHomeStats((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleAddStat = () => {
        setHomeStats((prev) => [...prev, { value: "", label: "" }]);
    };

    const handleRemoveStat = (index: number) => {
        setHomeStats((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveStats = async () => {
        // Drop fully empty rows before persisting.
        const cleaned = homeStats.filter(
            (s) => s.value.trim().length > 0 || s.label.trim().length > 0
        );
        setSavingStats(true);
        try {
            await updateSetting({
                key: HOME_STATS_KEY,
                value: JSON.stringify(cleaned),
                description: "Homepage statistics counters (value + label)",
                type: "string",
            }).unwrap();
            setHomeStats(cleaned.length > 0 ? cleaned : DEFAULT_STATS);
            toast.success("Homepage statistics saved");
        } catch {
            toast.error("Failed to save statistics");
        } finally {
            setSavingStats(false);
        }
    };

    const handleSaveVrmRegex = async () => {
        setSavingVrmRegex(true);
        try {
            await updateSetting({
                key: "vrm_regex",
                value: vrmRegex,
                description: "Regex pattern to validate UK vehicle registration numbers",
                type: "string",
            }).unwrap();
            toast.success("VRM regex saved");
        } catch {
            toast.error("Failed to save regex");
        } finally {
            setSavingVrmRegex(false);
        }
    };

    const handleTestVrm = async () => {
        if (!testReg.trim()) {
            toast.error("Enter a registration number to test");
            return;
        }
        setVrmTesting(true);
        setVrmResult(null);
        setVrmTestError(null);
        setRegexMatch(null);

        // Test regex match first
        if (vrmRegex.trim()) {
            try {
                const regex = new RegExp(vrmRegex.trim(), "i");
                setRegexMatch(regex.test(testReg.trim()));
            } catch {
                setRegexMatch(null);
            }
        }

        // Call VRM API
        try {
            const data = await resolveVRM(testReg.trim().toUpperCase().replace(/\s/g, ""), "msperformance.co.uk");
            setVrmResult(data);
        } catch (err) {
            setVrmTestError(err instanceof Error ? err.message : "VRM lookup failed");
        } finally {
            setVrmTesting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const displayUrl = heroPreview || heroImages[0] || heroImageUrl || "/images/services/hero-dyno-v2-ue.png";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configurations for the application.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Homepage Hero Carousel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Homepage Hero Carousel
                        </CardTitle>
                        <CardDescription>
                            Manage the carousel images for the homepage hero section.
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

                        {heroImages.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {heroImages.map((url, index) => (
                                    <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg border">
                                        <div className="relative h-24 w-full">
                                            <Image src={url} alt={`Hero ${index + 1}`} fill className="object-cover" />
                                        </div>
                                        <div className="flex items-center justify-between gap-2 p-2">
                                            <p className="text-xs text-muted-foreground truncate">Hero {index + 1}</p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => handleRemoveHeroImage(url)}
                                                disabled={isUpdating}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">No hero images added yet.</p>
                        )}

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
                                        <>Click to add hero image</>
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

                        {heroImages.length > 0 && !heroFile && (
                            <p className="text-xs text-muted-foreground truncate">
                                Current: {heroImages.length} image{heroImages.length > 1 ? "s" : ""}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Hero Slide Texts */}
                {heroImages.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Type className="h-5 w-5" />
                                Hero Slide Texts
                            </CardTitle>
                            <CardDescription>
                                Set the subtitle and heading text for each hero carousel slide. Leave blank to use the default text.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {heroImages.map((url, index) => (
                                <div key={`${url}-${index}`} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                            <Image src={url} alt={`Slide ${index + 1}`} fill className="object-cover" />
                                        </div>
                                        <p className="text-sm font-semibold">Slide {index + 1}</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium">Subtitle (small text above heading)</Label>
                                        <Input
                                            placeholder="e.g. Feel the Need for Speed: Dyno Car Tests"
                                            value={heroTexts[index]?.subtitle || ""}
                                            onChange={(e) => handleHeroTextChange(index, "subtitle", e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium">Heading (main title)</Label>
                                        <Textarea
                                            placeholder="e.g. Maximize Power And Fuel Efficiency With Our ECU Remapping Services"
                                            value={heroTexts[index]?.heading || ""}
                                            onChange={(e) => handleHeroTextChange(index, "heading", e.target.value)}
                                            className="text-sm resize-none"
                                            rows={2}
                                        />
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleSaveHeroText(index)}
                                        disabled={savingTextIndex === index || isUpdating}
                                        className="w-full"
                                    >
                                        {savingTextIndex === index ? (
                                            <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...</>
                                        ) : (
                                            "Save Slide Text"
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Services page hero background */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Services Page Hero Image
                        </CardTitle>
                        <CardDescription>
                            Background image behind “Our Premium Services” on the main Services page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border bg-muted">
                            <Image
                                src={servicesHeroPreview || servicesHeroImageUrl}
                                alt="Services page hero"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="services-hero-image"
                            className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                            <p className="text-xs text-muted-foreground">
                                {servicesHeroFile ? (
                                    <span className="font-medium text-foreground">{servicesHeroFile.name}</span>
                                ) : (
                                    <>Click to change services hero image</>
                                )}
                            </p>
                            <Input
                                id="services-hero-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    setServicesHeroFile(f);
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setServicesHeroPreview(ev.target?.result as string);
                                    reader.readAsDataURL(f);
                                }}
                            />
                        </label>
                        {servicesHeroFile && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    disabled={isUploading || isUpdating}
                                    onClick={() =>
                                        handleSingleImageUpload(
                                            servicesHeroFile,
                                            SERVICES_PAGE_HERO_IMAGE_KEY,
                                            "Background image for /services hero (Our Premium Services)",
                                            "services",
                                            () => {
                                                setServicesHeroFile(null);
                                                setServicesHeroPreview(null);
                                            }
                                        )
                                    }
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
                                    onClick={() => {
                                        setServicesHeroFile(null);
                                        setServicesHeroPreview(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Gains calculator hero background */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Gains Calculator Hero Image
                        </CardTitle>
                        <CardDescription>
                            Background image behind “Vehicle Gains” on the Gains Calculator page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden border bg-muted">
                            <Image
                                src={gainsHeroPreview || gainsHeroImageUrl}
                                alt="Gains calculator hero"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <label
                            htmlFor="gains-hero-image"
                            className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                            <p className="text-xs text-muted-foreground">
                                {gainsHeroFile ? (
                                    <span className="font-medium text-foreground">{gainsHeroFile.name}</span>
                                ) : (
                                    <>Click to change gains calculator hero image</>
                                )}
                            </p>
                            <Input
                                id="gains-hero-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    setGainsHeroFile(f);
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setGainsHeroPreview(ev.target?.result as string);
                                    reader.readAsDataURL(f);
                                }}
                            />
                        </label>
                        {gainsHeroFile && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    disabled={isUploading || isUpdating}
                                    onClick={() =>
                                        handleSingleImageUpload(
                                            gainsHeroFile,
                                            GAINS_CALCULATOR_HERO_IMAGE_KEY,
                                            "Background image for /gains-calculator hero (Vehicle Gains)",
                                            "hero",
                                            () => {
                                                setGainsHeroFile(null);
                                                setGainsHeroPreview(null);
                                            }
                                        )
                                    }
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
                                    onClick={() => {
                                        setGainsHeroFile(null);
                                        setGainsHeroPreview(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Homepage about section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="h-5 w-5" />
                            Homepage — Customized Performance Solutions
                        </CardTitle>
                        <CardDescription>
                            Edit the about section text and the adjacent image on the homepage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold">Section image</Label>
                            <div className="relative h-48 w-full rounded-lg overflow-hidden border bg-muted">
                                <Image
                                    src={homeAboutPreview || homeAboutImageUrl}
                                    alt="Homepage about"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <label
                                htmlFor="home-about-image"
                                className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">
                                    {homeAboutFile ? (
                                        <span className="font-medium text-foreground">{homeAboutFile.name}</span>
                                    ) : (
                                        <>Click to change adjacent image</>
                                    )}
                                </p>
                                <Input
                                    id="home-about-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;
                                        setHomeAboutFile(f);
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setHomeAboutPreview(ev.target?.result as string);
                                        reader.readAsDataURL(f);
                                    }}
                                />
                            </label>
                            {homeAboutFile && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        disabled={isUploading || isUpdating}
                                        onClick={() =>
                                            handleSingleImageUpload(
                                                homeAboutFile,
                                                HOME_ABOUT_IMAGE_KEY,
                                                "Homepage Customized Performance Solutions adjacent image",
                                                "home",
                                                () => {
                                                    setHomeAboutFile(null);
                                                    setHomeAboutPreview(null);
                                                }
                                            )
                                        }
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
                                        onClick={() => {
                                            setHomeAboutFile(null);
                                            setHomeAboutPreview(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="border-t" />

                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-medium">Eyebrow</Label>
                                <Input
                                    className="h-9 text-sm"
                                    value={homeAboutContent.eyebrow}
                                    onChange={(e) =>
                                        setHomeAboutContent((prev) => ({ ...prev, eyebrow: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-medium">Title</Label>
                                <Textarea
                                    className="text-sm"
                                    rows={2}
                                    value={homeAboutContent.title}
                                    onChange={(e) =>
                                        setHomeAboutContent((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-medium">Paragraph</Label>
                                <Textarea
                                    className="text-sm"
                                    rows={5}
                                    value={homeAboutContent.paragraph}
                                    onChange={(e) =>
                                        setHomeAboutContent((prev) => ({ ...prev, paragraph: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-medium">Bullets (one per line)</Label>
                                <Textarea
                                    className="text-sm"
                                    rows={4}
                                    value={homeAboutContent.bullets.join("\n")}
                                    onChange={(e) =>
                                        setHomeAboutContent((prev) => ({
                                            ...prev,
                                            bullets: e.target.value
                                                .split("\n")
                                                .map((line) => line.trim())
                                                .filter(Boolean),
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    disabled={savingHomeAbout || isUpdating}
                                    onClick={handleSaveHomeAboutContent}
                                >
                                    {savingHomeAbout ? (
                                        <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...</>
                                    ) : (
                                        "Save About Text"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setHomeAboutContent(DEFAULT_HOME_ABOUT_CONTENT)}
                                >
                                    Reset defaults
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Homepage Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Homepage Statistics
                        </CardTitle>
                        <CardDescription>
                            The counters shown on the homepage (e.g. “945+ Cars Remapped”). The value
                            animates from 0 — keep a suffix like <code className="bg-muted px-1 rounded">+</code> or{" "}
                            <code className="bg-muted px-1 rounded">%</code> on the value.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {homeStats.map((stat, index) => (
                            <div key={index} className="rounded-lg border p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Stat {index + 1}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleRemoveStat(index)}
                                        disabled={isUpdating || savingStats}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs font-medium">Value</Label>
                                        <Input
                                            className="h-9 text-sm"
                                            placeholder="e.g. 945+"
                                            value={stat.value}
                                            onChange={(e) => handleStatChange(index, "value", e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs font-medium">Label</Label>
                                        <Input
                                            className="h-9 text-sm"
                                            placeholder="e.g. Cars Remapped By The MS Performance"
                                            value={stat.label}
                                            onChange={(e) => handleStatChange(index, "label", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddStat}
                            disabled={isUpdating || savingStats}
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add statistic
                        </Button>

                        <div className="flex gap-2 border-t pt-4">
                            <Button
                                size="sm"
                                className="flex-1"
                                disabled={savingStats || isUpdating}
                                onClick={handleSaveStats}
                            >
                                {savingStats ? (
                                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...</>
                                ) : (
                                    "Save Statistics"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={savingStats || isUpdating}
                                onClick={() => setHomeStats(DEFAULT_STATS)}
                            >
                                Reset defaults
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* VRM API Tester */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="h-5 w-5" />
                            VRM API Tester
                        </CardTitle>
                        <CardDescription>
                            Save a regex pattern to validate UK registration plates, then test a specific plate against the gains calculator API to verify it returns vehicle data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Regex input */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">VRM Validation Regex</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={vrmRegex}
                                    onChange={(e) => setVrmRegex(e.target.value)}
                                    placeholder="e.g. ^[A-Z]{2}[0-9]{2}[A-Z]{3}$"
                                    className="h-9 text-sm font-mono flex-1"
                                />
                                <Button size="sm" onClick={handleSaveVrmRegex} disabled={savingVrmRegex} className="h-9">
                                    {savingVrmRegex ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Standard UK new-style:{" "}
                                <code className="bg-muted px-1 rounded text-[10px]">
                                    {`^[A-Z]{2}[0-9]{2}[A-Z]{3}$`}
                                </code>
                            </p>
                        </div>

                        {/* Test input */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Test Registration Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={testReg}
                                    onChange={(e) => setTestReg(e.target.value.toUpperCase())}
                                    placeholder="e.g. AB12CDE"
                                    className="h-9 text-sm font-mono uppercase flex-1"
                                />
                                <Button size="sm" onClick={handleTestVrm} disabled={vrmTesting} className="h-9">
                                    {vrmTesting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                    Test
                                </Button>
                            </div>
                        </div>

                        {/* Regex match result */}
                        {regexMatch !== null && (
                            <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${regexMatch ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                {regexMatch ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                Regex {regexMatch ? "matches" : "does NOT match"} &quot;{testReg}&quot;
                            </div>
                        )}

                        {/* VRM API result */}
                        {vrmTestError && (
                            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-red-700">VRM API Error</p>
                                    <p className="text-xs text-red-600 mt-0.5">{vrmTestError}</p>
                                </div>
                            </div>
                        )}
                        {vrmResult && (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
                                <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    VRM API returned data successfully
                                </div>
                                {vrmResult.engineDetails && (
                                    <div className="grid gap-1.5 mt-2">
                                        {[
                                            { label: "Vehicle", value: vrmResult.engineDetails.fullname },
                                            { label: "Brand", value: vrmResult.engineDetails.paths?.brand?.name },
                                            { label: "Model", value: vrmResult.engineDetails.paths?.model?.name },
                                            { label: "Engine", value: vrmResult.engineDetails.paths?.engine?.name },
                                            { label: "Fuel", value: vrmResult.engineDetails.specz?.energy },
                                            { label: "Stock BHP", value: vrmResult.engineDetails.horsepower_original ? `${vrmResult.engineDetails.horsepower_original} BHP` : undefined },
                                            { label: "Tuned BHP", value: vrmResult.engineDetails.horsepower_white ? `${vrmResult.engineDetails.horsepower_white} BHP` : undefined },
                                            { label: "Stock Torque", value: vrmResult.engineDetails.torque_original ? `${vrmResult.engineDetails.torque_original} Nm` : undefined },
                                            { label: "Tuned Torque", value: vrmResult.engineDetails.torque_white ? `${vrmResult.engineDetails.torque_white} Nm` : undefined },
                                        ].filter(r => r.value).map(row => (
                                            <div key={row.label} className="flex justify-between text-xs">
                                                <span className="text-gray-500 font-medium">{row.label}</span>
                                                <span className="font-semibold text-gray-800">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
