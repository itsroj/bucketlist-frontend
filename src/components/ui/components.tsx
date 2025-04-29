import React, { useState, useEffect, createContext, useContext } from "react";
import { clsx } from "clsx";

// Button Component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variantClasses = {
      primary: "btn btn-primary",
      secondary: "btn btn-outline",
      outline: "btn btn-outline",
      destructive: "btn btn-destructive",
      ghost: "btn btn-ghost",
    };

    const sizeClasses = {
      default: "",
      sm: "text-sm py-1 px-3",
      lg: "text-lg py-3 px-5",
    };

    return (
      <button
        className={clsx(variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

// Input Component
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input className={clsx("input", className)} ref={ref} {...props} />;
  }
);

Input.displayName = "Input";

// Textarea Component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea className={clsx("textarea", className)} ref={ref} {...props} />
    );
  }
);

Textarea.displayName = "Textarea";

// Label Component
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return <label className={clsx("label", className)} ref={ref} {...props} />;
  }
);

Label.displayName = "Label";

// Dialog Components
type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a DialogProvider");
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  // Add event listener to close dialog when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if dialog is open and click is outside the dialog content
      if (isOpen) {
        const dialogOverlay = document.querySelector(".dialog-overlay");
        if (dialogOverlay === event.target) {
          handleOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick, true);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [isOpen]);

  return (
    <DialogContext.Provider
      value={{ open: isOpen, setOpen: handleOpenChange, onOpenChange }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }) {
  const { setOpen } = useDialogContext();

  return (
    <div
      onClick={() => setOpen(true)}
      style={{ display: "inline-block", cursor: "pointer" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, setOpen } = useDialogContext();

  // Handle clicking outside to close the dialog
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        className={clsx("dialog-content", className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={clsx("dialog-header", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) {
  return <h2 className={clsx("dialog-title", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return <p className={clsx("dialog-description", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={clsx("dialog-footer", className)} {...props} />;
}

export function DialogClose({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { setOpen } = useDialogContext();

  return (
    <button type="button" {...props} onClick={() => setOpen(false)}>
      {children}
    </button>
  );
}
