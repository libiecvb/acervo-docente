/**
 * @file Badge component built on Base UI primitives.
 * @remarks Uses @base-ui/react/use-render for flexible rendering patterns.
 */

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge variants using class-variance-authority.
 *
 * @remarks
 * All variants support anchor element hover states.
 * The `secondary` variant is used for topic tags in BookCard.
 *
 * @public
 */
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Props for the Badge component.
 *
 * @public
 */
interface BadgeProps
  extends useRender.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /** Optional additional Tailwind classes */
  className?: string
  /** Custom render function for advanced patterns */
  render?: useRender.ComponentProps<"span">["render"]
}

/**
 * Badge component for topic tags and status labels.
 *
 * @remarks
 * Built on @base-ui/react/use-render for flexible DOM rendering.
 * Supports all HTML span props plus `variant` styling option.
 *
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes
 * @param props.variant - Visual variant (default, secondary, outline, destructive, ghost, link)
 *
 * @example
 * ```tsx
 * <Badge variant="secondary">Filosofia</Badge>
 * ```
 *
 * @public
 */
function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
