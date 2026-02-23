# CoinX — Interview Prep

---

## How to Explain This Project

"So I built a crypto trading platform — think of it as a simpler version of Binance. The backend is Spring Boot, frontend is React. Users can sign up, browse live coin data (pulled from CoinGecko), buy and sell crypto, manage their wallet, and track their portfolio. I integrated Stripe and Razorpay for wallet top-ups. The whole thing is secured with JWT + optional 2FA. There's also an admin side where admins can approve or reject withdrawal requests. The main thing I focused on was getting the order flow right — when someone buys a coin, the wallet gets debited, the asset gets updated, a transaction log is created, and the order is marked as success — all in one atomic transaction. If anything fails, everything rolls back."

---

## Architecture at a Glance

```
React (Vite) ──Axios──▶ Spring Boot API ──JPA──▶ MySQL
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         CoinGecko      Stripe/Razorpay    Gemini AI
        (market data)    (payments)        (chatbot)
```

**Backend**: 12 controllers, 13 service interfaces, 17 entity models, JWT + Spring Security  
**Frontend**: 7 Redux slices, React Router, Axios with interceptors, Tailwind CSS

---

## 20 Questions & Answers

---

### Q1. How does authentication work?

It's JWT-based. User signs in → `AuthController` checks password using BCrypt → on success, `JwtProvider` builds a JWT with the user's email and roles as claims, signs it with HMAC-SHA, sets 24h expiry, and sends it back. Frontend stores it in Redux and attaches it to every Axios request via the Authorization header. On the backend, there's a `JwtTokenValidator` filter (added before BasicAuthenticationFilter) that intercepts all requests, parses the token, pulls out the email and roles, and sets the security context. No sessions on the server — completely stateless.

---

### Q2. How did you do Two-Factor Authentication?

It's email OTP based. When a user turns on 2FA, their `User` entity gets a `TwoFactorAuth` embedded object flagged as active. Next time they log in, instead of getting a JWT right away, the backend generates a 6-digit OTP, saves it in the `TwoFactorOTP` table along with a "deferred" JWT, and emails the OTP via Spring Mail. User submits the OTP to `/auth/verify-otp` — if it matches, they get the JWT. If it doesn't match or expires, login fails. Simple but effective, and doesn't need any third-party authenticator app.

---

### Q3. Walk me through the Spring Security config.

In `AppConfig.java` — I set session policy to `STATELESS` since we use JWT, not cookies. All `/api/**` routes require authentication, everything else (like `/auth/**`) is open. My custom `JwtTokenValidator` filter sits before `BasicAuthenticationFilter` in the chain. CSRF is disabled (makes sense for a stateless token-based API). CORS is configured to allow the React dev server origins (localhost:5173, 3000) plus the deployed Vercel URL. OAuth2 login is wired up with a custom `OAuth2SuccessHandler` that generates a JWT after Google login and redirects to the frontend with the token in the URL.

---

### Q4. How do you store passwords?

BCrypt, through Spring Security's `BCryptPasswordEncoder` (configured as a bean). When someone signs up, the raw password goes through `passwordEncoder.encode()` before hitting the database. During login, Spring's `DaoAuthenticationProvider` handles the comparison internally — BCrypt has a built-in salt, so each hash is unique even for the same password. If the DB gets compromised, attackers still can't reverse the hashes. Pretty standard stuff, but it works.

---

### Q5. How does the Google OAuth2 login flow work?

User clicks "Login with Google" → browser goes to `/login/oauth2/authorization/google` → Google shows consent screen → on approval, Google redirects back with an auth code → Spring Security exchanges it for an access token and fetches the user profile. My `OAuth2SuccessHandler` kicks in here — it checks if this email already exists in the DB. If not, it creates a new user. Then it generates a JWT and redirects back to the React app with the token as a query param. Frontend picks it up and stores it in Redux.

---

### Q6. Explain the BUY order flow.

Request comes in with coinId, quantity, and orderType=BUY. First, the service grabs the coin's current price. It creates an `OrderItem` (linking coin, quantity, buy price) and an `Order` (status: PENDING). Then it calls `walletService.payOrderPayment()` — this checks if the wallet has enough balance, deducts the amount, and logs a `WalletTransaction`. If balance is short, exception gets thrown and `@Transactional` rolls everything back. After payment goes through, order status flips to SUCCESS. Then `AssetService` either creates a new asset record or bumps the quantity on an existing one. Five DB writes, one transaction — all or nothing.

---

### Q7. How is SELL different from BUY?

BUY checks wallet balance; SELL checks if the user actually owns enough of that coin. `sellAsset()` looks up the asset via `findAssetByUserIdAndCoinId()`. If they have enough quantity, it creates the order, calls `walletService.payOrderPayment()` (which credits the wallet this time since it's a SELL), and decrements the asset quantity. There's a neat cleanup — if after selling, the remaining asset value drops below 1 (dust), it deletes the asset record entirely. If the user tries to sell more than they own, the order gets deleted and an exception is thrown.

---

### Q8. How do you keep data consistent during trades?

`@Transactional` on `buyAsset()`, `sellAsset()`, and `processOrder()`. One trade touches five things — order, order item, wallet balance, wallet transaction, and asset. If the wallet debit fails after the order is created, Spring rolls back the order creation too. MySQL's InnoDB handles the actual ACID guarantees underneath. Without this, you'd end up with orders marked SUCCESS but wallets not debited, which in a financial app would be a disaster.

---

### Q9. How does the wallet work?

Each user gets a `Wallet` (one-to-one with `User`) on signup. Balance is stored as `BigDecimal` — not `double`, because floating point math and money don't mix well. The wallet supports: pay for orders (BUY debits, SELL credits), top-up via Stripe/Razorpay, transfer to another user's wallet, and withdrawals. Every single mutation creates a `WalletTransaction` with the type, amount, purpose, and date — so there's a complete audit trail. Users can pull up their full transaction history from the `WalletTransactionService`.

---

### Q10. Tell me about the payment gateway integration.

I plugged in both Stripe and Razorpay. For Stripe — backend creates a Checkout Session via the Stripe Java SDK (amount, currency, success/cancel URLs), returns the session URL, frontend redirects user there. For Razorpay — backend creates an order via Razorpay SDK, returns the order ID, frontend opens the Razorpay widget. After user pays, the callback hits the backend, `PaymentController` verifies the status, and on success calls `walletService.addBalanceToWallet()`. Having two gateways is nice because if one has issues, users have a fallback.

---

### Q11. Describe the backend architecture.

Standard 3-layer. Controllers handle HTTP (request mapping, validation, response) — no business logic here. Services hold all the logic (order rules, wallet checks, payment orchestration). Repositories are Spring Data JPA interfaces — just declare methods and JPA generates the queries. All services are coded to interfaces (e.g., `OrderService` → `OrderServiceImplementation`) so things stay loosely coupled. Dependencies go one way: Controller → Service → Repository. If I need to change how orders work, I only touch the service layer.

---

### Q12. How do you manage frontend state?

Redux with 7 slices — Auth, Coin, Order, Wallet, Watchlist, Withdrawal, Assets. Each slice uses `createAsyncThunk` for API calls, which gives me pending/fulfilled/rejected states for free. The JWT lives in the Auth slice. I set up an Axios interceptor that grabs the token from Redux and sticks it in the Authorization header for every request. There's also a response interceptor — if a 401 comes back, it tries to refresh the token automatically before retrying the request. React Router handles routing with protected routes that check auth state.

---

### Q13. How do frontend and backend talk to each other?

Axios. I have a central instance in `api.js` with the base URL pointing to the Spring Boot server. Request interceptor attaches JWT, response interceptor handles 401s with auto-refresh. All API calls go through Redux thunks — `fetchCoinList`, `placeOrder`, `getWalletBalance`, etc. Backend returns JSON, thunks dispatch the response to reducers, reducers update the store, connected components re-render. Pretty standard React-Redux data flow, nothing fancy.

---

### Q14. Why this tech stack?

Spring Boot because it gives you a lot out of the box — embedded Tomcat, auto-config, Spring Security, JPA, and good library support for Stripe/Razorpay SDKs. Java's typing catches bugs at compile time which matters when you're dealing with money. React for the component model and ecosystem. Redux because a trading app has a lot of interconnected state — wallet balance, order status, portfolio — and you need one source of truth. Vite for fast dev server. MySQL because I need real transactions (ACID) for financial operations — NoSQL wouldn't cut it here. Tailwind because I didn't want to maintain separate CSS files.

---

### Q15. How did you handle CORS?

In `AppConfig.java`. React runs on port 5173, backend on 5454 — different origins, so browsers block requests by default. I set up a `CorsConfigurationSource` that whitelists localhost:3000, 5173, 5174, 4200, and the Vercel deployment URL. All methods and headers are allowed, credentials are set to true (so the Authorization header gets sent), and the Authorization header is explicitly exposed in the response. `maxAge` is 3600 seconds so the browser caches preflight responses instead of sending OPTIONS before every request.

---

### Q16. Explain the database design.

17 tables, all revolving around `User`. One-to-one with `Wallet`, `Watchlist`, and `PaymentDetails`. One-to-many with `Order`, `Asset`, `Withdrawal`, `PaymentOrder`, `VerificationCode`, etc. `Order` has a one-to-one `OrderItem`, and `OrderItem` points to a `Coin`. `Asset` also references `Coin`. I embedded `TwoFactorAuth` inside `User` using `@Embeddable` since it's just a couple of fields, not worth a separate table. Money fields use `BigDecimal`, timestamps use `LocalDateTime`. All IDs are auto-increment BIGINT.

---

### Q17. How do you handle data initialization?

JPA's `ddl-auto=update` handles schema creation — it checks the entity classes and creates/alters tables as needed. There's a `DataInitializationComponent` (Spring `@Component`) that seeds essential data on startup. For a production setup, I'd switch to Flyway for proper migration versioning. The database runs InnoDB which gives row-level locking and proper transaction support.

---

### Q18. How do you handle coin market data?

`CoinServiceImpl` hits the CoinGecko API for live coin data — listing with pagination, individual coin details, search, trending, and chart data for different time ranges. The data gets stored/cached in the `Coin` entity. When an order is placed, the coin's price at that exact moment gets captured in the `OrderItem` as `buyPrice` or `sellPrice`. This is important because crypto prices move fast — the portfolio needs to know what price you actually traded at, not the current price.

---

### Q19. What were the biggest challenges?

Transaction consistency was the trickiest part. A BUY order modifies five tables — if the wallet update fails after the order is already created, you're in trouble. `@Transactional` solved that, but I had to be careful about where I placed it and making sure exceptions actually propagate up to trigger rollback. CORS was annoying to debug initially — the Authorization header wasn't coming through until I explicitly added it to exposed headers. Integrating two payment gateways with completely different APIs and callback flows took some work too — I ended up abstracting the payment logic so the wallet service doesn't care which gateway was used.

---

### Q20. How would you scale this for production?

Since it's stateless (JWT, no sessions), I can run multiple backend instances behind a load balancer right away. I'd add Redis for caching coin prices and user profiles — those get hit a lot. For order processing, a message queue like RabbitMQ would help handle bursts without blocking. MySQL read replicas would split the load between reads (browsing coins, viewing portfolio) and writes (placing orders). Docker + Kubernetes for deployment. GitHub Actions for CI/CD. Spring Boot Actuator + Prometheus + Grafana for monitoring. On security, I'd add Stripe webhook signature verification, rate limiting on `/auth` endpoints, and proper audit logging.

---

## Quick Reminders Before the Interview

- Lead with the project overview, then dive into specifics when asked
- The order flow (BUY/SELL) is the most interesting part — know it cold
- Be ready to draw: User → React → Axios → JWT Filter → Controller → Service → Repository → MySQL
- If asked "what would you improve" — mention caching, message queues, proper CI/CD, and webhook validation
- Numbers to remember: 12 controllers, 17 entities, 7 Redux slices, 4 external APIs
