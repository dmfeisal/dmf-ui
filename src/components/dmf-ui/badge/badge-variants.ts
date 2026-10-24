import { cva, type VariantProps } from "class-variance-authority"

export const badgeVariants = cva(
  "min-h-5 min-w-0 max-w-full gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-colors has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:size-3! group/badge inline-flex w-fit items-center justify-center whitespace-normal [overflow-wrap:anywhere] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&:is(a,button)]:min-h-[44px] [&:is(a,button)]:min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/95",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-[color-mix(in_oklab,var(--destructive)_80%,var(--foreground))] dark:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-foreground underline underline-offset-4 hover:decoration-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
