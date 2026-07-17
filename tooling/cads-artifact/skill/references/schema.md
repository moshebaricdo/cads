# CADS prototype JSON schema

```json
{
  "title": "string (required)",
  "theme": "light | dark",
  "root": { "type": "layout | text | component", "...": "..." },
  "_cads": {
    "manifestVersion": "from runtime/VERSION.json",
    "format": "html-self-contained"
  }
}
```

## Node types

### layout

```json
{
  "type": "layout",
  "layout": "stack | inline | surface",
  "props": {
    "gap": "none | xs | s | m | l | xl | xxl",
    "padding": "none | xs | s | m | l | xl | xxl",
    "align": "start | center | end | stretch",
    "fullWidth": true
  },
  "children": []
}
```

### text

```json
{
  "type": "text",
  "variant": "headingLarge | headingMedium | headingSmall | body | bodySmall",
  "text": "Visible copy"
}
```

### component

```json
{
  "type": "component",
  "component": "Button",
  "props": { "variant": "contained", "color": "primary", "size": "large" },
  "children": "Continue"
}
```

`component` must be a CADS `exportName` from the manifest summary. `props` may only include declared prop names. Enum strings must match the documented unions. `children` may be a string or nested node array.
