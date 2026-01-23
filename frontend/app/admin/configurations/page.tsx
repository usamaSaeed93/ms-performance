"use client";

import { useGetSettingsQuery, useUpdateSettingMutation } from "@/lib/store/api/settingsApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
    const { data: settings, isLoading } = useGetSettingsQuery();
    const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

    const [ecommerceEnabled, setEcommerceEnabled] = useState(false);

    useEffect(() => {
        if (settings) {
            const setting = settings.find(s => s.key === "ecommerce_enabled");
            if (setting) {
                setEcommerceEnabled(setting.value === "true");
            } else {
                // Default to true if not set, or false? Let's say false to be safe, or true to match current state.
                // Assuming undefined means enabled by default for now? Or disabled?
                // Let's assume enabled by default in UI until backend confirms.
                setEcommerceEnabled(true);
            }
        }
    }, [settings]);

    const handleToggle = async (checked: boolean) => {
        try {
            // Optimistic update
            setEcommerceEnabled(checked);

            await updateSetting({
                key: "ecommerce_enabled",
                value: checked ? "true" : "false",
                description: "Global toggle for e-commerce functionality",
                type: "boolean"
            }).unwrap();

            toast.success(`E-commerce ${checked ? "enabled" : "disabled"}`);
        } catch (error) {
            setEcommerceEnabled(!checked); // Revert
            toast.error("Failed to update setting");
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
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configurations for the application.
                </p>
            </div>

            <div className="grid gap-6">
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
            </div>
        </div>
    );
}
