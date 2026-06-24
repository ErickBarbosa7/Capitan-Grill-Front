# Capitan Grill — Project Context

## Architecture

### Frontend (`capitan-grill-f`)
- **Framework:** React + Vite (SPA)
- **Routing:** react-router-dom v6 with nested routes
- **State:** React hooks (useState, useMemo, useCallback) — no global store
- **API calls:** Custom `api` utility in `src/services/api.js`
- **i18n:** react-i18next (es/en)
- **UI icons:** lucide-react
- **Charts:** recharts (Dashboard only)
- **Toasts:** react-toastify
- **Auth:** JWT stored in localStorage, context in `AuthContext`

### Backend (`capitan-grill-b`)
- **Framework:** Express.js
- **ORM:** Prisma 7.x with `@prisma/adapter-pg` (PostgreSQL)
- **Database:** PostgreSQL (`cap_grill`)
- **Auth:** JWT (simple password, no hashing in dev)
- **Default admin:** `admin@capitan.com` / `admin123`

## Admin Routes

| Path | Component | Purpose |
|---|---|---|
| `/admin` | Dashboard | Stats, charts (Inicio) |
| `/admin/menu` | MenuTable | List items, filters, CRUD |
| `/admin/menu/nuevo` | EditItemPage | Create new item |
| `/admin/menu/editar/:code` | EditItemPage | Edit existing item |

## Data Model

### Category
| Field | Prisma | Map |
|---|---|---|
| id | Int (PK) | — |
| slug | String (unique) | — |
| nameEs | String | `name_es` |
| nameEn | String | `name_en` |
| sortOrder | Int | `sort_order` |
| isActive | Boolean (default true) | `is_active` |
| createdAt | DateTime | `created_at` |

### MenuItem
| Field | Prisma | Map |
|---|---|---|
| id | Int (PK) | — |
| categoryId | Int? (FK → Category, onDelete: SetNull) | `category_id` |
| code | String? (unique) | — |
| nameEs | String | `name_es` |
| nameEn | String | `name_en` |
| descriptionEs | String? | `description_es` |
| descriptionEn | String? | `description_en` |
| price | Decimal(10,2) | — |
| isAvailable | Boolean (default true) | `is_available` |
| isActive | Boolean (default true) | `is_active` |
| createdAt | DateTime | `created_at` |
| updatedAt | DateTime | `updated_at` |
| images | MenuItemImage[] | — |

### Item States
- `isActive=true, isAvailable=true` → **Activo** (visible, active)
- `isActive=true, isAvailable=false` → **Oculto** (hidden)
- `isActive=false` → **Eliminado** (soft-deleted)

## API Endpoints (Backend)

### Menu Items (`/api/menu`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | List items (add `?includeInactive=true` for all) |
| GET | `/:id` | Get by ID |
| POST | `/` | Create item |
| PUT | `/:id` | Update item |
| PATCH | `/:id/toggle` | Toggle `isAvailable` |
| PATCH | `/:id/restore` | Restore (set `isActive=true, isAvailable=true`) |
| DELETE | `/:id` | Soft delete (set `isActive=false`) |

### Categories (`/api/categories`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | List (add `?includeInactive=true` for all) |
| GET | `/:id` | Get by ID |
| POST | `/` | Create |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Soft delete (set `isActive=false`) |
| PATCH | `/:id/restore` | Restore |

## Frontend Architecture

### `src/hooks/useMenu.js` — Core data hook
- Fetches all categories + items (both with `includeInactive=true`)
- Transforms raw API data into frontend-friendly shape:
  - Categories: `{ id: slug, backendId, nombre, isActive, items[] }`
  - Items: `{ id: code, backendId, nombre, descripcion, precio, disponible, isActive }`
- Provides CRUD mutations: `createItem`, `updateItem`, `deleteItem`, `toggleAvailability`, `restoreItem`, `createCategory`, `updateCategory`, `deleteCategory`, `restoreCategory`
- Uses `itemMap` (code → backend id) and `categoryMap` (slug → backend id) for mapping

### `src/services/menuService.js` — API service layer
- Thin wrappers around `api.get/post/put/patch/delete`
- `getMenuItems(includeInactive)` and `getCategories(includeInactive)` accept boolean

### `src/components/admin/CategoryDropdown.jsx` — Reusable dropdown
- Props: `categories`, `value`, `onChange`, `onCreate`, `onUpdate`, `onDelete`, `onRestore`, `readOnly`
- Modes:
  - **Normal** (edit page): shows categories with rename/delete actions, add button
  - **readOnly** (filter bar): hides actions — except for inactive categories (`isActive=false`), which show a `RotateCcw` restore icon via `onRestore`
- Prevents default form submission on Enter key

### `src/components/admin/CategoryDropdown.module.css`
- Trigger: flex row, 10px border-radius, 0.85rem font
- Menu: absolute dropdown with z-index 50

### `src/pages/MenuTable.jsx` — Item list + filters
- **Filter bar:** Search input + CategoryDropdown (categories filter) + CategoryDropdown (status filter) + clear button
- **Category filter:** All categories (including deleted). Prepend "Todas las categorías" option (`id: ''`). `onRestore` for deleted categories.
- **Status filter:** Todos (default) / Activos / Ocultos / Eliminados
- **Table rows:**
  - Normal: `isActive=true, isAvailable=true` — default style
  - Oculto: `isActive=true, isAvailable=false` — `.trDisabled` (opacity 0.55)
  - Eliminado: `isActive=false` — `.trDeleted` (red tint), strikethrough name, gray "ELIMINADO" pill, single restore button
- **Delete confirmation:** Modal overlay with cancel/confirm
- **Clear filters:** `XCircle` button, visible when any filter is active

### `src/pages/MenuTable.module.css`
- Heading: serif, italic, 2.4rem
- Category badges: pill-shaped (20px radius), gold bg
- Status pills: 20px radius, green/red/gray variants
- Deleted rows: red background tint
- Filter elements: 10px radius, matching heights

### `src/pages/EditItemPage.jsx` — Create/Edit form
- Detects mode: `isNew = !code` (route `/nuevo` or `/editar/:code`)
- Generates auto-code (`n01`, `n02`, …) for new items
- Two-column layout: form + preview column (image placeholder + AI card)
- Language tabs (es/en) for name + description
- **Toggle switch** for disponible (iOS-style: track + sliding knob, green/gray)
- CategoryDropdown with `onCreate`, `onUpdate`, `onDelete`
- On submit: calls `createItem` or `updateItem`, then navigates to `/admin/menu`

### `src/App.jsx`
- ToastContainer: top-right, dark theme, black bg (`#2C2A29`), gold border (`#C9A87C`), success icon tint (`--toastify-color-success: #C9A87C`)

### `src/pages/Dashboard.jsx`
- Stats cards: total items, categories, agotados
- Charts: bar chart (prices), pie chart (items per category)
- Heading: serif, italic, 2.4rem

## Design Tokens
- **Primary gold:** `#C9A87C`
- **Dark bg:** `#2C2A29`
- **Cream text:** `#F7F5F0`
- **Green (visible):** `#3A5A40`
- **Red (hidden/delete):** `#DC2626`
- **Gray (deleted):** `#6B7280`
- **Font heading:** `var(--font-heading)` (Bricolage Grotesque)
- **Font body:** `var(--font-body)` (Inter)
- **Font serif:** `var(--font-serif)` (Playfair Display)

## Common Gotchas
- Category operations use **slug** (string) as external ID in the frontend, but the hook internally maps slug → integer backend ID
- Item operations use **code** (string) as external ID, mapped to integer backend ID
- Both categories and items now use soft delete (`isActive=false`) with restore endpoints
- `e.preventDefault()` is required on Enter keydown inside CategoryDropdown inputs (they sit inside a `<form>`)
- Backend Prisma client needs `npx prisma generate` after schema changes + server restart
- Seed: `npx prisma db seed` resets all data (admin, 3 categories, 10 items)
