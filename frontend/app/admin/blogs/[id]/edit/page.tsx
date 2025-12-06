"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "@/lib/store/api/blogsApi";
import ImageUpload from "@/lib/components/ImageUpload";
import RichTextEditor from "@/lib/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = parseInt(params.id as string);

  const { data: blog, isLoading: isLoadingBlog, error } = useGetBlogQuery({ blog_id: blogId });
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author_name: "",
    status: "draft" as "draft" | "published" | "archived",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        featured_image: blog.featured_image || "",
        author_name: blog.author_name || "",
        status: (blog.status as "draft" | "published" | "archived") || "draft",
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
        meta_keywords: blog.meta_keywords || "",
      });
    }
  }, [blog]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, featured_image: url });
    toast.success("Image uploaded successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      const blogData: any = {
        blog_id: blogId,
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      if (formData.status === "published" && blog?.status !== "published") {
        blogData.published_at = new Date().toISOString();
      }

      await updateBlog(blogData).unwrap();
      toast.success("Blog post updated successfully");
    } catch (error: any) {
      console.error("Failed to update blog:", error);
      toast.error(error?.data?.message || "Failed to update blog post");
    }
  };

  if (isLoadingBlog) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-8">Loading blog post...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-8 text-destructive">
          Failed to load blog post. Please try again.
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black mb-2">Edit Blog Post</h2>
          <p className="text-muted-foreground">Edit blog post information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>Edit the blog post information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog-post-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version of the title. Auto-generated if left empty.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="Brief description of the blog post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Start writing your blog post... You can add images, format text, and more!"
              />
              <p className="text-xs text-muted-foreground">
                Use the toolbar to format your content. Images can be inserted directly into the content.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              {formData.featured_image ? (
                <div className="space-y-2">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full max-w-md h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, featured_image: "" })}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <ImageUpload
                  folder="blogs"
                  onUploadComplete={handleImageUpload}
                  multiple={false}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Optimize your blog post for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                rows={3}
                placeholder="SEO description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={formData.meta_keywords}
                onChange={(e) =>
                  setFormData({ ...formData, meta_keywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Blog Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

