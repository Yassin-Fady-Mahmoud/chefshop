# ChefShop - Member 1 (Core + Auth)

## How to use these files
Angular 17+ (standalone components, signals, new control flow).

```bash
ng new chefshop --standalone --routing --style=scss   # in a clean folder
# then copy the `src/` folder from this package over the generated src/ (replace app.*, styles.scss)
ng serve
```
`src/index.html` / `main.ts` from the generator work as-is (`bootstrapApplication(AppComponent, appConfig)`).
If your generated root is `App` (Angular 20+), either rename the class to `AppComponent` or change the import in `main.ts`.

## Demo accounts
| user | password | role |
|---|---|---|
| admin | admin123 | admin |
| accountant | acc123 | accountant |
| student | stud123 | student |

## For teammates
- Get the logged-in user anywhere: `inject(AuthService).user()` (signal) and `.role()`.
- Routes/guards are already wired in `app.routes.ts`. **Replace only the placeholder component** inside `features/<name>/`, keep its class name (`StoreComponent`, `FeesComponent`, `PayrollComponent`, `BudgetComponent`).
- Use `StorageService` for any storage (localStorage for data, never store raw card numbers).
- Shared look: CSS variables + `.btn`, `.card`, `.panel`, `.table-wrap` in `styles.scss`. Use `var(--primary)` etc. so dark mode works.
- Students should only see their own invoices in Fees: filter by `auth.user()!.username`.

## Storage decisions (for the report)
| Mechanism | What we store | Why |
|---|---|---|
| sessionStorage | logged-in session (no password data) | cleared on tab close = safer on shared lab PCs |
| localStorage | mock user DB (salted SHA-256 hashes), theme, cart | must persist between visits; large; never leaves the browser |
| cookies | remember-me username (14d), cookie consent (1y) | small, expire automatically, `SameSite=Strict` |

Security notes: passwords hashed with per-user salt via Web Crypto; only last 4 card digits kept; client-side auth is a mock until the backend milestone.

## Checklist vs. milestone
Home page · Signup (username, name, email, picture, password, card, preferences) · Login · Profile · navbar · guards (admin/accountant/student) · cookies + session + local storage · lazy loading (`loadComponent`) · responsive breakpoints (800px/700px) · fluid fonts · dark theme.
