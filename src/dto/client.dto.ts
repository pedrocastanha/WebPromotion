import { z } from 'zod';

// Schema para validação de CPF
const cpfSchema = z.string()
  .min(11, 'CPF deve ter 11 dígitos')
  .max(14, 'CPF inválido')
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'Formato de CPF inválido');

// Schema para validação de telefone
const phoneSchema = z.string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, 'Formato de telefone inválido');

// Schema para validação de CEP
const zipCodeSchema = z.string()
  .min(8, 'CEP deve ter 8 dígitos')
  .max(9, 'CEP inválido')
  .regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido');

// Schema para validação de email
const emailSchema = z.string()
  .email('Email inválido')
  .min(1, 'Email é obrigatório');

// Schema para criação de cliente
export const createClientSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  cpf: cpfSchema,
  
  birthDate: z.string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Data de nascimento inválida'),
  
  address: z.string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Cidade deve conter apenas letras e espaços'),
  
  state: z.string()
    .min(2, 'Estado deve ter pelo menos 2 caracteres')
    .max(2, 'Estado deve ter exatamente 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'Estado deve ser uma sigla válida (ex: SP, RJ)'),
  
  zipCode: zipCodeSchema,
  
  active: z.boolean().optional().default(true)
});

// Schema para atualização de cliente
export const updateClientSchema = createClientSchema.partial().extend({
  id: z.number().positive('ID deve ser um número positivo')
});

// Schema para filtros de busca
export const clientFiltersSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
}).refine((data) => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'Data inicial deve ser anterior à data final',
  path: ['dateFrom']
});

// Schema para parâmetros de paginação
export const paginationSchema = z.object({
  page: z.number().min(1, 'Página deve ser maior que 0').default(1),
  limit: z.number().min(1, 'Limite deve ser maior que 0').max(100, 'Limite máximo é 100').default(10),
  sortBy: z.enum(['id', 'name', 'email', 'city', 'state', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Schema para importação CSV
export const importClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: emailSchema,
  phone: phoneSchema,
  cpf: cpfSchema,
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: zipCodeSchema,
  active: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      return val.toLowerCase() === 'true' || val === '1' || val.toLowerCase() === 'sim';
    }
    return val;
  }).optional().default(true)
});

// Tipos derivados dos schemas
export type CreateClientDTO = z.infer<typeof createClientSchema>;
export type UpdateClientDTO = z.infer<typeof updateClientSchema>;
export type ClientFiltersDTO = z.infer<typeof clientFiltersSchema>;
export type PaginationDTO = z.infer<typeof paginationSchema>;
export type ImportClientDTO = z.infer<typeof importClientSchema>;

// Função para validar CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Schema de validação de CPF customizado
export const cpfValidationSchema = z.string().refine(validateCPF, {
  message: 'CPF inválido'
});

