import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OfficialButtonProps extends ButtonProps {
  children: React.ReactNode;
  'aria-label'?: string;
  role?: string;
}

/**
 * WCAG AA Compliant Official Button for Tamil Nadu Police
 * Features:
 * - 44px minimum touch target
 * - High contrast colors
 * - Focus indicators
 * - ARIA labels
 * - Keyboard navigation
 */
export const OfficialButton = React.forwardRef<HTMLButtonElement, OfficialButtonProps>(
  ({ className, children, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          // Base official styling
          "official-button",
          // Ensure proper focus management
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          // High contrast for accessibility
          "font-semibold tracking-wide",
          // Custom overrides
          className
        )}
        // Enhanced accessibility
        role={props.role || "button"}
        aria-label={props['aria-label']}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

OfficialButton.displayName = "OfficialButton";

// Export for external use
export { OfficialButton as PrimaryButton };