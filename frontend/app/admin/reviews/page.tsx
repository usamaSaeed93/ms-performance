"use client";

import {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  GoogleReview,
} from "@/lib/store/api/googleReviewsApi";
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
import { Textarea } from "@/components/ui/textarea";
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
  Star,
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

const emptyForm = {
  author_name: "",
  rating: 5,
  text: "",
  profile_photo_url: "",
  relative_time: "",
  display_order: 0,
  is_active: true,
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 ${
              s <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground self-center">
        {value} star{value !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useGetAllReviewsQuery();
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoogleReview | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const openCreate = () => {
    setEditingReview(null);
    setFormData(emptyForm);
    setSelectedFile(null);
    setPreview(null);
    setIsDialogOpen(true);
  };

  const openEdit = (review: GoogleReview) => {
    setEditingReview(review);
    setFormData({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text ?? "",
      profile_photo_url: review.profile_photo_url ?? "",
      relative_time: review.relative_time ?? "",
      display_order: review.display_order,
      is_active: review.is_active,
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
    if (!selectedFile) return formData.profile_photo_url || null;
    try {
      const res = await uploadImage({ file: selectedFile, folder: "reviews" }).unwrap();
      const url = res.url;
      setFormData((prev) => ({ ...prev, profile_photo_url: url }));
      setSelectedFile(null);
      setPreview(null);
      return url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.author_name.trim()) {
      toast.error("Author name is required");
      return;
    }

    let photoUrl = formData.profile_photo_url;
    if (selectedFile) {
      const uploaded = await handleUploadImage();
      if (uploaded === null && selectedFile) return;
      photoUrl = uploaded ?? photoUrl;
    }

    const payload = {
      author_name: formData.author_name,
      rating: formData.rating,
      text: formData.text || undefined,
      profile_photo_url: photoUrl || undefined,
      relative_time: formData.relative_time || undefined,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    try {
      if (editingReview) {
        await updateReview({ id: editingReview.id, ...payload }).unwrap();
        toast.success("Review updated successfully");
      } else {
        await createReview(payload).unwrap();
        toast.success("Review created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error("Failed to save review");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReview({ id: deleteTarget.id }).unwrap();
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleteTarget(null);
    }
  };

  const displayImage = preview || formData.profile_photo_url;
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
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews displayed in the homepage Reviews section.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Review cards grid */}
      {!reviews?.length ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-muted-foreground">
          <Star className="h-10 w-10 opacity-30" />
          <p className="text-sm">No reviews yet. Add your first review.</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                !review.is_active ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {review.profile_photo_url ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                        {review.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold leading-snug truncate">
                      {review.author_name}
                    </CardTitle>
                    {review.relative_time && (
                      <CardDescription className="text-xs mt-0.5">
                        {review.relative_time}
                      </CardDescription>
                    )}
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        review.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {review.is_active ? "Active" : "Hidden"}
                    </span>
                    <span className="flex items-center gap-0.5 bg-black/10 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <GripVertical className="h-3 w-3" />
                      #{review.display_order}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {review.text && (
                <CardContent className="px-4 pb-2 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {review.text}
                  </p>
                </CardContent>
              )}

              <CardContent className="p-4 pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => openEdit(review)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeleteTarget(review)}
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
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Add New Review"}
            </DialogTitle>
            <DialogDescription>
              Enter the reviewer details, star rating, and their review text.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Profile photo upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Profile Photo (optional)</Label>
              <div className="flex items-center gap-4">
                {/* Avatar preview */}
                <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden border bg-muted">
                  {displayImage ? (
                    <Image src={displayImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                      {formData.author_name.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <label className="flex flex-1 flex-col items-center justify-center h-16 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="text-xs">
                      {selectedFile ? (
                        <span className="font-medium text-foreground">{selectedFile.name}</span>
                      ) : (
                        "Click to upload photo"
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
            </div>

            {/* Author name */}
            <div className="grid gap-1.5">
              <Label htmlFor="author_name" className="text-xs font-semibold">
                Author Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author_name"
                placeholder="e.g. John Smith"
                value={formData.author_name}
                onChange={(e) => setFormData((p) => ({ ...p, author_name: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            {/* Star rating */}
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Rating</Label>
              <StarPicker
                value={formData.rating}
                onChange={(v) => setFormData((p) => ({ ...p, rating: v }))}
              />
            </div>

            {/* Review text */}
            <div className="grid gap-1.5">
              <Label htmlFor="text" className="text-xs font-semibold">
                Review Text
              </Label>
              <Textarea
                id="text"
                placeholder="Great service, really happy with the results..."
                value={formData.text}
                onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                className="text-sm min-h-[90px] resize-none"
              />
            </div>

            {/* Relative time */}
            <div className="grid gap-1.5">
              <Label htmlFor="relative_time" className="text-xs font-semibold">
                Time Label
              </Label>
              <Input
                id="relative_time"
                placeholder="e.g. 2 months ago"
                value={formData.relative_time}
                onChange={(e) => setFormData((p) => ({ ...p, relative_time: e.target.value }))}
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
                  setFormData((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))
                }
                className="h-9 text-sm w-32"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Visible on homepage</p>
                <p className="text-xs text-muted-foreground">
                  Toggle to show or hide this review in the Reviews section.
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              {editingReview ? "Save Changes" : "Create Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>
              This will permanently remove the review by{" "}
              <span className="font-semibold">{deleteTarget?.author_name}</span>. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
