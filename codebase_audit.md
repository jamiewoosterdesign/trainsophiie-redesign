# Codebase Audit & Recommendations

## Overview
The application structure is generally healthy, following a feature-based organization (`features/views`, `features/wizards`) alongside a component library (`components/ui` for ShadCn). The app functions well as a high-fidelity prototype, but there are several areas where code duplication and architectural decisions should be addressed before a full developer handover.

## Findings & Recommendations

### 1. Code Duplication
**Issue:** "Vibe coding" has led to copy-pasted patterns across multiple view files.
- **Page Headers:** Every `*View.jsx` file implements its own header section (Title, Subtitle, Back Button, Action Buttons).
- **"Add New" Cards:** The standardized "Add New" card (dashed border, Plus icon, subtitle) is manually implemented in every single view grid.

**Recommendation:**
- Create a reusable `PageHeader` component.
- Create a reusable `AddResourceCard` component.
- **Benefit:** Reduces file size, ensures design consistency (if you change the header style later, it updates everywhere), and speeds up adding new pages.

### 2. Large File Size / Monolithic Logic
**Issue:** `src/features/wizards/WizardFormContent.jsx` is approximately 197kB.
- This file likely contains conditional logic for *all* different wizard types (services, staff, products, etc.) in one place.
- This makes maintenance difficult and increases the risk of side-effects when editing one wizard flow.

**Recommendation:**
- Continue the pattern seen with `WizardFormContent_Product.jsx` and `WizardFormContent_Department.jsx`.
- Split every wizard flow into its own dedicated file (e.g., `WizardContentService.jsx`, `WizardContentStaff.jsx`).
- Use `WizardFormContent.jsx` solely as a dispatcher/router to render the correct child component.

### 3. Logic & State Management
**Issue:** `MainLayout.jsx` contains significant business logic.
- It handles Voice Speech Recognition, global Voice Flow state, and Wizard Modal visibility.
- This "pollutes" the Layout component, which should primarily concern itself with structure (Sidebar + Content).

**Recommendation:**
- Extract voice logic into a custom hook (e.g., `useVoiceFlow`) or a Context Provider (`VoiceContext`).
- Extract Wizard state management into a `WizardContext`.
- **Benefit:** Makes `MainLayout` cleaner and allows other components to access voice/wizard state without prop-drilling through `Outlet context`.

### 4. Component Redundancy
**Issue:** Custom implementations exist where ShadCn components could be used.
- `MultiSelectDropdown.jsx`: Uses manual click-outside logic and state. ShadCn's `Popover` + `Command` (Combobox pattern) provides better accessibility (focus management, keyboard nav) out of the box.
- Hardcoded Colors/Styles: Tag colors and badge styles are often defined inside the View files (e.g., `getTagStyle` functions).

**Recommendation:**
- Replace `MultiSelectDropdown` with a standard ShadCn Combobox implementation.
- Centralize design tokens (colors, tag styles) into a `constants.js` or `theme.js` file, or strictly use Tailwind utility classes in a reusable `Tag` component.

### 5. Data & Mocking
**Issue:** `MOCK_DATA` arrays are defined inside each View component.
- While fine for a prototype, this makes the files longer and harder to read.

**Recommendation:**
- Move all mock data to a `src/data` or `src/mocks` directory.
- Import the data into the views.
- **Benefit:** clearly separates "View Logic" from "Data", making the eventual swap to real API calls much easier.

## Summary
The "vibe" is good, and the visual output is solid. The main tasks for handover are **Extraction** (headers, cards, mock data) and **Decomposition** (wizard logic). Implementing these changes will make the codebase professional, scalable, and much easier for a developer team to inherit.
