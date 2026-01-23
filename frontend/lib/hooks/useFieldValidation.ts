import { useState, useCallback } from "react";
import { validateField, type ProductFormData, type ValidationError } from "@/lib/utils/productValidation";

interface UseFieldValidationOptions {
  formData: ProductFormData;
  isUpdate?: boolean;
  initialErrors?: ValidationError[];
}

export function useFieldValidation({ formData, isUpdate = false, initialErrors = [] }: UseFieldValidationOptions) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(initialErrors);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateFieldValue = useCallback(
    (field: string, value: any): string | null => {
      return validateField(field, value, formData, isUpdate);
    },
    [formData, isUpdate]
  );

  const markFieldAsTouched = useCallback((field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  }, []);

  const validateAndSetError = useCallback(
    (field: string, value: any) => {
      const error = validateFieldValue(field, value);
      setValidationErrors((prev) => {
        const filtered = prev.filter((e) => e.field !== field);
        if (error) {
          return [...filtered, { field, message: error }];
        }
        return filtered;
      });
      return error;
    },
    [validateFieldValue]
  );

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      if (!touchedFields.has(field)) return undefined;
      return validationErrors.find((e) => e.field === field)?.message;
    },
    [validationErrors, touchedFields]
  );

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors([]);
    setTouchedFields(new Set());
  }, []);

  const setAllErrors = useCallback((errors: ValidationError[]) => {
    setValidationErrors(errors);
    setTouchedFields(new Set(Object.keys(formData)));
  }, [formData]);

  return {
    validationErrors,
    touchedFields,
    validateFieldValue,
    markFieldAsTouched,
    validateAndSetError,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    setAllErrors,
  };
}











