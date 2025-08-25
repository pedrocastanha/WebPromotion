import { z } from 'zod';

// Schema para validação de email
const emailSchema = z.string()
  .email('Email inválido')
  .min(1, 'Email é obrigatório')
  .max(255, 'Email deve ter no máximo 255 caracteres');

// Schema para validação de senha
const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha deve ter no máximo 128 caracteres')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial');

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
});

// Schema para registro
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: emailSchema,
  
  password: passwordSchema,
  
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para recuperação de senha
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

// Schema para redefinição de senha
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para alteração de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Nova senha deve ser diferente da senha atual',
  path: ['newPassword']
});

// Schema para atualização de perfil
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .optional(),
  
  email: emailSchema.optional(),
  
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, 'Formato de telefone inválido')
    .optional(),
  
  avatar: z.string().url('URL do avatar inválida').optional(),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().min(2).max(5).optional(),
    notifications: z.boolean().optional()
  }).optional()
});

// Schema para validação de token
export const tokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  refreshToken: z.string().optional()
});

// Schema para verificação de email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token de verificação é obrigatório')
});

// Schema para reenvio de verificação de email
export const resendVerificationSchema = z.object({
  email: emailSchema
});

// Tipos derivados dos schemas
export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type TokenDTO = z.infer<typeof tokenSchema>;
export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationDTO = z.infer<typeof resendVerificationSchema>;

// Função para validar força da senha
export const validatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Comprimento
  if (password.length >= 8) score += 1;
  else feedback.push('Use pelo menos 8 caracteres');

  if (password.length >= 12) score += 1;
  else feedback.push('Use pelo menos 12 caracteres para maior segurança');

  // Letras minúsculas
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Inclua letras minúsculas');

  // Letras maiúsculas
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Inclua letras maiúsculas');

  // Números
  if (/\d/.test(password)) score += 1;
  else feedback.push('Inclua números');

  // Caracteres especiais
  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Inclua caracteres especiais (@$!%*?&)');

  // Padrões comuns
  if (!/(.)\1{2,}/.test(password)) score += 1;
  else feedback.push('Evite repetir o mesmo caractere');

  return { score, feedback };
};

// Schema com validação de força de senha
export const strongPasswordSchema = passwordSchema.refine((password) => {
  const { score } = validatePasswordStrength(password);
  return score >= 4;
}, {
  message: 'Senha muito fraca. Siga as recomendações de segurança.'
});

