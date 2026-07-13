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

