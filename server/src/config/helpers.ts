import { ZodError } from "zod";

export interface AppError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export function parseError(err: unknown): { status: number; body: AppError } {
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};

    for (const issue of err.issues) {
      const field = issue.path.join(".");
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    }

    return {
      status: 422,
      body: {
        success: false,
        message: "Validation failed",
        errors,
      },
    };
  }

  if (err instanceof Error) {
    const knownMessages: Record<string, number> = {
      "Email already in use": 409,
      "Invalid credentials": 401,
      "Failed to exchange code": 502,
      "Failed to fetch Google user": 502,
    };

    const status = knownMessages[err.message] ?? 500;

    return {
      status,
      body: {
        success: false,
        message: err.message,
      },
    };
  }

  return {
    status: 500,
    body: {
      success: false,
      message: "An unexpected error occurred",
    },
  };
}
