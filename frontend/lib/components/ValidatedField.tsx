"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ValidatedFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function ValidatedField({ label, error, required, children, htmlFor }: ValidatedFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function ValidatedInput({
  label,
  error,
  required,
  id,
  value,
  onChange,
  onBlur,
  ...props
}: ValidatedInputProps) {
  return (
    <ValidatedField label={label} error={error} required={required} htmlFor={id}>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "border-destructive" : ""}
        {...props}
      />
    </ValidatedField>
  );
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function ValidatedTextarea({
  label,
  error,
  required,
  id,
  value,
  onChange,
  onBlur,
  ...props
}: ValidatedTextareaProps) {
  return (
    <ValidatedField label={label} error={error} required={required} htmlFor={id}>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "border-destructive" : ""}
        {...props}
      />
    </ValidatedField>
  );
}

interface ValidatedSelectProps {
  label: string;
  error?: string;
  required?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  children: ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export function ValidatedSelect({
  label,
  error,
  required,
  value,
  onValueChange,
  onBlur,
  children,
  placeholder,
  disabled,
}: ValidatedSelectProps) {
  return (
    <ValidatedField label={label} error={error} required={required}>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        onOpenChange={(open) => {
          if (!open && onBlur) {
            onBlur();
          }
        }}
      >
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </ValidatedField>
  );
}











