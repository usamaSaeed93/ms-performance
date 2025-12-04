/**
 * Reusable form field component with validation error display
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({ label, error, required, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "_")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
    </div>
  );
}

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
}

export function ValidatedInput({ error, label, required, className, ...props }: ValidatedInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        className={error ? `${className || ''} border-destructive focus-visible:ring-destructive` : className}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  required?: boolean;
}

export function ValidatedTextarea({ error, label, required, className, ...props }: ValidatedTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        className={error ? `${className || ''} border-destructive focus-visible:ring-destructive` : className}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

