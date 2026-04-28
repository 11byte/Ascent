import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 overflow-hidden group relative",
  {
    variants: {
      variant: {
        default: "bg-transparent text-inherit",

        destructive: "bg-red-600 text-white hover:bg-red-700",

        outline: "border bg-transparent hover:bg-white/5",

        secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600",

        ghost: "hover:bg-white/10",

        link: "underline-offset-4 hover:underline",

        // 🔥 CLEAN slide-fill (NO color hardcoding)
        "slide-fill": "bg-transparent border-2",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;

  // 🔥 THEME COLOR (NEW)
  accent?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      accent = "#DDA853",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isAnimatedVariant = variant === "slide-fill";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {/* 🔥 Sliding Background (Dynamic Color) */}
        {isAnimatedVariant && (
          <div
            className="absolute inset-0 z-0 transition-transform duration-500 ease-in-out group-hover:translate-x-0 -translate-x-full"
            style={{
              background: accent,
            }}
          />
        )}

        {/* 🔥 Content */}
        <span
          className="relative z-10 transition-colors duration-500"
          style={{
            color: isAnimatedVariant ? accent : undefined,
          }}
        >
          {children}
        </span>
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
