import { z } from "zod";

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

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),

  summary: z.string().min(1),

  body: z.string().min(1),

  category: z.string().min(1).max(100),

  coverPhoto: z.string().url().optional().nullable(),

  published: z.boolean().default(false),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1).max(5000),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1).max(5000),
});

export const updatePostSchema = createPostSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type PostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
