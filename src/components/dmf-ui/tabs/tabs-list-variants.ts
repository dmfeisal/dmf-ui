import { cva, type VariantProps } from "class-variance-authority"

// A horizontal list wraps onto further rows when its tabs are wider than the container (large text, wide
// fonts, long labels) instead of widening the page. --dmf-tabs-row is one row's height (2.25rem; Nova sets 2rem),
// so a single row keeps its fixed height and each trigger fills its row.
export const tabsListVariants = cva(
  "rounded-lg p-[3px] [--dmf-tabs-row:calc(var(--spacing)*9)] group-data-horizontal/tabs:min-h-(--dmf-tabs-row) group-data-horizontal/tabs:flex-wrap data-[variant=line]:rounded-none group/tabs-list relative inline-flex w-fit max-w-full items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type TabsListVariantProps = VariantProps<typeof tabsListVariants>
