import type {ComponentDoc,Guide} from './documentation';
export const fulldevComponents:ComponentDoc[]=[
  {
    "slug": "aspect-ratio",
    "name": "Aspect Ratio",
    "category": "Content",
    "description": "Keep authored media within a fixed ratio.",
    "usage": "import { AspectRatio } from 'dmf-ui/aspect-ratio';\nimport demoUrl from 'dmf-ui/assets/component-demo.svg?url';\n\n<AspectRatio ratio={16/9} class=\"overflow-hidden rounded-lg border\"><img src={demoUrl} alt=\"Three geometric panels\" class=\"size-full object-cover\" width=\"640\" height=\"360\"/></AspectRatio>",
    "options": [
      [
        "ratio",
        "positive number",
        "Required"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "attachment",
    "name": "Attachment",
    "category": "Content",
    "description": "Compose file metadata, media and explicit actions.",
    "usage": "import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions, AttachmentAction } from 'dmf-ui/attachment';\nimport { FileText, Search, BookOpen } from '@lucide/astro';\n\n<Attachment><AttachmentMedia variant=\"icon\"><FileText size={24} aria-hidden=\"true\"/></AttachmentMedia><AttachmentContent><AttachmentTitle>License notices</AttachmentTitle><AttachmentDescription>Local text document. No upload is running.</AttachmentDescription></AttachmentContent><AttachmentActions class=\"w-full justify-end\"><AttachmentAction size=\"default\" as=\"a\" href=\"/dmf-ui-notices.txt\" variant=\"outline\">Read notices</AttachmentAction></AttachmentActions></Attachment>",
    "options": [
      [
        "parts",
        "Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions, AttachmentAction",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "banner",
    "name": "Banner",
    "category": "Feedback",
    "description": "Present a named announcement with optional dismissal.",
    "usage": "import { Banner, BannerContainer } from 'dmf-ui/banner';\nimport { Button, Input, Label, Form } from 'dmf-ui';\n\n<Banner aria-label=\"Example announcement\"><BannerContainer closeLabel=\"Dismiss example announcement\"><p>Explore the adapted component library. <a href=\"/docs/introduction/\">Read the introduction</a></p></BannerContainer></Banner>",
    "options": [
      [
        "parts",
        "Banner, BannerContainer",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "button-group",
    "name": "Button Group",
    "category": "Forms",
    "description": "Group related native controls with connected edges.",
    "usage": "import { ButtonGroup, ButtonGroupSeparator } from 'dmf-ui/button-group';\nimport { Button, Input, Label, Form } from 'dmf-ui';\n\n<ButtonGroup aria-label=\"Local preview commands\"><Button>First</Button><ButtonGroupSeparator/><Button variant=\"outline\">Second</Button></ButtonGroup>",
    "options": [
      [
        "parts",
        "ButtonGroup, ButtonGroupSeparator",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "carousel",
    "name": "Carousel",
    "category": "Content",
    "description": "Browse responsive slides using Embla and native controls.",
    "usage": "import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from 'dmf-ui/carousel';\n\n<Carousel aria-label=\"Illustrative component slides\" class=\"mx-12\"><CarouselContent>{[1,2,3].map(number=><CarouselItem><div class=\"rounded-lg border bg-muted p-6\"><p>Example slide {number} of 3</p></div></CarouselItem>)}</CarouselContent><CarouselPrevious/><CarouselNext/></Carousel>",
    "options": [
      [
        "orientation",
        "horizontal | vertical",
        "horizontal"
      ],
      [
        "opts",
        "Embla options",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
  "slug": "code-block",
  "name": "Code Block",
  "category": "Content",
  "description": "Composable code presentation with a compact header, syntax highlighting, line numbers and exact copy actions.",
  "usage": "import {CodeSnippet} from 'dmf-ui/code-block';\n\n<CodeSnippet language=\"ts\" title=\"example.ts\"\n code={'const ready = true;\\nexport { ready };'}\n lineNumbers highlightedLines={[1]} maxHeight={320}/>",
  "options": [
    [
      "parts",
      "CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions, CodeBlockCopyButton, CodeBlockContent",
      "Authored composition"
    ],
    [
      "native attributes",
      "Element attributes; see source",
      "Native defaults"
    ],
    [
      "language (Content / CodeSnippet)",
      "astro | ts | tsx | js | jsx | css | json | bash | html | text",
      "Plain text when omitted"
    ],
    [
      "highlightedLines",
      "positive display-line numbers[]",
      "[]"
    ],
    [
      "CodeSnippet",
      "code, title?, id?, language?, wrap?, lineNumbers?, maxHeight?",
      "Authored composition"
    ]
  ],
  "notes": [
    "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
    "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
    "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
    "Nova styling follows the pinned shadcn/ui specification. Highlighting uses Astro’s server-side Code component; no browser highlighter is shipped. Copy uses the authored source and manual selection is available if clipboard access fails."
  ]
},
  {
    "slug": "command",
    "name": "Command",
    "category": "Navigation",
    "description": "Search local actions or real page links with keyboard selection.",
    "usage": "import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandDialog, CommandDialogTrigger } from 'dmf-ui/command';\n\n<Command label=\"Component command list\" class=\"rounded-lg border\"><CommandInput aria-label=\"Search component commands\" placeholder=\"Find a component\u2026\"/><CommandList><CommandEmpty>No matching commands.</CommandEmpty><CommandGroup heading=\"Components\"><CommandItem href=\"/components/button/\" value=\"button\">Button<CommandShortcut>B</CommandShortcut></CommandItem><CommandItem href=\"/components/card/\" value=\"card\">Card</CommandItem><CommandItem value=\"unavailable\" disabled>Unavailable command</CommandItem></CommandGroup></CommandList></Command><CommandDialog id=\"docs-fulldev-command-dialog\" title=\"Find a guide\"><CommandDialogTrigger slot=\"trigger\" label=\"Open command dialog\"/><Command label=\"Guide commands\"><CommandInput aria-label=\"Search guide commands\"/><CommandList><CommandEmpty>No matching guides.</CommandEmpty><CommandGroup heading=\"Guides\"><CommandItem href=\"/docs/installation/\" value=\"installation\">Installation</CommandItem><CommandItem href=\"/docs/theming/\" value=\"theming\">Theming</CommandItem></CommandGroup></CommandList></Command></CommandDialog>",
    "options": [
      [
        "parts",
        "Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandDialog, CommandDialogTrigger",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
    "slug": "drawer",
    "name": "Drawer",
    "category": "Disclosure",
    "description": "Use a swipe-capable drawer with explicit modal controls.",
    "usage": "import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from 'dmf-ui/drawer';\nimport { Button, Input, Label, Form } from 'dmf-ui';\n\n<Drawer id=\"docs-fulldev-drawer\"><DrawerTrigger>Open drawer</DrawerTrigger><DrawerContent showSwipeHandle><DrawerHeader><DrawerTitle>Local drawer preview</DrawerTitle><DrawerDescription>Use the close control or Escape. Nothing is saved.</DrawerDescription></DrawerHeader><div class=\"px-4\"><Label for=\"docs-fulldev-drawer-value\">Draft label</Label><Input id=\"docs-fulldev-drawer-value\" value=\"Local draft\"/></div><DrawerFooter><DrawerClose>Close drawer</DrawerClose></DrawerFooter></DrawerContent></Drawer>",
    "options": [
      [
        "parts",
        "Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
    "slug": "empty",
    "name": "Empty",
    "category": "Feedback",
    "description": "Compose a missing-result message with authored recovery links.",
    "usage": "import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from 'dmf-ui/empty';\nimport { Button, Input, Label, Form } from 'dmf-ui';\nimport { FileText, Search, BookOpen } from '@lucide/astro';\n\n<Empty><EmptyHeader><EmptyMedia variant=\"icon\"><Search size={24} aria-hidden=\"true\"/></EmptyMedia><EmptyTitle>No saved examples</EmptyTitle><EmptyDescription>Browse the library for a starting point.</EmptyDescription></EmptyHeader><EmptyContent><Button as=\"a\" href=\"/components/\">Browse components</Button></EmptyContent></Empty>",
    "options": [
      [
        "parts",
        "Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "form",
    "name": "Form",
    "category": "Forms",
    "description": "Compose native form submission and field layout.",
    "usage": "import { Form } from 'dmf-ui/form';\nimport { Input, Label, Button } from 'dmf-ui';\n\n<Form>\n  <Label for=\"preview-name\">Name</Label>\n  <Input id=\"preview-name\" name=\"name\" required />\n  <Button type=\"submit\">Continue</Button>\n</Form>",
    "options": [
      [
        "parts",
        "Form",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "header",
    "name": "Header",
    "category": "Navigation",
    "description": "Compose a responsive header with grouped content.",
    "usage": "import { Header, HeaderContainer, HeaderGroup } from 'dmf-ui/header';\n\n<Header class=\"rounded-lg border\"><HeaderContainer class=\"flex-wrap\"><HeaderGroup><strong>DMF UI</strong></HeaderGroup><HeaderGroup><nav aria-label=\"Example header navigation\" class=\"docs-preview-row\"><a href=\"/components/\">Components</a><a href=\"/docs/\">Docs</a></nav></HeaderGroup></HeaderContainer></Header>",
    "options": [
      [
        "parts",
        "Header, HeaderContainer, HeaderGroup",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "hover-card",
    "name": "Hover Card",
    "category": "Disclosure",
    "description": "Show supplemental link information on hover or focus.",
    "usage": "import { HoverCard, HoverCardTrigger, HoverCardContent } from 'dmf-ui/hover-card';\n\n<HoverCard delay={100} closeDelay={100}><HoverCardTrigger href=\"/docs/introduction/\">About DMF UI</HoverCardTrigger><HoverCardContent><p>Experimental, source-owned Astro components.</p><a href=\"/docs/introduction/\">Read the introduction</a></HoverCardContent></HoverCard>",
    "options": [
      [
        "parts",
        "HoverCard, HoverCardTrigger, HoverCardContent",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
    "slug": "icon",
    "name": "Icon",
    "category": "Foundation",
    "description": "Resolve content icons and brand marks without a remote request.",
    "usage": "import { Icon } from 'dmf-ui/icon';\n\n<div class=\"docs-preview-row\"><Icon name=\"search\" width={24} height={24} aria-hidden=\"true\"/><span>Decorative search icon</span><a href=\"https://github.com/dmfeisal/dmf-ui\" aria-label=\"DMF UI GitHub repository\"><Icon name=\"simple:github\" width={24} height={24} aria-hidden=\"true\"/></a></div>",
    "options": [
      [
        "parts",
        "Icon",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "Dynamic icons resolve from local package imports on the server; no host-root node_modules glob or remote icon request is required. Prefer named Lucide imports for icons fixed in code. Simple Icons notices are retained."
    ]
  },
  {
    "slug": "image",
    "name": "Image",
    "category": "Content",
    "description": "Use Astro image optimization with explicit alt text and dimensions.",
    "usage": "import { Image } from 'dmf-ui/image';\nimport demoUrl from 'dmf-ui/assets/component-demo.svg?url';\n\n<Image src={demoUrl} alt=\"Three geometric panels\" width={640} height={360} inferSize={false} class=\"rounded-lg border\"/>",
    "options": [
      [
        "parts",
        "Image",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "item",
    "name": "Item",
    "category": "Content",
    "description": "Compose a named content row with media, details and actions.",
    "usage": "import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from 'dmf-ui/item';\nimport { Button, Input, Label, Form } from 'dmf-ui';\nimport { FileText, Search, BookOpen } from '@lucide/astro';\n\n<Item variant=\"outline\"><ItemMedia variant=\"icon\"><BookOpen size={24} aria-hidden=\"true\"/></ItemMedia><ItemContent><ItemTitle>Installation guide</ItemTitle><ItemDescription>Prepare a pinned local consumer.</ItemDescription></ItemContent><ItemActions><Button as=\"a\" href=\"/docs/installation/\" variant=\"outline\">Read guide</Button></ItemActions></Item>",
    "options": [
      [
        "parts",
        "Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "kbd",
    "name": "Kbd",
    "category": "Content",
    "description": "Display keyboard instructions as static text.",
    "usage": "import { Kbd, KbdGroup } from 'dmf-ui/kbd';\n\n<p>Open search with <KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>K</Kbd></KbdGroup>. These labels do not register a shortcut.</p>",
    "options": [
      [
        "parts",
        "Kbd, KbdGroup",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "layout",
    "name": "Layout",
    "category": "Foundation",
    "description": "Build a complete document shell with metadata and native page structure.",
    "usage": "import { Layout, LayoutHead, LayoutBody, LayoutMain } from 'dmf-ui/layout';\n\n<Layout lang=\"en\">\n  <LayoutHead title=\"Example\" description=\"A local document.\" />\n  <LayoutBody><LayoutMain><h1>Example page</h1></LayoutMain></LayoutBody>\n</Layout>",
    "options": [
      [
        "parts",
        "Layout, Head, Body, Main",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "Layout is a complete document shell and must not be nested inside another document. Global view transitions are left to the host; none are enabled automatically."
    ]
  },
  {
    "slug": "logo",
    "name": "Logo",
    "category": "Content",
    "description": "Compose a native brand link with text or image.",
    "usage": "import { Logo, LogoText } from 'dmf-ui/logo';\n\n<Logo href=\"/\" aria-label=\"DMF UI home\"><LogoText>DMF UI</LogoText></Logo>",
    "options": [
      [
        "parts",
        "Logo, LogoText",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "marquee",
    "name": "Marquee",
    "category": "Content",
    "description": "Present a scrolling row with pause and reduced-motion behavior.",
    "usage": "import { Marquee, MarqueeContent, MarqueeItem, MarqueeToggle } from 'dmf-ui/marquee';\n\n<Marquee><MarqueeContent>{[\"Astro\",\"Tokens\",\"Components\",\"Documentation\",\"Presets\"].map(label=><MarqueeItem class=\"basis-1/2\"><div class=\"rounded-lg border bg-muted p-4\">{label}</div></MarqueeItem>)}</MarqueeContent><MarqueeToggle playLabel=\"Resume example marquee\" pauseLabel=\"Pause example marquee\" class=\"mt-4\">Toggle motion</MarqueeToggle></Marquee>",
    "options": [
      [
        "parts",
        "Marquee, MarqueeContent, MarqueeItem, MarqueeToggle",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
    "slug": "native-select",
    "name": "Native Select",
    "category": "Forms",
    "description": "Style a native select while preserving browser form behavior.",
    "usage": "import { NativeSelect, NativeSelectOption } from 'dmf-ui/native-select';\nimport { Label } from 'dmf-ui/label';\n\n<Label for=\"category\">Category</Label>\n<NativeSelect id=\"category\" name=\"category\" multiple={false}>\n  <NativeSelectOption value=\"content\">Content</NativeSelectOption>\n  <NativeSelectOption value=\"forms\">Forms</NativeSelectOption>\n</NativeSelect>",
    "options": [
      [
        "parts",
        "NativeSelect, NativeSelectOption, NativeSelectOptGroup",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "price",
    "name": "Price",
    "category": "Content",
    "description": "Format authored prices and comparison values with locale-aware text.",
    "usage": "import { Price, PriceValue, PriceUnit } from 'dmf-ui/price';\n\n<Price><PriceValue price={120000} compareAt={150000} currency=\"IDR\" locale=\"id-ID\"/><PriceUnit>/ example item</PriceUnit></Price><p class=\"docs-note\">Illustrative values only; no checkout or live pricing.</p>",
    "options": [
      [
        "price / compareAt (PriceValue)",
        "Authored values",
        "None"
      ],
      [
        "currency / locale (PriceValue)",
        "Intl.NumberFormat options",
        "USD / en-US"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "resizable",
    "name": "Resizable",
    "category": "Content",
    "description": "Resize adjacent panels using keyboard or pointer controls.",
    "usage": "import { Resizable, ResizablePanel, ResizableHandle } from 'dmf-ui/resizable';\n\n<Resizable class=\"min-h-48 rounded-lg border\" keyboardResizeBy={10}><ResizablePanel defaultSize={50} minSize={20}><div class=\"p-4\">First panel</div></ResizablePanel><ResizableHandle aria-label=\"Resize example panels\" withHandle/><ResizablePanel defaultSize={50} minSize={20}><div class=\"p-4\">Second panel</div></ResizablePanel></Resizable>",
    "options": [
      [
        "direction",
        "horizontal | vertical",
        "horizontal"
      ],
      [
        "keyboardResizeBy",
        "number",
        "Upstream default"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "JavaScript enhances this component. Keep essential content and a host fallback available; animation and native input behavior require cross-browser acceptance checks."
    ]
  },
  {
    "slug": "section",
    "name": "Section",
    "category": "Foundation",
    "description": "Group a page section with authored heading and description.",
    "usage": "import { Section, SectionContainer, SectionTitle, SectionDescription } from 'dmf-ui/section';\n\n<Section aria-labelledby=\"docs-fulldev-section-title\" class=\"rounded-lg border\"><SectionContainer class=\"py-6\"><SectionTitle id=\"docs-fulldev-section-title\" as=\"h3\">A focused section</SectionTitle><SectionDescription>Use a heading level that fits the host document.</SectionDescription></SectionContainer></Section>",
    "options": [
      [
        "parts",
        "Section, SectionContainer, SectionTitle, SectionDescription",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "spinner",
    "name": "Spinner",
    "category": "Feedback",
    "description": "Expose an intentional loading indicator or decorative progress icon.",
    "usage": "import { Spinner } from 'dmf-ui/spinner';\n\n<div class=\"docs-preview-row\"><Spinner aria-label=\"Illustrative loading indicator\"/><p>Illustrative pending state. No request is running.</p></div>",
    "options": [
      [
        "parts",
        "Spinner",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "theme-toggle",
    "name": "Theme Toggle",
    "category": "Forms",
    "description": "Toggle the DMF light/dark theme with a stable named button.",
    "usage": "import { ThemeToggle } from 'dmf-ui/theme-toggle';\n\n<ThemeToggle/><p>The button changes this documentation theme and stays synchronized with the header.</p>",
    "options": [
      [
        "parts",
        "ThemeToggle",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document.",
      "Uses data-theme and the optional DMF ThemeProvider. The documentation header handles shared theme requests. Storage is used only when a host explicitly renders ThemeProvider."
    ]
  },
  {
    "slug": "toc",
    "name": "Table of Contents",
    "category": "Navigation",
    "description": "Link to actual sections through a native table of contents.",
    "usage": "import { Toc, TocTitle, TocMenu, TocMenuItem, TocMenuLink } from 'dmf-ui/toc';\n\n<Toc aria-label=\"Example page sections\"><TocTitle>On this page</TocTitle><TocMenu><TocMenuItem><TocMenuLink href=\"#usage\">Usage</TocMenuLink></TocMenuItem><TocMenuItem><TocMenuLink href=\"#options\">Core options</TocMenuLink></TocMenuItem><TocMenuItem><TocMenuLink href=\"#behavior\">Behavior</TocMenuLink></TocMenuItem></TocMenu></Toc>",
    "options": [
      [
        "parts",
        "Toc, TocTitle, TocMenu, TocMenuItem, TocMenuLink",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "typography",
    "name": "Typography",
    "category": "Content",
    "description": "Style prose and semantic text primitives independently of page layout.",
    "usage": "import { Typography, TypographyH3, TypographyP, TypographyA, TypographyInlineCode } from 'dmf-ui/typography';\n\n<Typography><TypographyH3>Readable source-owned content</TypographyH3><TypographyP>Compose text with <TypographyInlineCode>semantic tokens</TypographyInlineCode> and <TypographyA href=\"/docs/theming/\">theming guidance</TypographyA>.</TypographyP></Typography>",
    "options": [
      [
        "parts",
        "Typography, TypographyH3, TypographyP, TypographyA, TypographyInlineCode",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  },
  {
    "slug": "video",
    "name": "Video",
    "category": "Content",
    "description": "Embed a supported YouTube URL with an explicit title.",
    "usage": "import { Video } from 'dmf-ui/video';\n\n<Video src=\"https://www.youtube.com/watch?v=aqz-KE-bpKQ\" title=\"Big Buck Bunny video preview\" loading=\"lazy\" />",
    "options": [
      [
        "parts",
        "Video",
        "Authored composition"
      ],
      [
        "native attributes",
        "Element attributes; see source",
        "Native defaults"
      ]
    ],
    "notes": [
      "Adapted from the pinned Fulldev UI 0.25.5 base-vega snapshot under MIT. Existing DMF component APIs and tokens remain in place.",
      "The copyable composition is a starting point; source props are authoritative. Use explicit labels, meaningful native links/actions and heading levels that fit the host page.",
      "No application backend or data persistence is added. Browser and assistive-technology verification boundaries are recorded in the Fulldev adoption document."
    ]
  }
];
export const fulldevGuide:Guide={slug:'fulldev-adoption',title:'Fulldev adoption',description:'Pinned upstream source, complete Astro family coverage and DMF adaptation boundaries.',sections:[{id:'scope',title:'Pinned source and coverage',body:['The Fulldev UI 0.25.5 base-vega snapshot is pinned to Git revision 10427beee3c8faf9d077c1dec66fce41b0bae2d0. Its 65 Astro UI families are represented: 37 retain existing DMF implementations and 28 missing families are adapted from registry payloads.','This is component-family coverage, not a claim of identical upstream APIs or full accessibility certification. Existing DMF customization, public APIs, presets and extra components remain. Blocks and other framework adapters are outside this import.']},{id:'adaptation',title:'DMF integration',body:['Registry imports point to source-owned DMF modules. The base-vega registry classes use existing semantic tokens. Host-global stylesheet paths and automatic view transitions are removed from Layout.','Content icons use local package imports rather than host-root node_modules globs. Theme Toggle uses data-theme and coordinates with the existing documentation header. Drawer and Hover Card portals retain their originating preset and direction; Command Dialog uses the isolated modal foundation.','Examples use authored local data, a local SVG and real documentation links. The optional video preview remains in an inert template until the user chooses to load it. No backend, package publication or release tag is introduced.']},{id:'provenance',title:'Source records and notices',body:['Vendored registry payloads and the MIT license are retained with SHA-256 hashes. docs/DMF-UI-FULLDEV-CATALOG.json records original and adopted file hashes; scripts/import-fulldev-components.mjs verifies the pinned snapshot without overwriting existing source.','Preserve Fulldev, shadcn/ui and dependency notices when distributing the source. New runtime dependencies are pinned, and the isolated packed consumer lock must stay synchronized.']},{id:'verification',title:'Verification boundaries',body:['Source checks and production rendering cover the imported families. Browser acceptance exercises representative keyboard, pointer, form, overlay, motion and responsive behavior; the adoption report records the exact completed checks and remaining manual work.','Safari, Firefox, physical touch/virtual keyboards and spoken screen-reader verification remain manual. Imported components are experimental Astro source; the private React adapter remains at its current alpha scope.']}]};
