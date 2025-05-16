import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Por favor ingresa un email válido")
  .min(1, "El email es requerido");

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
  );

export const nameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede tener más de 50 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ\s]{2,}$/, "El nombre solo puede contener letras y espacios");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Por favor ingresa un número de teléfono válido");

export const urlSchema = z
  .string()
  .url("Por favor ingresa una URL válida")
  .startsWith("https", "La URL debe comenzar con https");

export const fileSchema = z.object({
  size: z.number().max(5242880, "El archivo no puede ser mayor a 5MB"),
  type: z.string().refine(
    (val) => ["image/jpeg", "image/png", "image/webp"].includes(val),
    "Solo se permiten archivos JPEG, PNG y WebP"
  )
});

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/\b(alert|confirm|prompt|console)\b/gi, '')
    .trim();
};

export const validateFormData = <T extends Record<string, unknown>>(
  data: T,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}; 