# 📈 CoinX — Interview Preparation Guide

---

## 🎯 About the Project (How to Explain in an Interview)

> **"CoinX is a full-stack cryptocurrency trading platform I built using Spring Boot and React. It simulates a real exchange like Binance where users can sign up, browse live coin markets via CoinGecko API, buy and sell crypto, manage a wallet, and track their portfolio. The backend is a layered Spring Boot REST API secured with JWT authentication, Spring Security, and optional two-factor authentication. For payments, I integrated both Stripe and Razorpay gateways. The frontend is a React SPA with Redux for state management and Tailwind CSS for styling. The platform also has an admin panel where administrators can approve or decline user withdrawal requests. Altogether, it covers authentication, authorization, real-time market data, order processing, wallet management, payment integration, and admin governance — giving me hands-on experience across security, API design, transactional business logic, and external service integration."**

---

## 🏗️ Project Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                         │
│  React Router │ Redux Store │ Axios │ Tailwind CSS │ Radix UI        │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ REST API (JSON over HTTPS)
┌─────────────────────────────▼────────────────────────────────────────┐
│                   SPRING BOOT BACKEND (:5454)                        │
│                                                                      │
│  ┌─────────────┐   ┌──────────────────┐   ┌──────────────────────┐  │
│  │ JWT Filter   │──▶│  12 Controllers  │──▶│  13 Service Interfaces│  │
│  │ (Security)   │   │  (REST Endpoints)│   │  16 Implementations   │  │
│  └─────────────┘   └──────────────────┘   └──────────┬───────────┘  │
│                                                       │              │
│                     ┌─────────────────────────────────▼──────────┐   │
│                     │  JPA Repositories  →  MySQL Database       │   │
│                     │  (17 Entity Models)                        │   │
│                     └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼─────────────────────┐
         ▼                    ▼                     ▼
   ┌──────────┐      ┌──────────────┐      ┌──────────────┐
   │ CoinGecko│      │Stripe/Razorpay│      │ Gemini AI    │
   │ (Market) │      │ (Payments)    │      │ (Chatbot)    │
   └──────────┘      └──────────────┘      └──────────────┘
```

### Key Technical Numbers
| Component | Count |
|---|---|
| REST Controllers | 12 (Auth, Coin, Order, Wallet, Watchlist, Withdrawal, Payment, User, etc.) |
| Service Interfaces | 13 |
| Service Implementations | 16 (includes EmailService, DataInitializationComponent) |
| Entity Models | 17 (User, Wallet, Order, OrderItem, Coin, Asset, Withdrawal, etc.) |
| Config Classes | 5 (AppConfig, JwtProvider, JwtTokenValidator, JwtConstant, OAuth2SuccessHandler) |
| Redux Slices | 7 (Auth, Coin, Order, Wallet, Watchlist, Withdrawal, Assets) |
| External Integrations | 4 (CoinGecko, Stripe, Razorpay, Gemini AI) |

### Key Modules Explained

| Module | What It Does |
|---|---|
| **Authentication** | Signup, signin, JWT token issuance, 2FA via OTP email, OAuth2 Google login, password reset |
| **Coin/Market** | Fetches live coin data from CoinGecko API — listing, search, trending, charts |
| **Order Processing** | BUY/SELL order lifecycle — validates wallet balance or asset quantity, creates order, updates wallet & asset atomically using `@Transactional` |
| **Wallet** | Stores user balance, supports top-up (via Stripe/Razorpay), wallet-to-wallet transfer, withdrawal requests, and full transaction history |
| **Withdrawal** | User creates withdrawal request → status set to PENDING → Admin approves/declines → wallet balance adjusted accordingly |
| **Watchlist** | Users can add/remove coins to a personal watchlist for quick tracking |
| **Chatbot** | AI-powered coin query assistance using Google Gemini API |

---

## 📋 20 Interview Questions & Answers

---

### 🔐 Security & Authentication (Q1–Q5)

---

**Q1. How does authentication work in your project?**

I use stateless JWT-based authentication. When a user signs in, the `AuthController` validates credentials using Spring Security's `AuthenticationManager` and BCrypt password comparison. On success, `JwtProvider.generateToken()` creates a JWT token with claims for the user's email and authorities, signed with an HMAC-SHA key, and sets a 24-hour expiration. This token is returned to the frontend and stored in Redux. For every subsequent API call, the React app sends this token in the `Authorization` header. On the backend, `JwtTokenValidator` — a custom `OncePerRequestFilter` added before `BasicAuthenticationFilter` in the security chain — intercepts every request, extracts and verifies the JWT, loads the user's email and roles from the claims, and sets a `UsernamePasswordAuthenticationToken` in the `SecurityContextHolder`. This makes the session completely stateless — no server-side session storage is needed, which improves horizontal scalability.

---

**Q2. How did you implement Two-Factor Authentication (2FA)?**

2FA is implemented as an optional security layer using email-based OTP. When a user enables 2FA from their profile, the `TwoFactorAuth` embedded object in the `User` entity is updated to mark 2FA as active. During login, if 2FA is enabled, the initial signin does not return a final JWT. Instead, it generates a random 6-digit OTP, stores it in the `TwoFactorOTP` entity along with a deferred JWT, and sends the OTP to the user's email via the `EmailService` (using Spring Mail with SMTP). The user then submits the OTP to `/auth/verify-otp`, which checks the OTP against the stored record. If valid, the deferred JWT is returned, completing the login. This adds a second factor without requiring a third-party authenticator app — it uses the email channel the user already verified.

---

**Q3. How does Spring Security filter chain work in your application?**

In `AppConfig.java`, I configure the `SecurityFilterChain` bean. The session policy is set to `STATELESS` since I use JWT. I define authorization rules where all `/api/**` endpoints require authentication, while other endpoints (like `/auth/**`) are permitted for all. I add my custom `JwtTokenValidator` filter before `BasicAuthenticationFilter` in the chain using `addFilterBefore()`. CSRF is disabled because the app is stateless and uses token-based auth instead of cookies. For CORS, I configure allowed origins (localhost:3000, 5173, 5174, and the deployed Vercel URL), allow all methods and headers, expose the `Authorization` header, and set credentials to true. I also integrate OAuth2 login with a custom `OAuth2SuccessHandler` that generates a JWT after successful Google authentication and redirects the user to the frontend with the token.

---

**Q4. How do you handle password security?**

Passwords are never stored in plain text. I use BCrypt hashing via Spring Security's `BCryptPasswordEncoder`, which is configured as a `@Bean` in `AppConfig`. When a user signs up, the raw password is encoded using `passwordEncoder.encode()` before persisting to the database. During login, Spring Security's `DaoAuthenticationProvider` automatically compares the submitted password with the stored hash using BCrypt's built-in `matches()` method, which handles the salt comparison internally. BCrypt is a one-way adaptive hash function — it includes a built-in salt and a configurable work factor, making brute-force attacks computationally expensive. Even if the database is compromised, the passwords remain protected because BCrypt hashes are irreversible.

---

**Q5. How does OAuth2 Google Login work in your project?**

I configured OAuth2 login in Spring Security using `oauth2Login()` in the security filter chain. The OAuth2 client credentials (Google client ID and secret) are defined in `application.properties`. When a user clicks "Login with Google" on the frontend, they're redirected to Google's authorization server via the `/login/oauth2/authorization/google` endpoint. After the user grants consent, Google redirects back with an authorization code. Spring Security exchanges this code for an access token, retrieves the user profile, and calls my custom `OAuth2SuccessHandler`. This handler checks if the user already exists in the database by email — if not, it creates a new user record. Then it generates a JWT using `JwtProvider.generateToken()` and redirects the user to the React frontend URL with the JWT as a query parameter. The frontend captures this token and stores it in Redux for subsequent API calls.

---

### 💰 Trading & Business Logic (Q6–Q10)

---

**Q6. Explain the order processing flow for a BUY order.**

When a user places a BUY order, the `OrderController` receives the request with the coin ID, quantity, and order type. The service layer's `processOrder()` method delegates to `buyAsset()`. First, it validates that the quantity is greater than zero. Then it fetches the coin's current market price from the database (which was previously synced from CoinGecko). It creates an `OrderItem` entity linking the coin, quantity, and buy price. Next, it creates an `Order` entity with status `PENDING`. The critical step is calling `walletService.payOrderPayment(order, user)`, which checks if the user's wallet has sufficient balance, deducts the order amount, and creates a `WalletTransaction` record. If the wallet has insufficient funds, it throws an exception and the entire transaction rolls back thanks to the `@Transactional` annotation. After payment succeeds, the order status is updated to `SUCCESS`, and the `AssetService` either creates a new `Asset` record or increments the quantity on an existing one. This entire flow is atomic — if any step fails, everything rolls back.

---

**Q7. How does the SELL order differ from BUY?**

The SELL flow in `sellAsset()` works differently from BUY. Instead of checking wallet balance, it first verifies that the user actually holds the asset by querying `AssetService.findAssetByUserIdAndCoinId()`. If the asset exists and the user has sufficient quantity, it creates an `OrderItem` with the original buy price and the current sell price. Then it creates the order and calls `walletService.payOrderPayment()` — but this time the payment method credits the wallet instead of debiting it, since it's a SELL. The asset quantity is decremented using `assetService.updateAsset(id, -quantity)`. There's also a cleanup check: if the remaining asset value falls below 1 unit of currency (due to fractional quantities), the asset record is deleted entirely to avoid dust holdings. If the user doesn't have enough quantity to sell, the order is rolled back and an exception is thrown.

---

**Q8. How do you ensure data consistency during order processing?**

Data consistency is ensured through Spring's `@Transactional` annotation on the `buyAsset()`, `sellAsset()`, and `processOrder()` methods in `OrderServiceImplementation`. This means the entire order flow — creating the order, debiting/crediting the wallet, creating the wallet transaction log, and updating asset holdings — happens within a single database transaction. If any step throws an exception (e.g., insufficient balance, asset not found, database error), Spring's transaction manager automatically rolls back all changes. This prevents partial states like an order being marked as SUCCESS but the wallet not being debited, or assets being incremented without a corresponding wallet deduction. I use JPA with MySQL's InnoDB engine which supports ACID transactions, ensuring atomicity, consistency, isolation, and durability for all order operations.

---

**Q9. How does the wallet system work?**

The `Wallet` entity has a one-to-one relationship with `User` and stores the current balance as a `BigDecimal`. The `WalletService` exposes several operations: `payOrderPayment()` handles BUY/SELL by debiting or crediting based on order type; `addBalanceToWallet()` tops up the wallet after Stripe/Razorpay payment verification; `transferFunds()` enables user-to-user wallet transfers by debiting the sender and crediting the receiver in a single transaction; and withdrawal requests debit the wallet. Every wallet mutation creates a `WalletTransaction` record with the transaction type (BUY, SELL, DEPOSIT, WITHDRAWAL, TRANSFER), amount, timestamp, and purpose. This provides a full audit trail. The `WalletTransactionService` lets users query their complete transaction history. I use `BigDecimal` instead of `double` for the balance field to avoid floating-point precision issues that are critical in financial applications.

---

**Q10. How do you handle payment gateway integration?**

I integrated two payment gateways — Stripe and Razorpay — through the `PaymentService`. When a user wants to top up their wallet, the frontend sends a request with the amount and preferred payment method. For Stripe, the backend creates a Stripe Checkout Session using the Stripe Java SDK, setting the amount, currency, success URL, and cancel URL, then returns the session URL to the frontend for redirection. For Razorpay, it creates a Razorpay Order using the Razorpay Java SDK and returns the order ID. After the user completes payment on the gateway's hosted page, the callback hits the backend's confirmation endpoint. The `PaymentController` verifies the payment status, and on success, calls `walletService.addBalanceToWallet()` to credit the user's wallet and creates a `PaymentOrder` entity tracking the payment status. This dual-gateway approach gives users flexibility and reduces dependency on a single provider.

---

### 🏛️ Architecture & Design (Q11–Q15)

---

**Q11. Explain the layered architecture of your backend.**

The backend follows a classic 3-tier layered architecture. The **Controller layer** (12 controllers) handles HTTP request mapping, input validation, and response formatting — it never contains business logic. The **Service layer** (13 interfaces with 16 implementations) encapsulates all business logic like order processing rules, wallet validation, and payment orchestration. I use interfaces for all services (e.g., `OrderService` interface → `OrderServiceImplementation`) which enables loose coupling, testability, and easy swapping of implementations. The **Repository layer** uses Spring Data JPA repositories extending `JpaRepository`, providing CRUD and custom query methods without boilerplate code. Dependencies flow strictly downward: Controllers depend on Services (injected via `@Autowired` constructor injection), and Services depend on Repositories. This separation means I can modify business rules without touching controllers, or change the database layer without affecting service logic.

---

**Q12. How do you manage state on the frontend?**

I use Redux with Redux Toolkit for centralized state management. The store is organized into 7 feature slices: `AuthSlice` (user profile, JWT token, login/signup state), `CoinSlice` (coin list, coin details, charts, trending), `OrderSlice` (order history, order status), `WalletSlice` (balance, transactions), `WatchlistSlice` (user's watchlist), `WithdrawalSlice` (withdrawal requests), and `AssetSlice` (portfolio holdings). Each slice uses `createAsyncThunk` for async API calls, which automatically dispatches pending/fulfilled/rejected actions. The JWT token is stored in the Auth slice and attached to every Axios request via an interceptor in `api.js`. I also implemented a refresh token mechanism — when a 401 response is received, the Axios interceptor automatically attempts to refresh the access token before retrying the failed request. React Router handles client-side routing with protected routes that check Redux auth state before allowing access.

---

**Q13. How does the frontend communicate with the backend?**

All frontend-to-backend communication uses Axios HTTP client configured in `api.js`. I created a central Axios instance with the base URL pointing to the Spring Boot server. An Axios request interceptor automatically attaches the JWT token from Redux state to the `Authorization` header of every outgoing request. An Axios response interceptor handles 401 errors by attempting automatic token refresh using the stored refresh token — if the refresh succeeds, the original request is retried transparently. All API calls are dispatched through Redux async thunks (e.g., `fetchCoinList`, `placeOrder`, `getWalletBalance`), which manage loading states, success responses, and error handling in the Redux slices. The backend returns JSON responses, and the frontend processes these in the slice reducers to update the store, which in turn re-renders connected React components automatically.

---

**Q14. Why did you choose this tech stack?**

I chose Spring Boot for the backend because it provides production-ready features out of the box — embedded server, auto-configuration, Spring Security for authentication/authorization, Spring Data JPA for database abstraction, and excellent ecosystem support for integrating Stripe, Razorpay, and email services. Java's strong typing and Spring's dependency injection make the codebase maintainable as it grows. For the frontend, I chose React because of its component-based architecture, virtual DOM for performance, and the massive ecosystem. Redux provides predictable state management which is critical for a trading app where wallet balances, order statuses, and portfolio data must stay synchronized. Vite is the build tool for its fast HMR (Hot Module Replacement) during development. Tailwind CSS gives utility-first styling without context-switching to CSS files. MySQL was chosen because trading platforms require ACID-compliant transactions for financial data integrity.

---

**Q15. How did you handle CORS in your application?**

CORS (Cross-Origin Resource Sharing) is configured in `AppConfig.java` using a `CorsConfigurationSource` bean. Since the React frontend runs on a different port (5173) than the Spring Boot backend (5454), browsers block cross-origin requests by default. I configured allowed origins to include `localhost:3000`, `localhost:5173`, `localhost:5174`, `localhost:4200`, and the deployed Vercel URL. I allow all HTTP methods and headers using wildcard, set `allowCredentials` to true so cookies and auth headers are sent, and explicitly expose the `Authorization` header so the frontend can read JWT tokens from responses. The configuration is registered for all paths using `/**`. The `maxAge` is set to 3600 seconds to cache preflight responses, reducing the number of OPTIONS requests the browser makes.

---

### 📊 Database & Data Design (Q16–Q18)

---

**Q16. Explain your database schema and key relationships.**

The database has 17 entities centered around the `User` entity. `User` has a one-to-one relationship with `Wallet` (every user gets a wallet on signup) and `Watchlist`. It has one-to-many relationships with `Order`, `Asset`, `Withdrawal`, `PaymentOrder`, `VerificationCode`, `ForgotPasswordToken`, and `TwoFactorOTP`. The `Wallet` entity has a one-to-many relationship with `WalletTransaction` for audit logging. Each `Order` has a one-to-one `OrderItem`, and `OrderItem` references a `Coin` entity. The `Asset` entity also references `Coin`, forming a many-to-one relationship. I use JPA annotations (`@OneToOne`, `@OneToMany`, `@ManyToOne`, `@Embedded`) for ORM mapping. The `TwoFactorAuth` is an `@Embeddable` class inside `User` rather than a separate table, since it's a value object that always belongs to one user. I use `BigDecimal` for monetary fields and `LocalDateTime` for timestamps to ensure precision.

---

**Q17. How do you handle database migrations and initialization?**

I use Spring Data JPA with `spring.jpa.hibernate.ddl-auto=update`, which automatically creates and alters tables based on entity changes during development. For initial data seeding, I have a `DataInitializationComponent` — a Spring `@Component` that implements `CommandLineRunner` or uses `@PostConstruct` to populate essential reference data when the application starts. In production, best practice would be to switch to a migration tool like Flyway or Liquibase for version-controlled schema changes. The MySQL database uses InnoDB engine by default, which provides row-level locking and ACID transactions — critical for the financial operations. All entity IDs use auto-increment `BIGINT` primary keys generated via `@GeneratedValue(strategy = GenerationType.AUTO)`, and I use `@Column` annotations for constraints like `nullable`, `unique`, and `length`.

---

**Q18. How do you handle the Coin data and market prices?**

The `Coin` entity stores cached market data including `id` (slug like "bitcoin"), `symbol`, `name`, `currentPrice`, `marketCap`, `high24h`, `low24h`, and other market metrics. The `CoinServiceImpl` fetches live data from the CoinGecko API using REST calls. It supports listing coins with pagination, fetching individual coin details, searching by keyword, retrieving trending coins, and pulling chart data for different time ranges. When an order is placed, the coin's `currentPrice` at that moment is captured in the `OrderItem` as the `buyPrice` or `sellPrice`, creating a snapshot of the trade price. This is important because crypto prices change rapidly — the stored price in the `OrderItem` reflects the exact price at trade execution time, not the current live price, ensuring accurate profit/loss calculations in the portfolio view.

---

### 🚀 DevOps & Real-World Scenarios (Q19–Q20)

---

**Q19. What challenges did you face and how did you solve them?**

One major challenge was **ensuring transactional consistency** during order processing. A BUY order involves five database mutations — creating the order, order item, wallet transaction, updating wallet balance, and updating/creating asset holdings. If any step failed midway (e.g., balance check passed but DB write failed), it could leave the system in an inconsistent state. I solved this by wrapping the entire flow in `@Transactional`, ensuring atomic rollback on failure. Another challenge was **handling CORS** between React (port 5173) and Spring Boot (port 5454) — I had to carefully configure allowed origins, headers, and expose the Authorization header. A third challenge was **integrating two different payment gateways** (Stripe and Razorpay) which have completely different APIs and callback mechanisms. I abstracted the payment logic behind a common `PaymentService` interface, so the wallet top-up flow is gateway-agnostic.

---

**Q20. How would you scale this application for production?**

For production scaling, I would implement several improvements. **Horizontal scaling**: Since the backend is stateless (JWT-based, no server sessions), I can run multiple instances behind a load balancer. **Caching**: I'd add Redis to cache frequently accessed data like coin prices and user profiles, reducing database load. **Message Queue**: For order processing, I'd introduce RabbitMQ or Kafka to decouple order submission from processing, handling traffic spikes gracefully. **Database**: I'd implement read replicas for MySQL to separate read-heavy operations (coin listing, portfolio view) from write operations (orders, wallet updates). **Containerization**: I'd Dockerize both frontend and backend, use Docker Compose for local development, and deploy to Kubernetes for orchestration. **CI/CD**: I'd set up GitHub Actions for automated testing and deployment. **Monitoring**: I'd add Spring Boot Actuator endpoints, Prometheus for metrics collection, and Grafana dashboards for real-time monitoring. **Security hardening**: I'd implement Stripe webhook signature verification, rate limiting on auth endpoints, and audit logging for all financial operations.

---

## 💡 Quick Tips for the Interview

1. **Start with the big picture** — explain it as a "full-stack crypto trading platform with Spring Boot + React"
2. **Emphasize the order flow** — it touches 5 entities in one transaction, showing your understanding of ACID
3. **Talk about security layers** — JWT + 2FA + OAuth2 + BCrypt shows depth
4. **Mention external integrations** — CoinGecko, Stripe, Razorpay, Gemini show real-world API experience
5. **Highlight architecture decisions** — layered architecture, interface-based services, Redux state management
6. **Be ready to draw the flow** — User → React → Axios → JWT Filter → Controller → Service → Repository → MySQL
7. **Know your numbers** — 12 controllers, 17 entities, 7 Redux slices, 4 external APIs

---

> **Good luck with your interview! 🚀**
