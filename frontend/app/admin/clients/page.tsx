"use client";

import {
  useGetAllClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  Client,
} from "@/lib/store/api/clientsApi";
import { useUploadImageMutation } from "@/lib/store/api/adminApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Upload,
  ImageIcon,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const emptyForm = {
  name: "",
  details: "",
  image_url: "",
  display_order: 0,
  is_active: true,
};

export default function ClientsPage() {
  const { data: clients, isLoading } = useGetAllClientsQuery();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const openCreate = () => {
    setEditingClient(null);
    setFormData(emptyForm);
    setSelectedFile(null);
    setPreview(null);
    setIsDialogOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      details: client.details ?? "",
      image_url: client.image_url ?? "",
      display_order: client.display_order,
      is_active: client.is_active,
    });
    setSelectedFile(null);
    setPreview(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return formData.image_url || null;
    try {
      const res = await uploadImage({ file: selectedFile, folder: "clients" }).unwrap();
      const url = res.url;
      setFormData((prev) => ({ ...prev, image_url: url }));
      setSelectedFile(null);
      setPreview(null);
      return url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    let imageUrl = formData.image_url;

    if (selectedFile) {
      const uploaded = await handleUploadImage();
      if (uploaded === null && selectedFile) return; // upload failed
      imageUrl = uploaded ?? imageUrl;
    }

    const payload = {
      name: formData.name,
      details: formData.details || undefined,
      image_url: imageUrl || undefined,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, ...payload }).unwrap();
        toast.success("Client updated successfully");
      } else {
        await createClient(payload).unwrap();
        toast.success("Client created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error("Failed to save client");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClient({ client_id: deleteTarget.id }).unwrap();
      toast.success("Client deleted");
    } catch {
      toast.error("Failed to delete client");
    } finally {
      setDeleteTarget(null);
    }
  };

  const displayImage = preview || formData.image_url;
  const isSaving = isCreating || isUpdating || isUploading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Clients</h1>
          <p className="text-muted-foreground">
            Manage the client showcase entries displayed in the homepage carousel.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Client cards grid */}
      {!clients?.length ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-muted-foreground">
          <ImageIcon className="h-10 w-10 opacity-30" />
          <p className="text-sm">No clients yet. Add your first client card.</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <Card
              key={client.id}
              className={`overflow-hidden group hover:shadow-lg transition-shadow ${
                !client.is_active ? "opacity-60" : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-video w-full bg-muted">
                {client.image_url ? (
                  <Image
                    src={client.image_url}
                    alt={client.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-30" />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      client.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {client.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                {/* Order badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <GripVertical className="h-3 w-3" />
                  #{client.display_order}
                </div>
              </div>

              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-sm leading-snug line-clamp-2">
                  {client.name}
                </CardTitle>
                {client.details && (
                  <CardDescription className="text-xs line-clamp-1">
                    {client.details}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-4 pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => openEdit(client)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeleteTarget(client)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
            <DialogDescription>
              Fill in the client details and upload a photo. This will appear in
              the homepage carousel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Client Photo</Label>

              {/* Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground opacity-30" />
                  </div>
                )}
                {selectedFile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full">
                      Ready to upload
                    </span>
                  </div>
                )}
              </div>

              {/* File input */}
              <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <span className="text-xs">
                    {selectedFile ? (
                      <span className="font-medium text-foreground">
                        {selectedFile.name}
                      </span>
                    ) : (
                      "Click to select an image"
                    )}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. BMW 140i B58 Chip Tuning"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>

            {/* Details */}
            <div className="grid gap-1.5">
              <Label htmlFor="details" className="text-xs font-semibold">
                Details
              </Label>
              <Input
                id="details"
                placeholder="e.g. 444 bhp | ECU & TCU remap | Chiptuning"
                value={formData.details}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, details: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>

            {/* Display order */}
            <div className="grid gap-1.5">
              <Label htmlFor="order" className="text-xs font-semibold">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={formData.display_order}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    display_order: parseInt(e.target.value) || 0,
                  }))
                }
                className="h-9 text-sm w-32"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Visible on homepage</p>
                <p className="text-xs text-muted-foreground">
                  Toggle to show or hide this client in the carousel.
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, is_active: v }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              {editingClient ? "Save Changes" : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold">{deleteTarget?.name}</span> from
              the carousel. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
