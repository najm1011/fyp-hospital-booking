# Responsive Design Specifications

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## Breakpoint System

### Tailwind CSS Breakpoints

```
Mobile (Default):    0px - 639px    (No prefix)
Small (sm):          640px+         (sm:)
Medium (md):         768px+         (md:)
Large (lg):          1024px+        (lg:)
Extra Large (xl):    1280px+        (xl:)
2X Large (2xl):      1536px+        (2xl:)
```

### Project Breakpoints

We use 3 main responsive layouts:

```
┌─────────────────────────────────────────────────┐
│  Mobile        Tablet        Desktop            │
│  320-767px     768-1023px    1024px+            │
│  ───────       ───────       ────────           │
│  • Stack       • Hybrid      • Full             │
│  • Bottom Nav  • Sidebar*    • Sidebar          │
│  • Full Width  • 2-column    • 3-column         │
└─────────────────────────────────────────────────┘

* Tablet sidebar is collapsible
```

---

## Mobile Design (< 768px)

### Layout Principles

1. **Single Column:** All content stacks vertically
2. **Touch Targets:** Minimum 44x44px for all interactive elements
3. **Bottom Navigation:** Primary navigation at bottom (thumb-friendly)
4. **Full-Screen Modals:** Forms and dialogs use full viewport
5. **Collapsible Sections:** Accordions for long content

### Mobile Header

```
┌─────────────────────────────────┐
│  [☰]        Logo        [🔔] [👤]│
└─────────────────────────────────┘
```

**Height:** 64px
**Position:** Sticky top
**Elements:**
- Hamburger menu (left)
- Logo/branding (center)
- Notifications + Profile (right)

**Tailwind:**
```jsx
<header className="sticky top-0 z-30 bg-white border-b border-gray-200">
  <div className="flex items-center justify-between h-16 px-4">
    <button className="p-2">☰</button>
    <h1 className="font-bold">Hospital Booking</h1>
    <div className="flex gap-2">
      <button>🔔</button>
      <button>👤</button>
    </div>
  </div>
</header>
```

### Mobile Bottom Navigation

```
┌─────────────────────────────────┐
│  [🏠]  [📅]  [📋]  [⚙]  [👤] │
│  Home  Appts Hist  Set.  Prof.│
└─────────────────────────────────┘
```

**Height:** 64px
**Position:** Fixed bottom
**Max Items:** 5 icons

**Tailwind:**
```jsx
<nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
  <div className="grid grid-cols-5 h-16">
    {items.map(item => (
      <button className="flex flex-col items-center justify-center gap-1 text-xs">
        <span className="text-2xl">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

### Mobile Card Layout

```
┌─────────────────────────────────┐
│  Appointment Card               │
│  ───────────────────────────────│
│                                 │
│  Mon, Jan 15 • 09:00            │
│                                 │
│  [👨‍⚕️] Dr. Thompson             │
│  Cardiology                     │
│                                 │
│  Room 305                       │
│                                 │
│  ┌─────────┐ ┌───────────────┐ │
│  │Reschedule│ │Cancel       │ │
│  └─────────┘ └───────────────┘ │
└─────────────────────────────────┘
```

**Padding:** 16px (p-4)
**Margin:** 16px between cards
**Buttons:** Stack vertically or 2-column grid

### Mobile Form Layout

```
┌─────────────────────────────────┐
│  [< Back]  Login                │
├─────────────────────────────────┤
│                                 │
│  Welcome Back                   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email                     │  │
│  │ [                       ] │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password                  │  │
│  │ [                       ] │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] Remember me                │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Sign In              │  │
│  └───────────────────────────┘  │
│                                 │
│  Forgot password?               │
│  Don't have an account? Register│
│                                 │
└─────────────────────────────────┘
```

**Input Height:** 48px (minimum for touch)
**Button Height:** 48px
**Vertical Spacing:** 16px between fields

### Mobile Table (Responsive Cards)

Desktop tables convert to cards on mobile:

```
Desktop:
┌────┬──────────┬──────────┬────────┐
│ ID │ Name     │ Email    │ Status │
├────┼──────────┼──────────┼────────┤
│1001│Sarah Chen│sarah@... │ Active │
└────┴──────────┴──────────┴────────┘

Mobile:
┌─────────────────────────────────┐
│  Sarah Chen             #1001   │
│  sarah@example.com              │
│  Status: Active                 │
│  [Edit] [Delete]                │
└─────────────────────────────────┘
```

**Implementation:**
```jsx
{/* Desktop Table */}
<table className="hidden md:table">
  {/* ... */}
</table>

{/* Mobile Cards */}
<div className="md:hidden space-y-4">
  {items.map(item => (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Card content */}
    </div>
  ))}
</div>
```

---

## Tablet Design (768px - 1023px)

### Layout Principles

1. **Hybrid Layout:** Mix of mobile and desktop patterns
2. **Collapsible Sidebar:** Hamburger menu reveals sidebar
3. **2-Column Grids:** Side-by-side content where appropriate
4. **Larger Touch Targets:** 40x40px minimum

### Tablet Header with Sidebar

```
┌────────────────────────────────────────────────┐
│ [☰] Hospital Booking          [🔔2] Admin [▾] │
└────────────────────────────────────────────────┘
```

Hamburger opens overlay sidebar:

```
┌──────────┐ ┌──────────────────────────────────┐
│          │ │                                  │
│ 🏠 Dash  │ │  Dashboard Content               │
│ 📅 Appts │ │                                  │
│ 📋 Hist  │ │                                  │
│ ⚙  Set.  │ │                                  │
│ 🚪 Logout│ │                                  │
│          │ │                                  │
└──────────┘ └──────────────────────────────────┘
```

**Sidebar Width:** 240px
**Behavior:** Closes when clicking outside or selecting item

### Tablet Form Layout (2-Column)

```
┌────────────────────────────────────────────────┐
│  Register                                      │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────────────┐  ┌────────────────────┐  │
│  │ First Name      │  │ Last Name          │  │
│  │ [Sarah]         │  │ [Chen]             │  │
│  └─────────────────┘  └────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ Email                                    │  │
│  │ [sarah.chen@example.com]                 │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │          Create Account                  │  │
│  └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

**Tailwind:**
```jsx
<div className="grid md:grid-cols-2 gap-4">
  <div>
    <label>First Name</label>
    <input />
  </div>
  <div>
    <label>Last Name</label>
    <input />
  </div>
</div>
```

---

## Desktop Design (1024px+)

### Layout Principles

1. **Persistent Sidebar:** Always visible left navigation
2. **Multi-Column Grids:** 3-4 column layouts for dashboards
3. **Hover States:** Mouse interactions (hover menus, tooltips)
4. **Keyboard Shortcuts:** Support Ctrl/Cmd shortcuts

### Desktop Layout Structure

```
┌──────┬─────────────────────────────────────────────────┐
│      │  Header with breadcrumbs            [User ▾]   │
│      ├─────────────────────────────────────────────────┤
│      │                                                 │
│ Side │  Main Content Area                             │
│ bar  │                                                 │
│      │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ 240px│  │  Card 1  │ │  Card 2  │ │  Card 3  │        │
│      │  └──────────┘ └──────────┘ └──────────┘        │
│      │                                                 │
│      │  ┌────────────────────────────────────────┐    │
│      │  │  Large Content Card                   │    │
│      │  └────────────────────────────────────────┘    │
│      │                                                 │
└──────┴─────────────────────────────────────────────────┘
```

**Sidebar:** Fixed position, 240px width
**Content:** Flex-1 (takes remaining width)
**Max Width:** 1440px centered

**Tailwind:**
```jsx
<div className="lg:flex min-h-screen">
  {/* Sidebar */}
  <aside className="hidden lg:block w-60 bg-white border-r border-gray-200">
    {/* Navigation */}
  </aside>

  {/* Main Content */}
  <div className="flex-1">
    <header className="h-16 border-b border-gray-200">
      {/* Header */}
    </header>
    <main className="p-6 max-w-7xl mx-auto">
      {/* Content */}
    </main>
  </div>
</div>
```

### Desktop Dashboard Grid

```
┌────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Metric 1 │ │ Metric 2 │ │ Metric 3 │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                │
│  ┌─────────────────────┐ ┌─────────────────┐  │
│  │  Main Chart         │ │  Side Panel     │  │
│  │                     │ │                 │  │
│  │                     │ │                 │  │
│  └─────────────────────┘ └─────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Full Width Table                       │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Grid System:**
- 3-column for metric cards: `grid-cols-3`
- 2-column for chart + sidebar: `grid-cols-3` (col-span-2 + col-span-1)
- Full width for tables: `col-span-full`

**Tailwind:**
```jsx
<div className="grid lg:grid-cols-3 gap-6">
  {/* Metric Cards */}
  <div className="bg-white p-6 rounded-lg shadow">Metric 1</div>
  <div className="bg-white p-6 rounded-lg shadow">Metric 2</div>
  <div className="bg-white p-6 rounded-lg shadow">Metric 3</div>

  {/* Chart (2/3 width) */}
  <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">Chart</div>

  {/* Sidebar (1/3 width) */}
  <div className="bg-white p-6 rounded-lg shadow">Sidebar</div>

  {/* Full Width Table */}
  <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">Table</div>
</div>
```

---

## Responsive Patterns

### 1. Navigation Transformation

```
Mobile (< 768px):
- Bottom navigation bar
- Hamburger menu for secondary items

Tablet (768-1023px):
- Top header with hamburger
- Overlay sidebar

Desktop (1024px+):
- Persistent sidebar
- Top header with breadcrumbs
```

### 2. Form Layout Transformation

```
Mobile:
- Full width inputs (w-full)
- Stacked fields (flex-col)
- Large touch targets (h-12)

Tablet & Desktop:
- 2-column for short fields (grid-cols-2)
- Full width for email, password
- Smaller input height (h-10)
```

**Example:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="md:col-span-1">
    <input className="h-12 md:h-10" />
  </div>
  <div className="md:col-span-2">
    <input className="h-12 md:h-10" />
  </div>
</div>
```

### 3. Card Layout Transformation

```
Mobile:
- 1 column (grid-cols-1)
- Full width cards

Tablet:
- 2 columns (md:grid-cols-2)

Desktop:
- 3 columns (lg:grid-cols-3)
- 4 columns for smaller cards (xl:grid-cols-4)
```

**Example:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div className="bg-white p-4 rounded-lg shadow">
      {item.content}
    </div>
  ))}
</div>
```

### 4. Modal/Dialog Transformation

```
Mobile:
- Full screen modal (inset-0)
- Slide up animation
- Close button in header

Desktop:
- Centered modal (max-w-md, max-w-lg, max-w-2xl)
- Fade in animation
- Click outside to close
```

**Example:**
```jsx
<div className="
  fixed inset-0 md:inset-auto
  md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2
  w-full md:max-w-md
  h-full md:h-auto
  bg-white rounded-none md:rounded-lg
">
  Modal Content
</div>
```

### 5. Table Transformation

```
Mobile:
- Convert to cards
- Stack information vertically
- Actions at bottom

Desktop:
- Traditional table layout
- Sortable columns
- Actions in last column
```

---

## Spacing System

### Container Padding

```
Mobile:    px-4  (16px left/right)
Tablet:    px-6  (24px left/right)
Desktop:   px-8  (32px left/right)
```

### Vertical Spacing

```
Between sections:
Mobile:    space-y-6  (24px)
Desktop:   space-y-8  (32px)

Between cards:
Mobile:    gap-4  (16px)
Desktop:   gap-6  (24px)
```

### Typography Scaling

```
Headings scale up on larger screens:

<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Page Title
</h1>

<h2 className="text-xl md:text-2xl lg:text-3xl">
  Section Title
</h2>

<p className="text-base md:text-lg">
  Body text
</p>
```

---

## Touch vs Mouse Interactions

### Mobile (Touch)

```
✓ Large tap targets (44x44px minimum)
✓ Swipe gestures for dismissible elements
✓ Pull-to-refresh on lists
✓ No hover states (use :active)
✓ Avoid dropdowns (use native select or bottom sheets)
```

### Desktop (Mouse + Keyboard)

```
✓ Hover states on interactive elements
✓ Tooltips on icons
✓ Dropdown menus
✓ Keyboard shortcuts
✓ Right-click context menus
✓ Resize/drag interactions
```

---

## Image & Asset Optimization

### Responsive Images

```jsx
<img
  src="/images/doctor-sm.jpg"
  srcSet="
    /images/doctor-sm.jpg 320w,
    /images/doctor-md.jpg 768w,
    /images/doctor-lg.jpg 1024w
  "
  sizes="
    (max-width: 768px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Dr. Emily Thompson"
/>
```

### Icon Sizing

```
Mobile:    text-2xl (24px)
Desktop:   text-xl (20px)
```

---

## Performance Considerations

### Mobile Optimization

1. **Lazy Load Images:** Only load above-the-fold images initially
2. **Reduce Bundle Size:** Code split by route
3. **Minimize Reflows:** Use CSS transforms instead of top/left
4. **Touch Feedback:** Instant visual feedback on tap

### Desktop Optimization

1. **Preload Critical Assets:** Fonts, icons, hero images
2. **Cache Aggressively:** Service worker for offline support
3. **Optimize Large Tables:** Virtual scrolling for 100+ rows

---

## Testing Checklist

### Responsive Testing

- [ ] Test on actual devices (iPhone, Android, iPad)
- [ ] Test in Chrome DevTools device mode
- [ ] Test landscape and portrait orientations
- [ ] Test with system fonts at 150%, 200%
- [ ] Test with browser zoom at 125%, 150%
- [ ] Test on slow 3G connection
- [ ] Test with touch and mouse
- [ ] Test keyboard navigation on all breakpoints

### Breakpoint Testing

- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape / small laptop)
- [ ] 1440px (desktop)
- [ ] 1920px+ (large desktop)

---

## Common Responsive Patterns

### Hide/Show Elements

```jsx
{/* Show on mobile only */}
<div className="md:hidden">Mobile content</div>

{/* Show on desktop only */}
<div className="hidden md:block">Desktop content</div>

{/* Show on tablet and up */}
<div className="hidden md:block">Tablet+ content</div>
```

### Reorder Elements

```jsx
{/* Mobile: Image first, text second */}
{/* Desktop: Text first, image second */}
<div className="flex flex-col-reverse md:flex-row">
  <div className="md:w-1/2">Text content</div>
  <div className="md:w-1/2">Image</div>
</div>
```

### Conditional Rendering

```jsx
const isMobile = useMediaQuery('(max-width: 767px)');

{isMobile ? <MobileNav /> : <DesktopNav />}
```

---

## Accessibility Across Devices

### Mobile Accessibility

- Minimum 44x44px touch targets
- Support pinch-to-zoom (don't disable)
- Landscape mode support
- Voice control support

### Desktop Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- Skip navigation links
- ARIA landmarks for screen readers
- Focus visible indicators

---

## Summary

### Key Takeaways

1. **Mobile First:** Start with mobile design, enhance for larger screens
2. **Progressive Enhancement:** Add features as screen size increases
3. **Touch-Friendly:** Large targets, no hover-dependent interactions on mobile
4. **Flexible Grids:** Use Tailwind's responsive grid system
5. **Test Early:** Test on real devices throughout development

### Next Steps

1. Implement responsive layouts in React components
2. Test on multiple devices and browsers
3. Optimize performance for mobile networks
4. Gather user feedback from different device users

---

## Document Version

**Version:** 1.0
**Last Updated:** January 12, 2026
**Status:** Sprint 1 - Dev Task 10 Complete
