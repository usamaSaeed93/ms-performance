# Product Module Validation Documentation

This document outlines the comprehensive validation rules implemented for the product module on both backend and frontend.

## Backend Validation

### Schema-Level Validation (`backend/crud/schemas/product.py`)

#### ProductBase Schema (Used for Product Creation)

**Required Fields:**
- `product_name`: 3-200 characters
- `price`: Must be greater than 0, 2 decimal places
- `category_id`: Required (enforced in ProductCreate)

**Optional Fields with Validation:**
- `slug`: Max 200 chars, must match pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- `sale_price`: Must be >= 0, must be less than regular price
- `sale_start_date` / `sale_end_date`: If both provided, end date must be after start date
- `sku`: Max 100 chars, pattern `^[A-Za-z0-9_-]+$`
- `quantity`: Must be >= 0
- `stock_threshold`: Must be >= 0 if provided
- `weight`, `length`, `width`, `height`: Must be > 0 if provided
- `product_type`: Must be one of: `simple`, `variable`, `grouped`, `external`
- `stock_status`: Must be one of: `in_stock`, `out_of_stock`, `on_backorder`
- `status`: Must be one of: `draft`, `published`, `archived`

**Business Logic Validators:**

1. **Sale Price Validation:**
   - Sale price must be less than regular price
   - Sale price must be >= 0

2. **Sale Date Validation:**
   - If both dates provided, end date must be after start date

3. **External Product Validation:**
   - External products must have `external_url`
   - External URL must start with `http://` or `https://`

4. **Virtual Product Validation:**
   - Virtual products should not require shipping (`shipping_required` should be false)

5. **Slug Validation:**
   - Only lowercase letters, numbers, and hyphens
   - Cannot start or end with hyphen

6. **SKU Validation:**
   - Only letters, numbers, hyphens, and underscores
   - Cannot be empty if provided

7. **Dimensions Validation:**
   - Weight, length, width, height must be > 0 if provided

8. **Stock Threshold Validation:**
   - Must be >= 0 if provided
   - Only relevant if `manage_stock` is true

#### ProductCreate Schema

Additional validation:
- `category_id`: **Required** (must be > 0)

#### ProductUpdate Schema

- All fields are optional
- Same validation rules apply when fields are provided
- Uses `model_dump(exclude_unset=True)` to only validate provided fields

### Error Messages

All validation errors are returned with clear messages:
- Field-level errors from Pydantic
- Business logic errors from model validators
- Errors are combined and returned as a single error message

## Frontend Validation

### Validation Utility (`frontend/lib/utils/productValidation.ts`)

**Functions:**
- `validateProductForm(data, isUpdate)`: Validates entire form, returns array of ValidationError
- `validateField(field, value, allData, isUpdate)`: Validates single field
- `getFieldError(field, errors)`: Gets error message for a specific field

**Validation Rules (Matches Backend):**

1. **Product Name:**
   - Required (except on update if not changed)
   - 3-200 characters

2. **Category:**
   - Required for creation
   - Must be > 0

3. **Price:**
   - Required (except on update if not changed)
   - Must be > 0
   - Must be a valid number

4. **Sale Price:**
   - Optional
   - Must be >= 0
   - Must be < regular price

5. **Sale Dates:**
   - If both provided, end date must be after start date

6. **External Products:**
   - External URL required if product_type is "external"
   - Must start with http:// or https://

7. **Virtual Products:**
   - Should not require shipping

8. **Slug:**
   - Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
   - Max 200 characters

9. **SKU:**
   - Pattern: `^[A-Za-z0-9_-]+$`
   - Max 100 characters

10. **Quantity:**
    - Must be >= 0

11. **Stock Threshold:**
    - Must be >= 0 if provided

12. **Dimensions:**
    - Weight, length, width, height must be > 0 if provided

### Form Components

**Reusable Components (`frontend/lib/components/FormField.tsx`):**
- `FormField`: Wrapper component with label and error display
- `ValidatedInput`: Input with built-in validation styling
- `ValidatedTextarea`: Textarea with built-in validation styling

**Features:**
- Shows required field indicator (*)
- Displays validation errors below fields
- Error styling (red border, red text)
- Supports hint text

### Form Validation Flow

**Create Product Page (`frontend/app/admin/products/new/page.tsx`):**

1. **State Management:**
   - `validationErrors`: Array of ValidationError objects
   - `touchedFields`: Set of field names that have been interacted with

2. **Validation Triggers:**
   - On form submit: Validates all fields
   - On field blur: Validates individual field (recommended to add)
   - Real-time validation on change (recommended to add)

3. **Error Display:**
   - Errors shown below form fields
   - Red border on invalid fields
   - Error count in toast notification
   - Auto-navigates to tab with first error

4. **Submit Prevention:**
   - Form submission blocked if validation errors exist
   - Shows toast with error count

### Implementation Status

✅ **Completed:**
- Backend schema validation with business logic
- Validation utility functions
- Form validation state management
- Submit-time validation
- Basic error display structure

⚠️ **Recommended Next Steps:**
1. Add real-time field validation on blur/change
2. Integrate ValidatedInput/ValidatedTextarea components into form fields
3. Add validation to Edit Product page (same pattern)
4. Add field-level validation feedback as user types

## Usage Examples

### Backend

Validation is automatic via Pydantic schemas. Errors are returned as HTTP 422 responses with detailed error messages.

### Frontend

```typescript
import { validateProductForm, getFieldError } from "@/lib/utils/productValidation";

// Validate entire form
const errors = validateProductForm(formData, false);
if (errors.length > 0) {
  // Handle errors
}

// Get error for specific field
const productNameError = getFieldError("product_name", errors);

// Use in component
<Input
  className={productNameError ? "border-destructive" : ""}
  {...props}
/>
{productNameError && (
  <p className="text-xs text-destructive">{productNameError}</p>
)}
```

## Testing Validation

### Backend Tests

Test cases should cover:
1. Required field validation
2. Pattern matching (slug, SKU)
3. Range validation (price > 0, dimensions > 0)
4. Business logic (sale price < price, dates)
5. Cross-field validation (virtual + shipping, external + URL)

### Frontend Tests

Test cases should cover:
1. Form validation on submit
2. Field-level validation
3. Error message display
4. Error clearing on correction
5. Tab navigation to errors

## Notes

- All validation rules are consistent between backend and frontend
- Backend validation is the source of truth
- Frontend validation provides immediate feedback
- Backend will always re-validate regardless of frontend validation
- Error messages are user-friendly and actionable

