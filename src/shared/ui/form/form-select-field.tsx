import { FormField } from './form-field'
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface SelectOption {
  value: string
  label: string | number
}

export interface FormSelectFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  options: Array<SelectOption>
  required?: boolean
  disabled?: boolean
  register: UseFormRegister<TFieldValues>
  error?: FieldError
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  tooltip?: ReactNode
  className?: string
  selectClassName?: string
}

export function FormSelectField<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  required = false,
  disabled = false,
  register,
  error,
  onChange,
  tooltip,
  className,
  selectClassName,
}: FormSelectFieldProps<TFieldValues>) {
  // ponytail: standard HTML select dropdown styled to match Tailwind and custom design tokens
  return (
    <FormField
      label={label}
      htmlFor={name}
      required={required}
      error={error?.message}
      tooltip={tooltip}
      className={className}
    >
      <select
        id={name}
        disabled={disabled}
        className={cn(
          "w-full cursor-pointer rounded-lg bg-kumo-base px-3 py-2 text-sm text-kumo-default ring-1 ring-kumo-line outline-none transition focus-visible:ring-2 focus-visible:ring-kumo-focus/50 disabled:opacity-50",
          selectClassName
        )}
        {...register(name, { onChange })}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
