import { cva, type VariantProps } from "class-variance-authority"

// Nova (shadcn base-nova) Toggle, resolved to utilities. DMF UI adds an inset underline when pressed, so the pressed
// state does not rely on the muted background alone (about 1.1:1 against the page in Neutral).
export const toggleVariants = cva(
  "dmf-toggle group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-pressed:bg-muted aria-pressed:shadow-[inset_0_-2px_0_var(--foreground)] data-[state=on]:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // cn() merges away the base text-sm, so its line height is restated, as in Button sm.
        sm: "h-7 min-w-7 rounded-[min(calc(var(--radius)*.8),12px)] px-2.5 text-[0.8rem] leading-[calc(1.25/0.875)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export type ToggleVariantProps = VariantProps<typeof toggleVariants>
