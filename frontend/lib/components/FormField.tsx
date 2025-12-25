"use client";

import { ReactNode } from "react";
import { useFormContext, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ name, label, required, children }: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label: string;
  required?: boolean;
}

export function FormInput({ name, label, required, ...props }: FormInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormField name={name} label={label} required={required}>
      <Input
        id={name}
        {...register(name)}
        className={error ? "border-destructive" : ""}
        {...props}
      />
    </FormField>
  );
}

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  label: string;
  required?: boolean;
}

export function FormTextarea({ name, label, required, ...props }: FormTextareaProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormField name={name} label={label} required={required}>
      <Textarea
        id={name}
        {...register(name)}
        className={error ? "border-destructive" : ""}
        {...props}
      />
    </FormField>
  );
}

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
  transformValue?: (value: string) => any;
}

export function FormSelect({ name, label, required, placeholder, disabled, children, transformValue }: FormSelectProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormField name={name} label={label} required={required}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value?.toString() || ""}
            onValueChange={(value) => {
              field.onChange(transformValue ? transformValue(value) : value);
            }}
            disabled={disabled}
          >
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
}

export function FormSwitch({ name, label, description }: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Switch
            id={name}
            checked={field.value || false}
            onCheckedChange={field.onChange}
          />
          <div className="flex flex-col">
            <Label htmlFor={name} className="cursor-pointer">
              {label}
            </Label>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      )}
    />
  );
}
