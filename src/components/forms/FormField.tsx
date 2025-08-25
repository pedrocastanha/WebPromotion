import React from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types/common';

interface BaseFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface InputFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  mask?: string;
}

interface PasswordFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'password';
  showToggle?: boolean;
}

interface TextareaFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'textarea';
  rows?: number;
}

interface SelectFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'select';
  options: SelectOption[];
}

interface CheckboxFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'checkbox';
}

interface SwitchFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'switch';
}

interface DateFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'date';
}

type FormFieldProps<T extends FieldValues> =
  | InputFormFieldProps<T>
  | PasswordFormFieldProps<T>
  | TextareaFormFieldProps<T>
  | SelectFormFieldProps<T>
  | CheckboxFormFieldProps<T>
  | SwitchFormFieldProps<T>
  | DateFormFieldProps<T>;

export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  const { form, name, label, description, disabled, className } = props;

  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {renderFormControl(props, field)}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFormControl<T extends FieldValues>(
  props: FormFieldProps<T>,
  field: any
) {
  const { type = 'text', placeholder, disabled } = props;

  switch (type) {
    case 'password':
      return <PasswordInput {...props} field={field} />;
    
    case 'textarea':
      const textareaProps = props as TextareaFormFieldProps<T>;
      return (
        <Textarea
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          rows={textareaProps.rows || 3}
        />
      );
    
    case 'select':
      const selectProps = props as SelectFormFieldProps<T>;
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectProps.options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          {placeholder && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {placeholder}
            </label>
          )}
        </div>
      );
    
    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          {placeholder && (
            <label className="text-sm font-medium leading-none">
              {placeholder}
            </label>
          )}
        </div>
      );
    
    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !field.value && 'text-muted-foreground'
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR })
              ) : (
                <span>{placeholder || 'Selecione uma data'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    
    default:
      const inputProps = props as InputFormFieldProps<T>;
      return (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            let value = e.target.value;
            
            // Aplicar máscara se fornecida
            if (inputProps.mask) {
              value = applyMask(value, inputProps.mask);
            }
            
            field.onChange(value);
          }}
        />
      );
  }
}

function PasswordInput<T extends FieldValues>({
  field,
  placeholder,
  disabled,
  showToggle = true,
}: PasswordFormFieldProps<T> & { field: any }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          </span>
        </Button>
      )}
    </div>
  );
}

// Função para aplicar máscaras
function applyMask(value: string, mask: string): string {
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '#') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }

  return maskedValue;
}

// Máscaras comuns
export const masks = {
  cpf: '###.###.###-##',
  cnpj: '##.###.###/####-##',
  phone: '(##) #####-####',
  zipCode: '#####-###',
  date: '##/##/####',
};

