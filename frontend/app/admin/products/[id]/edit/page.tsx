"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useGetCategoriesQuery,
  useGetProductQuery,
  useGetProductImagesQuery,
  useUpdateProductMutation,
  useUpdateProductImagesMutation,
  type Category,
  type Product,
  type ProductImage,
} from "@/lib/store/api/adminApi";
import ImageGallery, { ImageGalleryItem } from "@/lib/components/ImageGallery";
import ProductVariants from "@/lib/components/ProductVariants";
import { useTheme } from "@/lib/contexts/theme-context";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TabType = "general" | "inventory" | "shipping" | "images" | "variants" | "seo" | "advanced";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [images, setImages] = useState<ImageGalleryItem[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  
  // RTK Query hooks
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductQuery(productId, { skip: !productId });
  const { data: imagesData, isLoading: imagesLoading } = useGetProductImagesQuery(productId, { skip: !productId });
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [updateProductImages, { isLoading: isUpdatingImages }] = useUpdateProductImagesMutation();
  
  const categories = categoriesData?.categories || [];
  const loading = isUpdatingProduct || isUpdatingImages;
  
  const [formData, setFormData] = useState<Partial<Product>>({
    product_name: "",
    slug: "",
    short_description: "",
    description: "",
    category_id: 0,
    price: "",
    sale_price: "",
    sale_start_date: "",
    sale_end_date: "",
    product_type: "simple",
    is_virtual: false,
    is_downloadable: false,
    sku: "",
    quantity: 0,
    stock_status: "in_stock",
    manage_stock: true,
    stock_threshold: null,
    backorders_allowed: false,
    weight: "",
    length: "",
    width: "",
    height: "",
    shipping_class: "",
    shipping_required: true,
    shipping_taxable: true,
    image_url: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: "published",
    is_active: true,
    is_featured: false,
    purchase_note: "",
    enable_reviews: true,
    upsell_ids: "",
    cross_sell_ids: "",
    external_url: "",
    button_text: "Buy product",
  });

  // Load product data when available
  useEffect(() => {
    if (productData) {
      const formatDateForInput = (dateStr: string | null | undefined) => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          return localDateTime.toISOString().slice(0, 16);
        } catch {
          return "";
        }
      };

      setFormData({
        product_name: productData.product_name || "",
        slug: productData.slug || "",
        short_description: productData.short_description || "",
        description: productData.description || "",
        category_id: productData.category_id || 0,
        price: productData.price?.toString() || "",
        sale_price: productData.sale_price?.toString() || "",
        sale_start_date: formatDateForInput(productData.sale_start_date),
        sale_end_date: formatDateForInput(productData.sale_end_date),
        product_type: productData.product_type || "simple",
        is_virtual: productData.is_virtual || false,
        is_downloadable: productData.is_downloadable || false,
        sku: productData.sku || "",
        quantity: productData.quantity || 0,
        stock_status: productData.stock_status || "in_stock",
        manage_stock: productData.manage_stock !== undefined ? productData.manage_stock : true,
        stock_threshold: productData.stock_threshold || null,
        backorders_allowed: productData.backorders_allowed || false,
        weight: productData.weight?.toString() || "",
        length: productData.length?.toString() || "",
        width: productData.width?.toString() || "",
        height: productData.height?.toString() || "",
        shipping_class: productData.shipping_class || "",
        shipping_required: productData.shipping_required !== undefined ? productData.shipping_required : true,
        shipping_taxable: productData.shipping_taxable !== undefined ? productData.shipping_taxable : true,
        image_url: productData.image_url || "",
        meta_title: productData.meta_title || "",
        meta_description: productData.meta_description || "",
        meta_keywords: productData.meta_keywords || "",
        status: productData.status || "published",
        is_active: productData.is_active === 1 || productData.is_active === true,
        is_featured: productData.is_featured || false,
        purchase_note: productData.purchase_note || "",
        enable_reviews: productData.enable_reviews !== undefined ? productData.enable_reviews : true,
        upsell_ids: productData.upsell_ids || "",
        cross_sell_ids: productData.cross_sell_ids || "",
        external_url: productData.external_url || "",
        button_text: productData.button_text || "Buy product",
      });
    }
  }, [productData]);

  // Load product images when available
  useEffect(() => {
    if (imagesData?.images) {
      const formattedImages: ImageGalleryItem[] = imagesData.images.map((img: ProductImage) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || "",
        sort_order: img.sort_order || 0,
        is_primary: img.is_primary || false,
      }));
      setImages(formattedImages);
    }
  }, [imagesData]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleProductNameChange = (name: string) => {
    setFormData({
      ...formData,
      product_name: name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToast = toast.loading("Updating product...");
    
    try {
      const submitData: any = {
        product_id: productId,
        ...formData,
        price: parseFloat(formData.price as string) || 0,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price as string) : null,
        quantity: parseInt(formData.quantity as any) || 0,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        length: formData.length ? parseFloat(formData.length as string) : null,
        width: formData.width ? parseFloat(formData.width as string) : null,
        height: formData.height ? parseFloat(formData.height as string) : null,
        image_url: images.length > 0 ? images.find(img => img.is_primary)?.image_url || images[0].image_url : formData.image_url,
        is_active: formData.is_active ? 1 : 0,
      };

      console.log('[Product Update] Submitting product data:', submitData);
      await updateProduct({ productId, product: submitData }).unwrap();
      console.log('[Product Update] Product updated');

      // Update product images
      if (productId) {
        toast.loading("Updating product images...", { id: loadingToast });
        
        try {
          const imageData = images.map((img, index) => ({
            image_url: img.image_url,
            alt_text: img.alt_text || "",
            sort_order: img.sort_order ?? index,
            is_primary: img.is_primary || false,
          }));

          console.log('[Product Update] Updating product images:', imageData);
          await updateProductImages({ productId, images: imageData }).unwrap();
          console.log('[Product Update] Product images updated successfully');
        } catch (imageError: any) {
          console.error("[Product Update] Failed to update product images:", imageError);
          toast.error(
            `Product updated but failed to update images: ${imageError?.data?.message || imageError?.message || "Unknown error"}`,
            { id: loadingToast }
          );
        }
      }

      toast.success("Product updated successfully!", { id: loadingToast });
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (error: any) {
      console.error("[Product Update] Failed to update product:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to update product. Please try again.",
        { id: loadingToast }
      );
    }
  };

  if (productLoading || imagesLoading) {
    return (
      <div className="p-4 lg:p-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="p-4 lg:p-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load product. Please try again.</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 relative">
      <div className="max-w-6xl mx-auto relative">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back to Products
          </Button>
          <h2 className="text-2xl lg:text-3xl font-black mb-2">
            Edit Product
          </h2>
          <p className="text-muted-foreground">
            Update product details with full WooCommerce-like features
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Configure your product settings across different sections
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-visible">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="general">📝 General</TabsTrigger>
                  <TabsTrigger value="inventory">📦 Inventory</TabsTrigger>
                  <TabsTrigger value="shipping">🚚 Shipping</TabsTrigger>
                  <TabsTrigger value="images">🖼️ Images</TabsTrigger>
                  <TabsTrigger value="variants">🎨 Variants</TabsTrigger>
                  <TabsTrigger value="seo">🔍 SEO</TabsTrigger>
                  <TabsTrigger value="advanced">⚙️ Advanced</TabsTrigger>
                </TabsList>

                {/* General Tab - Same as create page */}
                <TabsContent value="general" className="space-y-6 mt-6 overflow-visible">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => handleProductNameChange(e.target.value)}
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Product Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="product-slug"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={3}
                      placeholder="Brief description for product listings"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      placeholder="Full product description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category_id?.toString() || "0"}
                      onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
                      required
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                      </SelectTrigger>
                      <SelectContent className="z-[9999] bg-white dark:bg-popover shadow-2xl border-2">
                        <SelectItem value="0">Select a category</SelectItem>
                        {categories.length === 0 && !categoriesLoading ? (
                          <SelectItem value="0" disabled>No categories available</SelectItem>
                        ) : (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.category_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {categoriesLoading && (
                      <p className="text-xs text-muted-foreground">Loading categories...</p>
                    )}
                    {categoriesError && (
                      <p className="text-xs text-destructive">
                        Error loading categories: {(categoriesError as any)?.data?.message || (categoriesError as any)?.message || 'Unknown error'}
                      </p>
                    )}
                    {!categoriesLoading && !categoriesError && categories.length === 0 && (
                      <p className="text-xs text-muted-foreground">No categories found. Please create a category first.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sale_price">Sale Price</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sale_start_date">Sale Start Date</Label>
                      <Input
                        id="sale_start_date"
                        type="datetime-local"
                        value={formData.sale_start_date}
                        onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sale_end_date">Sale End Date</Label>
                      <Input
                        id="sale_end_date"
                        type="datetime-local"
                        value={formData.sale_end_date}
                        onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product_type">Product Type</Label>
                    <Select
                      value={formData.product_type}
                      onValueChange={(value) => setFormData({ ...formData, product_type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple Product</SelectItem>
                        <SelectItem value="variable">Variable Product</SelectItem>
                        <SelectItem value="grouped">Grouped Product</SelectItem>
                        <SelectItem value="external">External/Affiliate Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_virtual"
                        checked={formData.is_virtual}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_virtual: checked })}
                      />
                      <Label htmlFor="is_virtual">Virtual Product (No shipping)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_downloadable"
                        checked={formData.is_downloadable}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_downloadable: checked })}
                      />
                      <Label htmlFor="is_downloadable">Downloadable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                </TabsContent>

                {/* Rest of tabs - Same structure as create page */}
                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="SKU code"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="manage_stock"
                      checked={formData.manage_stock}
                      onCheckedChange={(checked) => setFormData({ ...formData, manage_stock: checked })}
                    />
                    <Label htmlFor="manage_stock">Manage Stock</Label>
                  </div>

                  {formData.manage_stock && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock_status">Stock Status</Label>
                        <Select
                          value={formData.stock_status}
                          onValueChange={(value) => setFormData({ ...formData, stock_status: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            <SelectItem value="on_backorder">On Backorder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock_threshold">Low Stock Threshold</Label>
                        <Input
                          id="stock_threshold"
                          type="number"
                          value={formData.stock_threshold || ""}
                          onChange={(e) => setFormData({ ...formData, stock_threshold: parseInt(e.target.value) || null })}
                          placeholder="Alert when stock falls below this number"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="backorders_allowed"
                          checked={formData.backorders_allowed}
                          onCheckedChange={(checked) => setFormData({ ...formData, backorders_allowed: checked })}
                        />
                        <Label htmlFor="backorders_allowed">Allow Backorders</Label>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping" className="space-y-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shipping_required"
                      checked={formData.shipping_required}
                      onCheckedChange={(checked) => setFormData({ ...formData, shipping_required: checked })}
                    />
                    <Label htmlFor="shipping_required">Shipping Required</Label>
                  </div>

                  {formData.shipping_required && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="length">Length (cm)</Label>
                          <Input
                            id="length"
                            type="number"
                            step="0.01"
                            value={formData.length}
                            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (cm)</Label>
                          <Input
                            id="width"
                            type="number"
                            step="0.01"
                            value={formData.width}
                            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            step="0.01"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shipping_class">Shipping Class</Label>
                        <Input
                          id="shipping_class"
                          value={formData.shipping_class}
                          onChange={(e) => setFormData({ ...formData, shipping_class: e.target.value })}
                          placeholder="e.g., Standard, Express"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="shipping_taxable"
                          checked={formData.shipping_taxable}
                          onCheckedChange={(checked) => setFormData({ ...formData, shipping_taxable: checked })}
                        />
                        <Label htmlFor="shipping_taxable">Shipping is Taxable</Label>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="mt-6">
                  <ImageGallery
                    images={images}
                    onImagesChange={(newImages) => setImages(newImages)}
                    folder="products"
                  />
                </TabsContent>

                {/* Variants Tab */}
                <TabsContent value="variants" className="mt-6">
                  <ProductVariants
                    variants={variants}
                    onVariantsChange={setVariants}
                  />
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6 mt-6">
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
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      rows={4}
                      placeholder="SEO description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <Input
                      id="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="purchase_note">Purchase Note</Label>
                    <Textarea
                      id="purchase_note"
                      value={formData.purchase_note}
                      onChange={(e) => setFormData({ ...formData, purchase_note: e.target.value })}
                      rows={3}
                      placeholder="Note shown to customer after purchase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upsell_ids">Upsell Product IDs</Label>
                    <Input
                      id="upsell_ids"
                      value={formData.upsell_ids}
                      onChange={(e) => setFormData({ ...formData, upsell_ids: e.target.value })}
                      placeholder="1, 2, 3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cross_sell_ids">Cross-sell Product IDs</Label>
                    <Input
                      id="cross_sell_ids"
                      value={formData.cross_sell_ids}
                      onChange={(e) => setFormData({ ...formData, cross_sell_ids: e.target.value })}
                      placeholder="1, 2, 3"
                    />
                  </div>

                  {formData.product_type === "external" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="external_url">External URL</Label>
                        <Input
                          id="external_url"
                          type="url"
                          value={formData.external_url}
                          onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                          placeholder="https://example.com/product"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="button_text">Button Text</Label>
                        <Input
                          id="button_text"
                          value={formData.button_text}
                          onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                          placeholder="Buy product"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="status">Product Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable_reviews"
                      checked={formData.enable_reviews}
                      onCheckedChange={(checked) => setFormData({ ...formData, enable_reviews: checked })}
                    />
                    <Label htmlFor="enable_reviews">Enable Reviews</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

