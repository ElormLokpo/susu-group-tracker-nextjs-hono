import { z } from "zod";
import { toPesewas } from "../utils/money";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z.email("Invalid email address"),
  code: z.string().min(1, "Code is required"),
});

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  email: z.email("Invalid email address"),
});


export const positiveMoney = z.union([z.string(), z.number()]).transform((value, ctx) => {
  try {
    const pesewas = toPesewas(value);
    if (pesewas <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Amount must be greater than zero" });
      return z.NEVER;
    }
    return pesewas;
  } catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
    return z.NEVER;
  }
});

export const uuidSchema = z.string().uuid();


export const createGroupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  weeklyAmount: positiveMoney,
});

export const addMemberSchema = z.object({
  userId: uuidSchema,
});


export const recordContributionSchema = z.object({
  userId: uuidSchema,
  amount: positiveMoney,
  
  week: z.number().int().positive().optional(),
});

export const listTransactionsQuery = z.object({
  type: z.enum(["contribution", "payout"]).optional(),
  week: z.coerce.number().int().positive().optional(),
  userId: uuidSchema.optional(),
});



export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

