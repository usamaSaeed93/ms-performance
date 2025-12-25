"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetCategoriesQuery,
  useGetTaxClassesQuery,
  useGetProductQuery,
  useGetProductImagesQuery,
  useUpdateProductMutation,
  useUpdateProductImagesMutation,
  type Category,
  type Product,
  type ProductImage,
  type TaxClass,
} from "@/lib/store/api/adminApi";
import ImageGallery, { ImageGalleryItem } from "@/lib/components/ImageGallery";
import ProductVariants from "@/lib/components/ProductVariants";
import { useTheme } from "@/lib/contexts/theme-context";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { productSchema, type ProductFormData } from "@/lib/schemas/productSchema";
import { FormInput, FormTextarea, FormSelect, FormSwitch } from "@/lib/components/FormField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const { data: taxClassesData, isLoading: taxClassesLoading } = useGetTaxClassesQuery({});
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductQuery(productId, { skip: !productId });
  const { data: imagesData, isLoading: imagesLoading } = useGetProductImagesQuery(productId, { skip: !productId });
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [updateProductImages, { isLoading: isUpdatingImages }] = useUpdateProductImagesMutation();
  
  const categories = categoriesData?.categories || [];
  const taxClasses = taxClassesData?.tax_classes || [];
  const loading = isUpdatingProduct || isUpdatingImages;

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

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
      tax_class_id: null,
      tax_status: "taxable",
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
    },
    mode: "onBlur",
  });

  const { handleSubmit, watch, setValue, reset, formState: { errors } } = methods;
  const productType = watch("product_type");

  // Load product data when available
  useEffect(() => {
    if (productData) {
      reset({
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
        tax_class_id: productData.tax_class_id || null,
        tax_status: productData.tax_status || "taxable",
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
  }, [productData, reset]);

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

  const productName = watch("product_name");
  
  // Auto-generate slug from product name
  useEffect(() => {
    if (productName && !watch("slug")) {
      setValue("slug", generateSlug(productName), { shouldValidate: false });
    }
  }, [productName, setValue, watch]);

  const onSubmit = async (data: ProductFormData) => {
    // Validate images - at least one image is recommended
    if (images.length === 0) {
      toast.error("At least one product image is recommended");
      setActiveTab("images");
      return;
    }
    
    const loadingToast = toast.loading("Updating product...");
    
    try {
      const submitData: any = {
        product_id: productId,
        ...data,
        price: parseFloat(data.price) || 0,
        sale_price: data.sale_price && data.sale_price !== "" ? parseFloat(data.sale_price) : null,
        quantity: data.quantity || 0,
        weight: data.weight && data.weight !== "" ? parseFloat(data.weight) : null,
        length: data.length && data.length !== "" ? parseFloat(data.length) : null,
        width: data.width && data.width !== "" ? parseFloat(data.width) : null,
        height: data.height && data.height !== "" ? parseFloat(data.height) : null,
        stock_threshold: data.stock_threshold !== null && data.stock_threshold !== undefined ? data.stock_threshold : null,
        image_url: images.length > 0 ? images.find(img => img.is_primary)?.image_url || images[0].image_url : data.image_url || "",
        is_active: data.is_active ? 1 : 0,
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

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, (errors) => {
            // Handle validation errors - navigate to the first tab with errors
            const errorFields = Object.keys(errors);
            if (errorFields.length > 0) {
              const firstError = errorFields[0];
              if (['product_name', 'category_id', 'price', 'sale_price', 'sale_start_date', 'sale_end_date', 'product_type', 'external_url', 'slug', 'sku'].includes(firstError)) {
                setActiveTab('general');
              } else if (['quantity', 'stock_status', 'stock_threshold', 'manage_stock', 'backorders_allowed'].includes(firstError)) {
                setActiveTab('inventory');
              } else if (['weight', 'length', 'width', 'height', 'shipping_class', 'shipping_required', 'shipping_taxable'].includes(firstError)) {
                setActiveTab('shipping');
              } else if (firstError === 'images') {
                setActiveTab('images');
              }
              toast.error(`Please fix ${errorFields.length} validation error${errorFields.length > 1 ? 's' : ''} before submitting.`);
            }
          })} className="space-y-6">
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
                  <FormInput
                    name="product_name"
                    label="Product Name"
                    required
                    placeholder="Enter product name"
                  />

                  <FormInput
                    name="slug"
                    label="Product Slug"
                    placeholder="product-slug"
                  />

                  <FormTextarea
                    name="short_description"
                    label="Short Description"
                    rows={3}
                    placeholder="Brief description for product listings"
                  />

                  <FormTextarea
                    name="description"
                    label="Full Description"
                    rows={6}
                    placeholder="Full product description"
                  />

                  <FormSelect
                    name="category_id"
                    label="Category"
                    required
                    disabled={categoriesLoading}
                    placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
                    transformValue={(value) => parseInt(value)}
                  >
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
                  </FormSelect>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      name="price"
                      label="Regular Price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />

                    <FormInput
                      name="sale_price"
                      label="Sale Price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      name="sale_start_date"
                      label="Sale Start Date"
                      type="datetime-local"
                    />

                    <FormInput
                      name="sale_end_date"
                      label="Sale End Date"
                      type="datetime-local"
                    />
                  </div>

                  <FormSelect
                    name="product_type"
                    label="Product Type"
                    placeholder="Select product type"
                  >
                    <SelectItem value="simple">Simple Product</SelectItem>
                    <SelectItem value="variable">Variable Product</SelectItem>
                    <SelectItem value="grouped">Grouped Product</SelectItem>
                    <SelectItem value="external">External/Affiliate Product</SelectItem>
                  </FormSelect>

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      name="tax_status"
                      label="Tax Status"
                      placeholder="Select tax status"
                    >
                      <SelectItem value="taxable">Taxable</SelectItem>
                      <SelectItem value="shipping">Shipping Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </FormSelect>

                    <FormSelect
                      name="tax_class_id"
                      label="Tax Class"
                      placeholder="Standard Rate"
                      transformValue={(value) => value === "0" ? null : parseInt(value)}
                    >
                      <SelectItem value="0">Standard Rate (None)</SelectItem>
                      {taxClasses.map((taxClass: TaxClass) => (
                        <SelectItem key={taxClass.id} value={taxClass.id.toString()}>
                          {taxClass.name}
                        </SelectItem>
                      ))}
                    </FormSelect>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <FormSwitch
                      name="is_virtual"
                      label="Virtual Product (No shipping)"
                    />
                    <FormSwitch
                      name="is_downloadable"
                      label="Downloadable"
                    />
                    <FormSwitch
                      name="is_featured"
                      label="Featured Product"
                    />
                    <FormSwitch
                      name="is_active"
                      label="Active"
                    />
                  </div>
                </TabsContent>

                {/* Rest of tabs - Same structure as create page */}
                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-6 mt-6">
                  <FormInput
                    name="sku"
                    label="SKU"
                    placeholder="SKU code"
                  />

                  <FormSwitch
                    name="manage_stock"
                    label="Manage Stock"
                  />

                  {watch("manage_stock") && (
                    <>
                      <FormInput
                        name="quantity"
                        label="Stock Quantity"
                        type="number"
                      />

                      <FormSelect
                        name="stock_status"
                        label="Stock Status"
                        placeholder="Select stock status"
                      >
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="on_backorder">On Backorder</SelectItem>
                      </FormSelect>

                      <Controller
                        name="stock_threshold"
                        control={methods.control}
                        render={({ field, fieldState: { error } }) => (
                          <div className="space-y-2">
                            <Label htmlFor="stock_threshold">Low Stock Threshold</Label>
                            <Input
                              id="stock_threshold"
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === "" ? null : parseInt(value) || null);
                              }}
                              placeholder="Alert when stock falls below this number"
                              className={error ? "border-destructive" : ""}
                            />
                            {error && (
                              <p className="text-sm text-destructive mt-1">{error.message}</p>
                            )}
                          </div>
                        )}
                      />

                      <FormSwitch
                        name="backorders_allowed"
                        label="Allow Backorders"
                      />
                    </>
                  )}
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping" className="space-y-6 mt-6">
                  <FormSwitch
                    name="shipping_required"
                    label="Shipping Required"
                  />

                  {watch("shipping_required") && (
                    <>
                      <FormInput
                        name="weight"
                        label="Weight (kg)"
                        type="number"
                        step="0.01"
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormInput
                          name="length"
                          label="Length (cm)"
                          type="number"
                          step="0.01"
                        />
                        <FormInput
                          name="width"
                          label="Width (cm)"
                          type="number"
                          step="0.01"
                        />
                        <FormInput
                          name="height"
                          label="Height (cm)"
                          type="number"
                          step="0.01"
                        />
                      </div>

                      <FormInput
                        name="shipping_class"
                        label="Shipping Class"
                        placeholder="e.g., Standard, Express"
                      />

                      <FormSwitch
                        name="shipping_taxable"
                        label="Shipping is Taxable"
                      />
                    </>
                  )}
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="mt-6">
                  <ImageGallery
                    images={images}
                    onImagesChange={(newImages) => setImages(newImages)}
                    folder="products"
                    validationError={errors.images?.message as string | undefined}
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
                  <FormInput
                    name="meta_title"
                    label="Meta Title"
                    placeholder="SEO title"
                  />

                  <FormTextarea
                    name="meta_description"
                    label="Meta Description"
                    rows={4}
                    placeholder="SEO description"
                  />

                  <FormInput
                    name="meta_keywords"
                    label="Meta Keywords"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-6 mt-6">
                  <FormTextarea
                    name="purchase_note"
                    label="Purchase Note"
                    rows={3}
                    placeholder="Note shown to customer after purchase"
                  />

                  <FormInput
                    name="upsell_ids"
                    label="Upsell Product IDs"
                    placeholder="1, 2, 3"
                  />

                  <FormInput
                    name="cross_sell_ids"
                    label="Cross-sell Product IDs"
                    placeholder="1, 2, 3"
                  />

                  {productType === "external" && (
                    <>
                      <FormInput
                        name="external_url"
                        label="External URL"
                        type="url"
                        required
                        placeholder="https://example.com/product"
                      />

                      <FormInput
                        name="button_text"
                        label="Button Text"
                        placeholder="Buy product"
                      />
                    </>
                  )}

                  <FormSelect
                    name="status"
                    label="Product Status"
                    placeholder="Select status"
                  >
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </FormSelect>

                  <FormSwitch
                    name="enable_reviews"
                    label="Enable Reviews"
                  />
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
        </FormProvider>
      </div>
    </div>
  );
}

