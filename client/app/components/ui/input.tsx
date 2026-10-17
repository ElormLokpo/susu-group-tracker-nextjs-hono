import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";
import React from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

const inputVariants = cva(
    "flex w-full  border bg-transparent px-3 py-2 font-polysans text-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border-stone-200 rounded-lg text-stone-900 placeholder:text-slate-600 focus-visible:shadow-sm",
                filled:
                    "border-transparent bg-slate-100 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-950",
                outline:
                    "border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-950",
            },
            inputSize: {
                sm: "h-8 text-xs px-2.5",
                md: "h-10 text-sm px-3",
                lg: "h-12 text-base px-4",
            },
            errorState: {
                true: "border-red-500 text-red-900 placeholder:text-red-300 focus-visible:ring-red-500",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "md",
            errorState: false,
        },
    },
);

export interface IInputProps<T extends Record<string, object | string>>
    extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "name">,
    VariantProps<typeof inputVariants> {
    name: Path<T>;
    label?: string;
    register?: UseFormRegister<T>;
    errors?: FieldErrors<T>;
    rules?: Parameters<UseFormRegister<T>>[1];
    helperText?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputType?: string;
}

export const Input = <T extends Record<string, object | string>>({
    name,
    label,
    register,
    errors,
    rules,
    variant,
    inputSize,
    className,
    helperText,
    onChange,
    id,
    inputType = "text",
    ...props
}: IInputProps<T>) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const errorMessage = errors?.[name]?.message as string | undefined;
    const hasError = Boolean(errorMessage);

    const registerProps = register ? register(name, rules) : {};

    const inputTypes: Record<string, React.ReactNode> = {
        text: (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block font-polysans text-xs font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}

                <input
                    id={inputId}
                    aria-invalid={hasError}
                    className={cn(
                        inputVariants({
                            variant,
                            inputSize,
                            errorState: hasError,
                        }),
                        className,
                    )}
                    {...registerProps}
                    {...props}
                    onChange={(e) => {
                     
                        onChange?.(e);
                    }}
                />

                {hasError ? (
                    <p className="font-polysans text-xs text-red-600 font-medium">
                        {errorMessage}
                    </p>
                ) : helperText ? (
                    <p className="font-polysans text-xs text-slate-500">{helperText}</p>
                ) : null}
            </div>
        ),
    };

    return inputTypes[inputType];
};