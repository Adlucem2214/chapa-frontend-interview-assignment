# Chapa Frontend Interview Assignment

A role-based dashboard Single Page Application (SPA) built for a fictional Payment Service Provider platform.

---

## Roles

The app supports three roles, selectable from the landing page:

| Role | Access |
|---|---|
| User  | Wallet balance, transaction history, payment initiation, transaction verification |
| Admin | User directory with activation toggles, payment summaries per user, bank directory |
| Super Admin | All Admin features + admin registration/revocation + system-wide stats + transfer verification |

---

## Chapa API Endpoints Used

This project integrates **4 Chapa API endpoints**, proxied through Next.js Route Handlers to keep the secret key server-side only.

### 1. Initialize Transaction
- **Chapa Endpoint**: `POST https://api.chapa.co/v1/transaction/initialize`
- **Internal Proxy**: `POST /api/chapa/initialize`
- **Where used**: User Dashboard — "Launch Checkout Session" button in the Make Payment form
- **What it does**: Returns a `checkout_url` where the payer completes the payment on Chapa's hosted checkout page

### 2. Verify Transaction
- **Chapa Endpoint**: `GET https://api.chapa.co/v1/transaction/verify/{tx_ref}`
- **Internal Proxy**: `GET /api/chapa/verify/[tx_ref]`
- **Where used**: User Dashboard — "Verify Transaction Status" panel
- **What it does**: Returns the current status (`success`, `pending`, `failed`) of any transaction by its reference string

### 3. Get Banks
- **Chapa Endpoint**: `GET https://api.chapa.co/v1/banks`
- **Internal Proxy**: `GET /api/chapa/banks`
- **Where used**: Admin Dashboard and Super Admin Dashboard — "Supported Financial Institutions" bank directory panel
- **What it does**: Returns the list of Ethiopian banks supported for settlement transfers

### 4. Verify Transfer
- **Chapa Endpoint**: `GET https://api.chapa.co/v1/transfers/verify/{ref}`
- **Internal Proxy**: `GET /api/chapa/transfer-verify/[ref]`
- **Where used**: Super Admin Dashboard — "Verify Settlement Transfer" panel
- **What it does**: Returns the current status and details of an outgoing bank settlement transfer

---

## Why a Server-Side Proxy?

All Chapa calls go through Next.js Route Handlers (`app/api/chapa/.../route.ts`) instead of being called directly from the browser. This keeps `CHAPA_SECRET_KEY` safely on the server — a visitor inspecting browser network traffic will only see calls to `localhost:3000/api/chapa/...` and never the actual secret.

---

## Running Locally

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/chapa-frontend-interview-assignment
cd chapa-frontend-assignment
npm install
```

### 2. Set up your API key

Create a `.env.local` file in the project root:

```env
CHAPA_SECRET_KEY=CHASECK_TEST-your_actual_test_key_here
```

Get your test key from the [Chapa Dashboard](https://dashboard.chapa.co/) under Settings > API Keys.


### 3. Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Testing the API Endpoints

### In the UI
1. Select **User** role from the landing page
2. Fill in the payment form and click **Launch Checkout Session** — this calls `/api/chapa/initialize`
3. Copy the `tx_ref` shown and paste it into the **Verify Transaction Status** panel — this calls `/api/chapa/verify/[tx_ref]`
4. Switch to **Admin** role — the **Bank Directory** panel automatically calls `/api/chapa/banks`
5. Switch to **Super Admin** role — enter any reference in **Verify Settlement Transfer** to call `/api/chapa/transfer-verify/[ref]`


---

## Mock Data & Simulation

Backend data is simulated without a real database:

- **Users and transactions** are stored in `services/mockData.ts` as in-memory arrays
- **API delays** are simulated using `async/await` with `mockApi.ts` wrappers that mimic database latency
- **Loading states** are handled throughout every component with skeleton placeholders
- **Error states** show inline error panels with retry buttons

---

## Folder Structure

```
chapa-frontend-assignment/
├── app/
│   ├── api/chapa/                # Server-side proxy route handlers
│   │   ├── initialize/route.ts
│   │   ├── verify/[tx_ref]/route.ts
│   │   ├── banks/route.ts
│   │   └── transfer-verify/[ref]/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx            # Shared sidebar + navbar wrapper
│   │   ├── user/page.tsx         # Merchant dashboard
│   │   ├── admin/page.tsx        # Admin dashboard
│   │   └── super-admin/page.tsx  # Super Admin dashboard
│   ├── globals.css               # CSS variables and Tailwind config
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Landing page with role picker
├── components/
│   ├── layout/                   # Sidebar, Navbar, RoleGuard
│   ├── ui/                       # Badge, Button, Card, Toggle, Skeleton
│   └── dashboard/                # WalletCard, TransactionList, TransactionForm,
│                                 # UserTable, UserPaymentsSummary, BankList,
│                                 # AdminForm, StatsPanel
├── context/
│   ├── AuthContext.tsx            # Role-based session management
│   └── ThemeContext.tsx           # Light/dark mode persistence
├── hooks/
│   ├── useAuth.ts
│   └── useTheme.ts
├── services/
│   ├── mockData.ts               # Seed data (users, transactions)
│   ├── mockApi.ts                # Simulated async API wrappers
│   └── chapaService.ts           # Client-side calls to /api/chapa/* proxy routes
└── types/
    └── index.ts                  # TypeScript interfaces (AppUser, Transaction, Bank)
```
