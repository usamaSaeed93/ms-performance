/**
 * Product form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductFormData {
  product_name?: string;
  slug?: string;
  price?: string | number;
  sale_price?: string | number | null;
  sale_start_date?: string;
  sale_end_date?: string;
  category_id?: number;
  product_type?: string;
  external_url?: string;
  is_virtual?: boolean;
  shipping_required?: boolean;
  sku?: string;
  quantity?: number;
  stock_threshold?: number | null;
  weight?: string | number | null;
  length?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  [key: string]: any;
}

/**
 * Validate product form data
 */
export function validateProductForm(
  data: ProductFormData,
  isUpdate: boolean = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Product name validation
  if (!isUpdate || data.product_name !== undefined) {
    if (!data.product_name || data.product_name.trim().length === 0) {
      errors.push({ field: "product_name", message: "Product name is required" });
    } else if (data.product_name.trim().length < 3) {
      errors.push({
        field: "product_name",
        message: "Product name must be at least 3 characters long",
      });
    } else if (data.product_name.length > 200) {
      errors.push({
        field: "product_name",
        message: "Product name must be 200 characters or less",
      });
    }
  }

  // Category validation (required for creation)
  if (!isUpdate) {
    if (!data.category_id || data.category_id <= 0) {
      errors.push({ field: "category_id", message: "Category is required" });
    }
  }

  // Price validation
  if (!isUpdate || data.price !== undefined) {
    const price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
    if (!price || isNaN(price) || price <= 0) {
      errors.push({
        field: "price",
        message: "Price must be greater than 0",
      });
    }
  }

  // Sale price validation
  if (data.sale_price !== undefined && data.sale_price !== null && data.sale_price !== "") {
    const salePrice =
      typeof data.sale_price === "string" ? parseFloat(data.sale_price) : data.sale_price;
    const price = typeof data.price === "string" ? parseFloat(data.price as string) : data.price;

    if (isNaN(salePrice) || salePrice < 0) {
      errors.push({
        field: "sale_price",
        message: "Sale price must be 0 or greater",
      });
    } else if (price && salePrice >= price) {
      errors.push({
        field: "sale_price",
        message: "Sale price must be less than regular price",
      });
    }
  }

  // Sale dates validation
  if (data.sale_start_date && data.sale_end_date) {
    const startDate = new Date(data.sale_start_date);
    const endDate = new Date(data.sale_end_date);

    if (startDate >= endDate) {
      errors.push({
        field: "sale_end_date",
        message: "Sale end date must be after sale start date",
      });
    }
  }

  // External product validation
  if (data.product_type === "external") {
    if (!data.external_url || data.external_url.trim().length === 0) {
      errors.push({
        field: "external_url",
        message: "External URL is required for external products",
      });
    } else if (
      !data.external_url.startsWith("http://") &&
      !data.external_url.startsWith("https://")
    ) {
      errors.push({
        field: "external_url",
        message: "External URL must start with http:// or https://",
      });
    }
  }

  // Virtual product validation
  if (data.is_virtual && data.shipping_required) {
    errors.push({
      field: "shipping_required",
      message: "Virtual products should not require shipping",
    });
  }

  // Slug validation
  if (data.slug && data.slug.trim().length > 0) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errors.push({
        field: "slug",
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.",
      });
    } else if (data.slug.length > 200) {
      errors.push({ field: "slug", message: "Slug must be 200 characters or less" });
    }
  }

  // SKU validation
  if (data.sku && data.sku.trim().length > 0) {
    if (!/^[A-Za-z0-9_-]+$/.test(data.sku)) {
      errors.push({
        field: "sku",
        message: "SKU must contain only letters, numbers, hyphens, and underscores",
      });
    } else if (data.sku.length > 100) {
      errors.push({ field: "sku", message: "SKU must be 100 characters or less" });
    }
  }

  // Quantity validation
  if (data.quantity !== undefined) {
    const quantity = typeof data.quantity === "string" ? parseInt(data.quantity) : data.quantity;
    if (isNaN(quantity) || quantity < 0) {
      errors.push({
        field: "quantity",
        message: "Quantity must be 0 or greater",
      });
    }
  }

  // Stock threshold validation
  if (data.stock_threshold !== undefined && data.stock_threshold !== null && data.stock_threshold !== "") {
    const threshold =
      typeof data.stock_threshold === "string"
        ? parseInt(data.stock_threshold)
        : data.stock_threshold;
    if (!isNaN(threshold) && threshold < 0) {
      errors.push({
        field: "stock_threshold",
        message: "Stock threshold must be 0 or greater",
      });
    }
  }

  // Dimensions validation
  const dimensions = ["weight", "length", "width", "height"];
  dimensions.forEach((dim) => {
    if (data[dim] !== undefined && data[dim] !== null && data[dim] !== "") {
      const value =
        typeof data[dim] === "string" ? parseFloat(data[dim] as string) : data[dim];
      if (isNaN(value) || value <= 0) {
        errors.push({
          field: dim,
          message: `${dim.charAt(0).toUpperCase() + dim.slice(1)} must be greater than 0`,
        });
      }
    }
  });

  return errors;
}

/**
 * Validate a single field
 */
export function validateField(
  field: string,
  value: any,
  allData: ProductFormData,
  isUpdate: boolean = false
): string | null {
  const errors = validateProductForm({ ...allData, [field]: value }, isUpdate);
  const fieldError = errors.find((e) => e.field === field);
  return fieldError ? fieldError.message : null;
}

/**
 * Get all errors for a specific field
 */
export function getFieldError(
  field: string,
  errors: ValidationError[]
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

