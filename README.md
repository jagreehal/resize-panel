# Resize Panel Web Component

![Resize Panel Demo](resize-panel.gif)

A lightweight, customisable web component that creates resizable panels with real-time dimension display.

Perfect for creating adjustable containers, preview windows, and interactive content areas in your web applications.

## Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Common Use Cases](#common-use-cases)
- [Framework Integration](#framework-integration)
- [Styling Guide](#styling-guide)
- [API Reference](#api-reference)
- [Browser Support](#browser-support)

## Introduction

The Resize Panel component offers:

- 🔄 Resizable containers with live dimension display
- 🎨 Light and dark theme support
- 📱 Responsive design capabilities
- 🖼️ Iframe support with loading states
- ⚙️ Comprehensive customisation options
- 🎯 Event handling for resize actions

## Installation

### Via NPM

```bash
npm install resize-panel
```

### Via CDN

```html
<script
  type="module"
  src="https://unpkg.com/resize-panel@1.0.0/resize-panel.js"
></script>
```

## Basic Usage

### Simple Panel

```html
<resize-panel>
  <div>Drag the bottom-right corner to resize me!</div>
</resize-panel>
```

### Custom Dimensions

```html
<script
  type="module"
  src="https://unpkg.com/resize-panel@1.0.0/resize-panel.js"
></script>
<body>
  <resize-panel
    src="https://play.tailwindcss.com/14A0mqZ9m8?layout=preview"
    w="40rem"
    h="30rem"
  >
  </resize-panel>
</body>
```

## Common Use Cases

### Content Viewer

```html
<resize-panel
  w="40rem"
  h="25rem"
  min-w="20rem"
  data-display-position="top-right"
>
  <div class="content-wrapper">
    <h2>Article Preview</h2>
    <article>
      <p>Your content here...</p>
    </article>
  </div>
</resize-panel>
```

### Website Preview Panel

```html
<resize-panel
  src="https://example.com"
  w="50rem"
  h="30rem"
  min-w="25rem"
  min-h="15rem"
  data-display-position="bottom-right"
>
</resize-panel>
```

### Image Gallery Panel

```html
<resize-panel
  w="35rem"
  h="25rem"
  data-theme="dark"
  data-display-position="bottom-left"
>
  <div style="padding: 1rem;">
    <img
      src="gallery-image.jpg"
      alt="Gallery Image"
      style="max-width: 100%; height: auto;"
    />
    <div class="caption">Image Caption</div>
  </div>
</resize-panel>
```

### Code Editor Setup

```html
<resize-panel w="40rem" h="30rem" data-theme="dark">
  <div class="editor-container">
    <textarea
      style="width: 100%; 
                   height: 100%; 
                   background: #1e1e1e; 
                   color: #fff; 
                   font-family: monospace; 
                   padding: 1rem;"
    >
function greet(name) {
    return `Hello, ${name}!`;
}
        </textarea
    >
  </div>
</resize-panel>
```

## Framework Integration

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import 'resize-panel';

function ResizableEditor() {
  const panelRef = useRef(null);

  useEffect(() => {
    // Initial size setup
    panelRef.current?.resizeTo('35rem', '25rem');
  }, []);

  const handleResize = (e) => {
    const { width, height } = e.detail;
    console.log(`Editor resized to ${width} × ${height}`);
  };

  return (
    <resize-panel
      ref={panelRef}
      w="30rem"
      h="20rem"
      data-theme="dark"
      onResize={handleResize}
    >
      <div className="editor-content">
        <h3>React Editor</h3>
        <textarea />
      </div>
    </resize-panel>
  );
}
```

### Vue Integration

```vue
<template>
  <div class="editor-wrapper">
    <resize-panel w="30rem" h="20rem" @resize="handleResize" data-theme="dark">
      <div class="editor-content">
        <h3>Vue Editor</h3>
        <textarea v-model="content" />
      </div>
    </resize-panel>
  </div>
</template>

<script>
import 'resize-panel';

export default {
  name: 'ResizableEditor',
  data() {
    return {
      content: '',
    };
  },
  methods: {
    handleResize(e) {
      const { width, height } = e.detail;
      console.log(`Editor resized to ${width} × ${height}`);
    },
  },
};
</script>
```

## Styling Guide

### Custom Theme Example

```css
resize-panel {
  /* Light theme */
  --resize-panel-bg: #ffffff;
  --resize-panel-border: #e2e8f0;
  --resize-panel-text: #1a202c;
  --resize-panel-shadow: rgba(0, 0, 0, 0.1);
  --resize-panel-resize-bg: rgba(0, 0, 0, 0.8);
  --resize-panel-resize-text: #ffffff;
}

/* Dark theme override */
resize-panel[data-theme='dark'] {
  --resize-panel-bg: #1a202c;
  --resize-panel-border: #2d3748;
  --resize-panel-text: #f7fafc;
  --resize-panel-shadow: rgba(0, 0, 0, 0.4);
  --resize-panel-resize-bg: rgba(255, 255, 255, 0.9);
  --resize-panel-resize-text: #000000;
}
```

### Responsive Layout Example

```html
<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }
</style>

<div class="dashboard-grid">
  <resize-panel w="100%" h="20rem">
    <div>Dashboard Panel 1</div>
  </resize-panel>
  <resize-panel w="100%" h="20rem" data-theme="dark">
    <div>Dashboard Panel 2</div>
  </resize-panel>
</div>
```

## API Reference

### Attributes

| Attribute               | Default     | Description                   |
| ----------------------- | ----------- | ----------------------------- |
| `w`                     | `19rem`     | Panel width                   |
| `h`                     | `12.5rem`   | Panel height                  |
| `src`                   | `null`      | URL for iframe content        |
| `min-w`                 | `12.5rem`   | Minimum width constraint      |
| `max-w`                 | `100%`      | Maximum width constraint      |
| `min-h`                 | `9.375rem`  | Minimum height constraint     |
| `max-h`                 | `100%`      | Maximum height constraint     |
| `data-theme`            | `light`     | Visual theme (`light`/`dark`) |
| `data-display-position` | `top-right` | Position of size display      |

### Events

```javascript
// Monitor size changes
const panel = document.querySelector('resize-panel');
panel.addEventListener('resize', (e) => {
  const { width, height } = e.detail;
  console.log(`Panel dimensions: ${width} × ${height}`);
});
```

### Methods

```javascript
const panel = document.querySelector('resize-panel');

// Change size programmatically
panel.resizeTo('40rem', '30rem');

// Get current dimensions
const currentWidth = panel.width;
const currentHeight = panel.height;
```

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+

## Licence

MIT

---

For issues, feature requests, or contributions, please visit our [GitHub repository](https://github.com/jagreehal/resize-panel).
