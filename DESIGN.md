---
name: Inventory Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

The design system is engineered for a high-performance SaaS environment where clarity and operational speed are paramount. It adopts a **Minimalist Modern** aesthetic, characterized by generous whitespace, a restricted but purposeful color palette, and high-quality typography. 

The goal is to reduce the cognitive load inherent in inventory management by using "soft" visual cues—such as subtle shadows and rounded corners—to make dense data feel approachable. The emotional response should be one of calm control; the UI recedes to let the user's data take center stage, echoing the functional elegance found in developer-centric tools like Linear and the refined clarity of Notion.

## Colors

The palette is anchored by **Deep Navy** (`#0F172A`) for primary actions and core branding, providing a stable, professional foundation. **Slate Blue** acts as a secondary bridge for interactive elements and iconography. 

The background utilizes a "Crisp White" canvas with "Soft Light Gray" layers to create logical separation without relying on heavy lines. Semantic colors for inventory statuses (Stocked, Low Stock, Out of Stock) are slightly desaturated to maintain the professional tone while ensuring instant recognition.

## Typography

This design system utilizes **Inter** as the primary typeface for its exceptional legibility and systematic feel. A clear hierarchy is established by varying weights rather than drastic size changes, keeping the interface compact.

For data-heavy contexts, such as SKU numbers, stock counts, and prices, **JetBrains Mono** is introduced as a secondary font. This monospaced addition ensures that columns of numbers align perfectly, aiding in rapid scanning and visual comparison within tables.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. The main navigation sidebar is fixed, while the primary content area expands to a maximum width of 1440px to prevent data tables from becoming unreadable on ultra-wide monitors. 

A strict 4px linear scale governs all padding and margins. For high-density data views, use `sm` (8px) padding within table cells. For marketing dashboards and "empty state" cards, use `lg` (24px) or `xl` (40px) to provide breathing room and emphasize a premium feel.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** supplemented by **Ambient Shadows**. Instead of heavy borders, the system uses a 1px "subtle border" (`#E2E8F0`) combined with a soft, multi-layered shadow to lift elements off the page.

1.  **Level 0 (Canvas):** Pure white background.
2.  **Level 1 (Cards/Tables):** Subtle border with a 4px blur, 2% opacity black shadow.
3.  **Level 2 (Dropdowns/Modals):** Subtle border with a 12px blur, 8% opacity navy-tinted shadow.

This approach creates a sense of depth that feels natural and modern, avoiding the flatness of traditional enterprise software without the visual clutter of skeuomorphism.

## Shapes

The design system uses a **Rounded** shape language to soften the "industrial" nature of inventory management. The base border radius is set to **12px** for cards and primary containers. 

Smaller interactive elements like buttons and input fields use a slightly tighter **8px** radius to maintain a sense of precision. Status badges and chips should be fully pill-shaped (rounded-full) to distinguish them from clickable buttons.

## Components

### High-Density Data Tables
Tables are the workhorse of this system. They should feature:
*   **Sticky Headers:** To maintain context during long scrolls.
*   **Row Hover States:** A subtle background shift to `#F8FAFC`.
*   **Inline Actions:** Ghost buttons that appear on hover to reduce visual noise.

### Status Badges
Badges use a "Soft Fill" style: a light tinted background with high-contrast text. For example, a "Success" badge uses a 10% opacity green background with a 100% opacity green text.

### Functional Cards
Cards should be used for summary statistics and high-level SKU overviews. They feature a 12px border radius and a 1px border. Titles should be in `label-caps` typography to provide a clear entry point.

### Input Fields
Inputs use an 8px radius and a subtle 1px border. On focus, the border transitions to the primary navy color with a 3px soft blue outer glow (ring) to provide clear feedback.

### Navigation
The sidebar navigation utilizes "Active Indicators"—a vertical navy line on the left side of the active link—to ensure the user never loses their place in the application hierarchy.