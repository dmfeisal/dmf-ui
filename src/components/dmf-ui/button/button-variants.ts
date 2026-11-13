import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "no-underline focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button inline-flex max-w-full shrink-0 items-center justify-center text-center break-words transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        // shadcn/ui uses text-destructive, about 4:1 on the button's tint.
        // Mixing in a fifth of the foreground keeps 4.5:1, as the native Liquid
        // button does.
        destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-[color-mix(in_oklab,var(--destructive)_80%,var(--foreground))] focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        // shadcn/ui uses text-primary, below 4.5:1 in dark mode with most theme
        // colors. A lighter step of the primary keeps 4.5:1 there.
        link: "text-(--fd-link,var(--primary)) dark:supports-[color:oklch(from_red_l_c_h)]:[--fd-link:oklch(from_var(--primary)_max(l,0.7)_calc(c*1.2)_h)] underline-offset-4 hover:underline",
      },
      // Text sizes keep their single-line height as a minimum and pad wrapped
      // labels by the same half-leading, so a label longer than its container
      // wraps instead of widening the page. Icon sizes stay fixed squares.
      size: {
        default: "min-h-[var(--dmf-button-height,2rem)] py-[max(0px,calc((var(--dmf-button-height,2rem)-1lh)/2-1px))] gap-[var(--dmf-button-gap,.375rem)] px-[var(--dmf-button-padding-inline,.625rem)] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        md: "min-h-[var(--dmf-button-height,2rem)] py-[max(0px,calc((var(--dmf-button-height,2rem)-1lh)/2-1px))] gap-[var(--dmf-button-gap,.375rem)] px-[var(--dmf-button-padding-inline,.625rem)] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "min-h-[var(--dmf-button-height-xs,1.5rem)] py-[max(0px,calc((var(--dmf-button-height-xs,1.5rem)-1lh)/2-1px))] gap-1 rounded-[min(calc(var(--radius)*.8),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-[var(--dmf-button-height-sm,1.75rem)] py-[max(0px,calc((var(--dmf-button-height-sm,1.75rem)-1lh)/2-1px))] gap-1 rounded-[min(calc(var(--radius)*.8),12px)] px-2.5 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "min-h-[var(--dmf-button-height-lg,2.25rem)] py-[max(0px,calc((var(--dmf-button-height-lg,2.25rem)-1lh)/2-1px))] gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-[var(--dmf-button-height,2rem)]",
        "icon-xs": "size-[var(--dmf-button-height-xs,1.5rem)] rounded-[min(calc(var(--radius)*.8),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-[var(--dmf-button-height-sm,1.75rem)] rounded-[min(calc(var(--radius)*.8),10px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-[var(--dmf-button-height-lg,2.25rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
