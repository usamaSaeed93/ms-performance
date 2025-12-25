import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(3, "Product name must be at least 3 characters").max(200, "Product name must be 200 characters or less"),
  slug: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val) && val.length <= 200;
  }, "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen."),
  short_description: z.string().optional(),
  description: z.string().optional(),
  category_id: z.number().min(1, "Category is required"),
  price: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Price must be greater than 0"),
  sale_price: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Sale price must be 0 or greater"),
  sale_start_date: z.string().optional(),
  sale_end_date: z.string().optional(),
  product_type: z.enum(["simple", "variable", "grouped", "external"]),
  is_virtual: z.boolean().optional(),
  is_downloadable: z.boolean().optional(),
  sku: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return /^[A-Za-z0-9_-]+$/.test(val) && val.length <= 100;
  }, "SKU must contain only letters, numbers, hyphens, and underscores"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater").optional(),
  stock_status: z.enum(["in_stock", "out_of_stock", "on_backorder"]).optional(),
  manage_stock: z.boolean().optional(),
  stock_threshold: z.union([z.coerce.number().min(0, "Stock threshold must be 0 or greater"), z.null()]).optional(),
  backorders_allowed: z.boolean().optional(),
  weight: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Weight must be greater than 0"),
  length: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Length must be greater than 0"),
  width: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Width must be greater than 0"),
  height: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Height must be greater than 0"),
  shipping_class: z.string().optional(),
  shipping_required: z.boolean().optional(),
  shipping_taxable: z.boolean().optional(),
  tax_class_id: z.number().nullable().optional(),
  tax_status: z.enum(["taxable", "shipping", "none"]).optional(),
  image_url: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  purchase_note: z.string().optional(),
  enable_reviews: z.boolean().optional(),
  upsell_ids: z.string().optional(),
  cross_sell_ids: z.string().optional(),
  external_url: z.string().optional(),
  button_text: z.string().optional(),
}).refine((data) => {
  // Sale price must be less than regular price
  if (data.sale_price && data.sale_price !== "") {
    const salePrice = parseFloat(data.sale_price);
    const price = parseFloat(data.price);
    return salePrice < price;
  }
  return true;
}, {
  message: "Sale price must be less than regular price",
  path: ["sale_price"],
}).refine((data) => {
  // Sale end date must be after start date
  if (data.sale_start_date && data.sale_end_date) {
    const startDate = new Date(data.sale_start_date);
    const endDate = new Date(data.sale_end_date);
    return endDate > startDate;
  }
  return true;
}, {
  message: "Sale end date must be after sale start date",
  path: ["sale_end_date"],
}).refine((data) => {
  // External products must have external_url
  if (data.product_type === "external") {
    return data.external_url && data.external_url.trim().length > 0;
  }
  return true;
}, {
  message: "External URL is required for external products",
  path: ["external_url"],
}).refine((data) => {
  // External URL must be valid
  if (data.external_url && data.external_url.trim().length > 0) {
    return data.external_url.startsWith("http://") || data.external_url.startsWith("https://");
  }
  return true;
}, {
  message: "External URL must start with http:// or https://",
  path: ["external_url"],
}).refine((data) => {
  // Virtual products should not require shipping
  if (data.is_virtual && data.shipping_required) {
    return false;
  }
  return true;
}, {
  message: "Virtual products should not require shipping",
  path: ["shipping_required"],
});

export type ProductFormData = z.infer<typeof productSchema>;

