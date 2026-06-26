/**
 * @file Dialog component built on Base UI primitives.
 * @remarks Compound component pattern for accessible modal dialogs.
 */

"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/**
 * Dialog root component.
 *
 * @remarks Wraps @base-ui/react/dialog Root with data-slot attribute.
 * @public
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Dialog trigger component.
 *
 * @remarks Wraps @base-ui/react/dialog Trigger with data-slot attribute.
 * @public
 */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Dialog portal component.
 *
 * @remarks Wraps @base-ui/react/dialog Portal with data-slot attribute.
 * @public
 */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Dialog close component.
 *
 * @remarks Wraps @base-ui/react/dialog Close with data-slot attribute.
 * @public
 */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Props for the DialogOverlay component.
 *
 * @public
 */
interface DialogOverlayProps extends DialogPrimitive.Backdrop.Props {
  /** Optional additional Tailwind classes */
  className?: string
}

/**
 * Dialog overlay/backdrop component.
 *
 * @remarks
 * Renders a semi-transparent backdrop behind the dialog with
 * optional backdrop blur and animation classes.
 *
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 *
 * @public
 */
function DialogOverlay({
  className,
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Props for the DialogContent component.
 *
 * @public
 */
interface DialogContentProps
  extends DialogPrimitive.Popup.Props {
  /** Optional additional Tailwind classes */
  className?: string
  /** Dialog body content */
  children: React.ReactNode
  /** Show built-in close button (default: true) */
  showCloseButton?: boolean
}

/**
 * Dialog content component with optional close button.
 *
 * @remarks
 * Renders the dialog popup with overlay and optional close button.
 * Uses fixed positioning with center alignment and responsive max-width.
 *
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 * @param props.children - Dialog body content
 * @param props.showCloseButton - Show built-in close button (default: true)
 *
 * @public
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

/**
 * Props for the DialogHeader component.
 *
 * @public
 */
interface DialogHeaderProps extends React.ComponentProps<"div"> {
  /** Optional additional Tailwind classes */
  className?: string
}

/**
 * Dialog header component.
 *
 * @remarks Flex column layout for dialog title and description.
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 *
 * @public
 */
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * Props for the DialogFooter component.
 *
 * @public
 */
interface DialogFooterProps
  extends React.ComponentProps<"div"> {
  /** Optional additional Tailwind classes */
  className?: string
  /** Dialog footer content */
  children: React.ReactNode
  /** Show built-in close button (default: false) */
  showCloseButton?: boolean
}

/**
 * Dialog footer component with optional close button.
 *
 * @remarks Flex layout with responsive row direction on small screens.
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 * @param props.children - Footer content
 * @param props.showCloseButton - Show built-in close button (default: false)
 *
 * @public
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/**
 * Props for the DialogTitle component.
 *
 * @public
 */
interface DialogTitleProps extends DialogPrimitive.Title.Props {
  /** Optional additional Tailwind classes */
  className?: string
}

/**
 * Dialog title component.
 *
 * @remarks Uses Playfair Display font via `font-heading` class.
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 *
 * @public
 */
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

/**
 * Props for the DialogDescription component.
 *
 * @public
 */
interface DialogDescriptionProps extends DialogPrimitive.Description.Props {
  /** Optional additional Tailwind classes */
  className?: string
}

/**
 * Dialog description component.
 *
 * @remarks Uses muted foreground color with underline styles for links.
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 *
 * @public
 */
function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
