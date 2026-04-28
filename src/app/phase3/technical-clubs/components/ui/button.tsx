// src/components/ui/button.tsx OR your local path

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
// NOTE: Adjust this import path based on where you placed your cn utility function!
import { cn } from "../../lib/utils" 

// 1. Define the CVA variants for the Button
const buttonVariants = cva(
  // Base styles (applied to all buttons)
  // ADD: relative and overflow-hidden for the sliding pseudo-element
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group relative",
  {
    variants: {
      // Different visual styles
      variant: {
        default: "bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-lg", // Adjusted default to match theme
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-fuchsia-400 bg-transparent text-fuchsia-400 hover:bg-fuchsia-900/50",
        secondary:
          "bg-gray-700 text-gray-200 hover:bg-gray-600",
        ghost: "hover:bg-fuchsia-900/50 hover:text-white",
        link: "text-fuchsia-400 underline-offset-4 hover:underline",
        
        // 🏆 NEW ANIMATED VARIANT: The base container for the effect
        "slide-fill": "bg-transparent text-white border-2 border-fuchsia-600 hover:border-fuchsia-400",
      },
      // Different sizes
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
  }
)

// 2. Define the TypeScript props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean // Allows the button to wrap another component (like Next.js Link)
}

// 3. The main Button Component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    
    const Comp = asChild ? Slot : "button"
    const isAnimatedVariant = variant === "slide-fill"
    
    // Determine the transition background color for the sliding fill
    const slideFillColor = "bg-fuchsia-600" 

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* 🏆 PSEUDO-ELEMENT (SLIDING BACKGROUND) */}
        {isAnimatedVariant && (
          <div 
            // The div starts outside the button (-translate-x-full)
            // and slides in to cover the button on hover (group-hover:translate-x-0)
            className={cn(
                "absolute inset-0 z-0 transition-transform duration-500 ease-in-out",
                slideFillColor,
                "group-hover:translate-x-0 -translate-x-full"
            )}
            aria-hidden="true" 
          />
        )}
        
        {/* 🏆 CONTENT LAYER */}
        <span 
            // The text needs a relative z-index to stay above the sliding background
            className={cn(
                "relative z-10 transition-colors duration-500", 
                isAnimatedVariant && "group-hover:text-white text-fuchsia-400" // Initial color is fuchsia, changes to white on hover
            )}
        >
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

// 4. Export the component and its variants
export { Button, buttonVariants }