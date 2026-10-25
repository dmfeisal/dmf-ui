# DMF UI React alpha

Private proof `0.1.0-alpha.3`, not published. Install the root repository dependencies, then run `npm ci` here and `npm test`. `npm run build` emits ESM, TypeScript declarations and third-party notices; `npm pack` builds before packing. Import components from `@dmf-ui/react` and styles from `@dmf-ui/react/styles.css` in a Tailwind v4 host. Supply a `.dmf-ui` ancestor and the same theme/preset attributes as the Astro foundation. The source is included for CSS class discovery, while runtime exports use compiled modules.

A separate Vite consumer installs packed archives and verifies production assets, TypeScript, native ESM imports, refs, simulated keyboard input and controlled forms. Run `npm run test:dmf-ui:react-consumer` from the root. The optional `test:dmf-ui:react-browser` command reviews its retained production build in Ego Browser. Chromium keyboard/touch, preset/theme, font, focus, mobile/RTL, 200% text and contrast checks pass; Safari desktop/narrow-frame checks passed for the earlier five-component scope. The expanded Badge/Alert fixture passes Chromium; Firefox and spoken screen-reader checks remain pending. Alpha.3 strengthens Input and Switch boundaries using existing semantic colors and provides explicit native-input focus. The core dependency currently brings its full Astro/Data Slot dependency graph; the React runtime does not initialize those controllers.

The current fourteen component families are Button, Text, Input, Switch, Card, Badge, Alert, Label, Textarea, Checkbox, Separator, Field, Radio Group and Select. Alert also exports AlertTitle, AlertDescription and AlertAction.

Button uses the shared Fulldev-based variant definition. Text preserves author-selected heading semantics; Card is a non-interactive content container. Input forwards native React input props and refs. Switch is a labeled native checkbox with `role="switch"`; use `checked` plus `onChange` for controlled state, or `defaultChecked` for native uncontrolled state. Do not switch between those modes. Native required/disabled/name/value/form/reset behavior applies. Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are not exposed.

The component package does not import React DOM or create roots. Hosts own rendering, hydration, controlled form reset and unmount. The source documentation proof uses Strict Mode, server rendering, hydration and an explicit unmount action. It sends no requests and disables its form until hydrated. Overlays and later families remain outside this proof.

React Native and SwiftUI cannot consume this CSS or browser implementation. `@dmf-ui/react/notices` includes core attribution and the bundled clsx license. React dependency licensing remains in the installed React distribution.

## Badge and Alert

Badge defaults to a static `span`. Set `as="a"` and a required `href` for native navigation; anchor refs and native link props are supported. Variants: default, secondary, destructive, outline, ghost and link. Text supplies the status meaning; badges do not announce changes automatically. Button rendering is not exposed.

Alert defaults to a static `div` with `role="note"`. Authors may explicitly choose `role="status"` or `role="alert"`; there is no automatic live region, focus transfer, dismissal or timer. AlertTitle, AlertDescription and AlertAction are native div containers with refs. Authors supply heading semantics inside the title, connect labels/descriptions with native attributes, and provide real links/buttons inside the action area. Variants: default and destructive.

```tsx
<Alert aria-labelledby="preview-title">
  <AlertTitle id="preview-title">Local preview</AlertTitle>
  <AlertDescription>Values stay on this page.</AlertDescription>
  <AlertAction>
    <Badge as="a" href="#preferences" variant="link">Review preferences</Badge>
  </AlertAction>
</Alert>
```

The expanded packed fixture checks typed link/ref contracts, static versus opt-in announcement semantics, independent-root IDs, all content refs and cleanup, and both-preset SSR hydration. This content-only checkpoint originally had four adapter tests and five packed tests; later batches extend it below. The alpha version remains unchanged during this unpublished local iteration.

## Native form primitives

Label forwards native label props/ref. Associate it using `htmlFor` and a unique control ID, or nest the control. It does not generate names or a disabled state. A checkbox label should offer at least a 44px hit area; the consumer demonstrates that host layout.

Textarea forwards native textarea props/ref, including controlled `value`/`onChange`, `defaultValue`, required/disabled, name, form, rows and authored ARIA descriptions/errors. It resizes vertically, wraps within its container and uses a visible keyboard outline. Hosts own controlled reset and error messages; no validation message is invented.

Checkbox is a native checkbox with native browser artwork, accent color and focus outline. It supports refs, checked/onChange or defaultChecked, required/disabled/name/value/form and native reset. There is no Switch role or custom SVG controller. `type`, `role`, children, size and readOnly are excluded. Set `indeterminate` through the native ref; it is not an SSR attribute or a separate controlled prop. The host owns resetting that imperative state. Native artwork varies by browser and system palette.

Separator defaults to a decorative horizontal div (`role="none"`). Use `decorative={false}` for `role="separator"` and an explicit horizontal/vertical orientation. A vertical separator needs a parent with available height. It has no children, tabIndex or adjustable-value contract; it is not an interactive splitter.

```tsx
<Label htmlFor="notes">Notes</Label>
<Textarea id="notes" name="notes" defaultValue="" />
<Label className="min-h-[44px]">
  <Checkbox name="includeDetails" defaultChecked />Include optional details
</Label>
<Separator decorative={false} />
```

The native-control checkpoint had five adapter tests and six packed-consumer tests; the composition batch below extends those checks. Safari's historical review covers the original five families; the added native controls still need Safari/Firefox, spoken-reader and real-device verification.

## Card and Field composition

CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter are optional content containers inside the existing padded Card. They add no extra inline padding. Card remains a non-interactive div; child links/buttons own actions. CardTitle defaults to div; `as="h2"` (or another h1–h6) chooses authored heading semantics and the native ref type. Other Card parts are divs. Header positions an authored action in a second column; content/footer wrap naturally. This does not add a linked-card or navigation API.

Field, FieldGroup, FieldContent, FieldLabel, FieldTitle, FieldDescription, FieldError, FieldSet, FieldLegend and FieldSeparator provide form composition. Field defaults to a div group and supports vertical, horizontal and responsive orientation. Responsive fields change within the named container supplied by FieldGroup. Hosts align native controls with their chosen label target sizes. `data-invalid`/`data-disabled` style a group; they do not validate or disable inputs.

FieldSet/FieldLegend are native fieldset/legend elements. FieldSet disabled propagates natively to its controls. FieldLabel is a native label, FieldDescription is a paragraph, and FieldTitle is a static div (not a label or heading). FieldContent and FieldGroup are div containers. No polymorphic span/div mode is exposed for these parts. FieldSeparator adds decorative lines around optional authored text.

FieldError renders nothing without meaningful errors or children. The optional `errors` array accepts `{message?: string}` entries and undefined; messages are trimmed, empty messages discarded and duplicates removed. Authored children override the error array. The default role is alert, matching the core; hosts may choose status/note for less urgent content. The component neither validates nor generates messages, IDs or control associations. Hosts decide when to mount/update errors and connect them with aria-describedby and aria-invalid. Spoken announcements remain unverified.

```tsx
<Card>
  <CardHeader><CardTitle as="h2">Preferences</CardTitle></CardHeader>
  <CardContent>
    <FieldSet>
      <FieldLegend>Local values</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <FieldContent>
            <Textarea id="notes" aria-describedby="notes-help" />
            <FieldDescription id="notes-help">Values stay on this page.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  </CardContent>
</Card>
```

Current validation: six adapter tests and seven clean packed-consumer tests, plus the expanded Chrome matrix. Core 0.4.0 and unpublished React alpha.3 are unchanged. The new composition batch remains outside the earlier Safari/hosted CI evidence.

## Native selection controls

RadioGroup renders a fieldset with radiogroup semantics; give it a FieldLegend or authored accessible name. Its items are native radio inputs. Supply one shared name for form submission; omitted names use a unique React ID to isolate groups. Use value/onValueChange together for controlled selection or defaultValue for native uncontrolled selection. Keep the mode stable. Group required/disabled propagate to items; an item can be individually disabled. Hosts reset controlled values. Item checked/defaultChecked/name/type/readOnly overrides are excluded; items require a RadioGroup ancestor. Native browser arrows and label activation handle interaction without an adapter keyboard controller.

Select, SelectOption and SelectGroup render select, option and optgroup. They forward native props/refs, controlled onChange, defaultValue, multiple arrays, required/disabled, name and form. SelectGroup requires an authored label. Use a separate Label and unique ID. Native picker appearance and keyboard details vary by browser/OS; this API does not include custom Trigger/Content/listbox parts or portals.

The selection batch passes seven adapter tests and eight packed-consumer tests, including five new refs, type contracts, independent radio names, controlled/native resets, multiple selections and both-preset SSR hydration. Chrome checks native radio arrows/disabled skipping, Select typeahead and disabled optgroup semantics, validation, submission/reset and forced-colors focus. Safari/Firefox, spoken readers and physical-device pickers remain pending. Versions remain core 0.4.0 and unpublished React alpha.3.
