<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

# CoinX - Cryptocurrency Trading Platform

A full-stack crypto trading platform built with **Spring Boot** and **React**. Users can sign up, browse live coin markets (via CoinGecko), buy and sell crypto with real wallet debit/credit, manage wallets, track portfolio performance, and process payments through Stripe or Razorpay. Admins can approve or decline withdrawal requests.

---

## What's Inside

| Area | Details |
|---|---|
| **Backend** | 12 REST Controllers · 13 Service Interfaces · 16 Service Implementations · 17 JPA Entities |
| **Frontend** | 16 Page Modules · 7 Redux Slices · Radix UI Components · Tailwind CSS |
| **Security** | JWT (HMAC-SHA, 24h expiry) · BCrypt · OAuth2 Google Login · 2FA via Email OTP |
| **Integrations** | CoinGecko API · Stripe · Razorpay · Google Gemini (Chatbot) · SMTP Email |
| **Database** | MySQL with Spring Data JPA · `@Transactional` for atomic order processing |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [How It Works — Order Flow](#how-it-works--order-flow)
- [Security](#security)
- [Testing](#testing)
- [Build for Production](#build-for-production)
- [Project Report](#project-report)
- [Contributing](#contributing)
- [License](#license)

---

## Features

**Auth & Security**
- JWT-based stateless authentication with Spring Security
- OAuth2 Google login with auto-registration
- Optional two-factor authentication (email OTP)
- BCrypt password hashing
- Forgot password and account verification flows

**Trading & Portfolio**
- Live cryptocurrency prices and charts from CoinGecko
- Buy/sell orders with real wallet balance checks and atomic settlement
- Portfolio dashboard with coin holdings and buy price tracking
- Personal watchlist for tracking favorite coins
- Full order history with filtering by type and coin

**Wallet & Payments**
- Wallet balance stored as `BigDecimal` for financial precision
- Top-up via Stripe Checkout or Razorpay payment widget
- User-to-user wallet transfers with sender balance validation
- Withdrawal requests with admin approval workflow
- Every mutation logged as a `WalletTransaction` (full audit trail)

**Admin Panel**
- View all pending withdrawal requests
- Approve or decline with automatic wallet balance adjustments

**AI Chatbot**
- Coin-related Q&A powered by Google Gemini API

**UI**
- Dark mode interface with glassmorphism and gradient backgrounds
- Interactive coin charts (ApexCharts + Recharts)
- Responsive layout — works on desktop and mobile
- Toast notifications, modals, form validation

---

## Tech Stack

### Backend

| Component | Technology | Version |
|---|---|---|
| Framework | Spring Boot | 3.4.2 |
| Language | Java | 21 |
| Database | MySQL | 8+ |
| ORM | Spring Data JPA + Hibernate | — |
| Security | Spring Security + JWT (jjwt) | 0.13.0 |
| Auth | OAuth2 Client (Google) | — |
| Email | Spring Mail (SMTP) | — |
| Payments | Stripe Java SDK | 26.0.0 |
| Payments | Razorpay Java SDK | 1.4.8 |
| Caching | Caffeine Cache | — |
| Utilities | Lombok, JSON Path | — |
| Build | Maven | — |

### Frontend

| Component | Technology | Version |
|---|---|---|
| Library | React | 18.2.0 |
| Build Tool | Vite | 7.2.7 |
| State | Redux Toolkit + Redux Thunk | 2.11.2 |
| Routing | React Router DOM | 6.21.3 |
| HTTP Client | Axios | 1.6.7 |
| Styling | Tailwind CSS | 3.4.1 |
| UI Components | Radix UI (Dialog, Select, Toast, Avatar, etc.) | — |
| Charts | ApexCharts + React ApexCharts | 5.3.6 |
| Icons | Lucide React + React Icons | — |
| Forms | React Hook Form + Yup + Zod | — |

---

## System Architecture

```mermaid
flowchart TB
    User[End User]
    Admin[Admin User]

    subgraph Frontend
        WebApp[React + Vite SPA]
        Redux[Redux Toolkit Store]
        Router[React Router]
        UI[Radix UI + Tailwind CSS]
    end

    subgraph Backend
        Security[Spring Security + JWT Filter]
        Controllers[12 REST Controllers]
    end

    subgraph Services
        AuthSvc[Auth + User Services]
        TradeSvc[Order + Asset Services]
        WalletSvc[Wallet + Withdrawal Services]
        PaymentSvc[Payment Service]
        CoinSvc[Coin + Market Service]
        ChatSvc[Chatbot Service]
    end

    subgraph Data
        Repos[JPA Repositories]
        MySQL[(MySQL)]
    end

    subgraph External
        CoinGecko[CoinGecko API]
        Stripe[Stripe]
        Razorpay[Razorpay]
        Gemini[Gemini AI]
        SMTP[SMTP Mail]
    end

    User --> WebApp
    Admin --> WebApp
    WebApp --> Redux
    WebApp --> Router
    WebApp --> UI
    WebApp --> Security
    Security --> Controllers
    Controllers --> AuthSvc
    Controllers --> TradeSvc
    Controllers --> WalletSvc
    Controllers --> PaymentSvc
    Controllers --> CoinSvc
    Controllers --> ChatSvc
    AuthSvc --> Repos
    TradeSvc --> Repos
    WalletSvc --> Repos
    PaymentSvc --> Repos
    CoinSvc --> Repos
    Repos --> MySQL
    CoinSvc --> CoinGecko
    PaymentSvc --> Stripe
    PaymentSvc --> Razorpay
    ChatSvc --> Gemini
    AuthSvc --> SMTP
```

---

## Project Structure

### Backend — `Backend-Spring boot/`

```
src/main/java/com/himanshu/
├── config/                        # Security, CORS, JWT config
│   ├── AppConfig.java             # SecurityFilterChain, CORS, BCrypt bean
│   ├── JwtProvider.java           # JWT token generation + parsing
│   ├── JwtTokenValidator.java     # OncePerRequestFilter for JWT validation
│   ├── JwtConstant.java           # Secret key constant
│   └── OAuth2SuccessHandler.java  # Google OAuth → JWT redirect
│
├── controller/                    # 12 REST controllers
│   ├── AuthController.java        # /auth — signup, signin, 2FA
│   ├── UserController.java        # /api/users — profile
│   ├── CoinController.java        # /coins — market data
│   ├── OrderController.java       # /api/orders — buy/sell
│   ├── WalletController.java      # /api/wallet — balance, deposit, transfer
│   ├── WatchlistController.java   # /api/watchlist — favorites
│   ├── WithdrawalController.java  # /api/withdrawal — create, admin approve
│   ├── PaymentController.java     # /api/payment — Stripe/Razorpay
│   ├── PaymentDetailsController.java # /api — bank details
│   ├── AssetController.java       # /api/assets — holdings
│   ├── VerificationController.java # verification endpoints
│   └── HomeController.java        # health check
│
├── model/                         # 17 JPA entities
│   ├── User.java                  # id, email, password, role, twoFactorAuth
│   ├── Wallet.java                # id, balance (BigDecimal), user
│   ├── WalletTransaction.java     # type, amount, purpose, date
│   ├── Order.java                 # orderType, status, price, timestamp
│   ├── OrderItem.java             # coin, quantity, buyPrice, sellPrice
│   ├── Coin.java                  # id, symbol, name, currentPrice
│   ├── Asset.java                 # user, coin, quantity, buyPrice
│   ├── Withdrawal.java            # amount, status, date
│   ├── PaymentOrder.java          # amount, paymentMethod, status
│   ├── PaymentDetails.java        # accountNumber, ifsc, bankName
│   ├── Watchlist.java             # user, coins
│   ├── VerificationCode.java      # otp, verificationType
│   ├── ForgotPasswordToken.java   # otp, sendTo
│   ├── TwoFactorOTP.java          # otp, jwt
│   ├── TwoFactorAuth.java         # @Embeddable — isEnabled, sendTo
│   ├── Notification.java          # notifications
│   └── TreadingHistory.java       # trading history
│
├── service/                       # 13 interfaces + 16 implementations
│   ├── OrderService.java → impl/OrderServiceImplementation.java
│   ├── WalletService.java → impl/WalleteServiceImplementation.java
│   ├── CoinService.java → impl/CoinServiceImpl.java
│   ├── UserService.java → impl/UserServiceImplementation.java
│   ├── AssetService.java → impl/AssetServiceImplementation.java
│   ├── PaymentService.java → impl/PaymentServiceImpl.java
│   ├── WithdrawalService.java → impl/WithdrawalServiceImpl.java
│   ├── WatchlistService.java → impl/WatchlistServiceImpl.java
│   ├── VerificationService.java → impl/VerificationServiceImpl.java
│   ├── ForgotPasswordService.java → impl/ForgotPasswordServiceImpl.java
│   ├── TwoFactorOtpService.java → impl/TwoFactorOtpServiceImpl.java
│   ├── PaymentDetailsService.java → impl/PaymentDetailsServiceImpl.java
│   ├── WalletTransactionService.java → impl/WalletTransactionServiceImpl.java
│   └── impl/EmailService.java, impl/CustomeUserServiceImplementation.java
│   └── impl/DataInitializationComponent.java
│
├── repository/                    # JPA repositories
├── domain/                        # Enums (OrderType, OrderStatus, etc.)
├── dto/                           # Data transfer objects
├── request/                       # Request DTOs
├── response/                      # Response DTOs
├── exception/                     # Custom exception handlers
└── utils/                         # Utility classes
```

### Frontend — `Frontend-React/`

```
src/
├── pages/
│   ├── Home/           # Dashboard with market coin cards
│   ├── Landing/        # Public landing page
│   ├── Auth/
│   │   ├── login/      # Sign in form
│   │   └── signup/     # Registration form
│   ├── StockDetails/   # Coin detail view with charts + buy/sell
│   ├── Portfolio/      # User's coin holdings
│   ├── Wallet/         # Balance, top-up, transfer, withdrawal, history
│   ├── Watchlist/      # Saved favorite coins
│   ├── Activity/       # Trading history
│   ├── Profile/        # User profile + 2FA settings
│   ├── Search/         # Coin search
│   ├── Navbar/         # Top navigation bar
│   ├── SideBar/        # Side navigation
│   ├── Footer/         # Footer
│   └── Notfound/       # 404 page
│
├── Redux/
│   ├── Store.js        # Redux store config
│   ├── Auth/AuthSlice.js       # Login, signup, profile, JWT
│   ├── Coin/CoinSlice.js       # Coin list, detail, charts, trending
│   ├── Order/OrderSlice.js     # Place order, order history
│   ├── Wallet/WalletSlice.js   # Balance, transactions, top-up
│   ├── Watchlist/WatchlistSlice.js  # Watchlist CRUD
│   ├── Withdrawal/WithdrawalSlice.js # Withdrawal requests
│   └── Assets/AssetSlice.js    # Portfolio assets
│
├── components/
│   ├── ui/             # Reusable Radix-based components
│   └── custome/        # Custom project components
│
├── Api/api.js          # Axios instance + request/response interceptors
├── Util/               # Helper functions
├── assets/             # Images, static files
└── lib/                # Utility libraries
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java JDK | 21+ |
| Maven | 3.6+ |
| Node.js | 16+ |
| MySQL | 8.0+ |

### 1. Clone the repo

```bash
git clone https://github.com/himanshugupta91/CoinX-Cryptocurrency-Trading-Platform.git
cd CoinX-Cryptocurrency-Trading-Platform
```

### 2. Setup MySQL

```sql
CREATE DATABASE trading_platform;
```

### 3. Backend Setup

```bash
cd "Backend-Spring boot"
```

Create `src/main/resources/application.properties` (this file is gitignored):

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/trading_platform
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your_secret_key

# Razorpay
razorpay.key.id=your_razorpay_key
razorpay.key.secret=your_razorpay_secret

# Stripe
stripe.api.key=your_stripe_key

# Email (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Server
server.port=5454
```

```bash
mvn clean install
mvn spring-boot:run
# Backend runs at http://localhost:5454
```

### 4. Frontend Setup

```bash
cd "Frontend-React"
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Environment Variables

The `application.properties` file is excluded from git for security. You'll need to set these:

| Variable | Purpose | Where to Get |
|---|---|---|
| `spring.datasource.*` | MySQL connection | Your local MySQL |
| `razorpay.key.id` / `razorpay.key.secret` | Razorpay payments | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `stripe.api.key` | Stripe payments | [Stripe Dashboard](https://dashboard.stripe.com) |
| `spring.mail.username` / `password` | Email OTP | Gmail App Password |
| Google OAuth2 client ID/secret | Google login | [Google Cloud Console](https://console.cloud.google.com) |

---

## API Endpoints

### Auth — `/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/signin` | Login, returns JWT | No |
| POST | `/auth/two-factor/otp/{otp}` | Verify 2FA OTP | No |

### Users — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get current user profile | JWT |
| PUT | `/api/users/profile` | Update profile | JWT |

### Coins — `/coins`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/coins` | List coins (paginated) | No |
| GET | `/coins/{coinId}` | Coin details | No |
| GET | `/coins/search?q=` | Search coins | No |
| GET | `/coins/top50` | Top 50 by market cap | No |
| GET | `/coins/trending` | Trending coins | No |
| GET | `/coins/{coinId}/chart?days=` | Chart data | No |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders/pay` | Place BUY/SELL order | JWT |
| GET | `/api/orders` | User's order history | JWT |
| GET | `/api/orders/{orderId}` | Order details | JWT |

### Wallet — `/api/wallet`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/wallet` | Get wallet balance | JWT |
| PUT | `/api/wallet/deposit` | Credit wallet (after payment) | JWT |
| PUT | `/api/wallet/transfer` | Transfer to another wallet | JWT |
| GET | `/api/wallet/transactions` | Transaction history | JWT |

### Assets — `/api/assets`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/assets` | Get user's coin holdings | JWT |
| GET | `/api/assets/{assetId}` | Specific asset details | JWT |

### Watchlist — `/api/watchlist`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/watchlist/user` | Get user's watchlist | JWT |
| POST | `/api/watchlist/add/coin/{coinId}` | Add coin to watchlist | JWT |

### Withdrawal
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/withdrawal/{amount}` | Create withdrawal request | JWT |
| PATCH | `/api/admin/withdrawal/{id}/proceed/{accept}` | Admin approve/decline | JWT (Admin) |
| GET | `/api/admin/withdrawal` | All withdrawal requests | JWT (Admin) |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/payment/{paymentMethod}/amount/{amount}` | Create payment link | JWT |
| GET | `/api/payment` | Verify payment callback | JWT |

---

## How It Works — Order Flow

This is the core of the project. Here's what happens when a user clicks "Buy":

```mermaid
sequenceDiagram
    participant User
    participant React as React App
    participant Filter as JWT Filter
    participant Controller as OrderController
    participant Service as OrderService
    participant Wallet as WalletService
    participant Asset as AssetService
    participant DB as MySQL

    User->>React: Click Buy (coinId, qty)
    React->>Filter: POST /api/orders/pay + JWT
    Filter->>Filter: Validate token, set SecurityContext
    Filter->>Controller: Authenticated request
    Controller->>Service: processOrder(coin, qty, BUY, user)

    Note over Service: @Transactional — all or nothing

    Service->>Service: createOrderItem(coin, qty, buyPrice)
    Service->>Service: createOrder(user, orderItem, BUY)
    Service->>Wallet: payOrderPayment(order, user)
    Wallet->>DB: Check balance >= order amount
    Wallet->>DB: Debit wallet balance
    Wallet->>DB: Save WalletTransaction
    Service->>Asset: findAssetByUserIdAndCoinId()
    alt Asset exists
        Service->>Asset: updateAsset(+quantity)
    else New coin
        Service->>Asset: createAsset(user, coin, qty)
    end
    Service->>DB: order.status = SUCCESS
    DB-->>React: 200 OK + order data
    React-->>User: Updated portfolio + wallet
```

**Key points:**
- The entire BUY/SELL flow is wrapped in `@Transactional` — if wallet debit fails, the order creation rolls back too
- Wallet balance is `BigDecimal`, not `double`, because floating point and money don't mix
- SELL flow checks asset quantity instead of wallet balance, and credits the wallet
- If remaining asset value drops below 1 after a sell, the asset record is deleted (no dust)
- Coin price at trade time is captured in `OrderItem.buyPrice` / `sellPrice` for accurate P&L

---

## Security

| Layer | What It Does |
|---|---|
| **JWT Filter** | `JwtTokenValidator` runs before `BasicAuthenticationFilter`, validates token on every `/api/**` request |
| **Password** | BCrypt hashing via `BCryptPasswordEncoder` — one-way, salted, adaptive |
| **2FA** | Optional email OTP — deferred JWT until OTP is verified |
| **OAuth2** | Google login → `OAuth2SuccessHandler` creates/finds user → redirects with JWT |
| **CORS** | Whitelisted origins (localhost:3000, 5173, Vercel), Authorization header exposed |
| **Session** | `STATELESS` — no server-side sessions, all state in JWT |
| **CSRF** | Disabled (stateless API, not using cookies) |
| **SQL Injection** | JPA parameterized queries |
| **XSS** | React's built-in escaping |

---

## Testing

```bash
# Backend unit + integration tests
cd "Backend-Spring boot"
./mvnw test

# Frontend linting
cd "Frontend-React"
npm run lint
```

| Test ID | Scenario | Result |
|---|---|---|
| TC-01 | Signup with valid data | Pass |
| TC-02 | Login with wrong password | Pass |
| TC-03 | BUY order with sufficient balance | Pass |
| TC-04 | BUY order with insufficient balance | Pass |
| TC-05 | Wallet top-up via payment callback | Pass |
| TC-06 | Create withdrawal request | Pass |
| TC-07 | Admin declines withdrawal | Pass |
| TC-08 | API call without JWT token | Pass |

---

## Build for Production

```bash
# Backend — produces runnable JAR
cd "Backend-Spring boot"
./mvnw clean package
java -jar target/treading-plateform-0.0.1-SNAPSHOT.jar

# Frontend — static files in dist/
cd "Frontend-React"
npm run build
```

---

## Project Report

Full academic-style documentation with chapters, diagrams, and UML.

<details>
<summary><strong>Chapter 1: Introduction</strong></summary>

### 1.1 Background
Crypto trading has gone from niche to mainstream, and users now expect more than just a basic price chart. They want secure login, live market data, order execution, portfolio tracking, and proper payment flows — all in one place. CoinX was built to bring all of these together in a full-stack application that works end to end, from user signup to order settlement.

### 1.2 Motivation
Most tutorial-level crypto projects only show one piece of the puzzle — maybe just auth, or just a chart, or just a form. They rarely show how everything connects. I wanted to build something where the auth, orders, wallet, payments, and admin workflows actually talk to each other properly. The second reason was to get hands-on with real integrations — CoinGecko for market data, Stripe and Razorpay for payments, Spring Security for JWT, and so on.

### 1.3 Problem Statement
Beginner-level crypto apps usually skip the hard parts. They'll have a trading form but no wallet debit logic, or an auth system with no real role separation. The gaps show up fast — no payment verification, no withdrawal governance, no audit trail for transactions. CoinX addresses this by connecting the dots between auth, trading, wallet, payments, and admin operations in one consistent system.

### 1.4 Objectives
Build a platform that handles the full user lifecycle: register, log in, browse coins, place buy/sell orders (with proper wallet and asset updates), top up wallet through payment gateways, request withdrawals, and let admins approve or decline those withdrawals. On the engineering side, keep things modular with proper layer separation so it's easy to extend later.

### 1.5 Scope
The project covers user and admin flows, JWT-secured APIs, market data retrieval, order processing, wallet management, payment settlement, and withdrawal handling. It doesn't cover things like high-frequency trading, institutional compliance, or distributed deployment — those are future scope.

### 1.6 Report Structure
Chapter 1 covers context and goals. Chapter 2 looks at existing systems. Chapter 3 defines requirements. Chapter 4 is all design — architecture, DFDs, UML, ER diagrams, UI. Chapter 5 covers implementation. Chapter 6 is testing. Chapter 7 discusses results. Chapter 8 wraps up with conclusions and future work.

</details>

<details>
<summary><strong>Chapter 2: Literature Review</strong></summary>

### 2.1 Introduction
Before building CoinX, I looked at what's already out there — centralized exchanges, wallet apps, portfolio trackers, and tutorial projects — to figure out where the gaps are.

### 2.2 Existing Systems
Centralized exchanges (like Binance) have deep features but their internals are opaque — hard to learn from. Wallet apps focus on custody and transfers but skip trading. Portfolio trackers give nice charts but don't execute trades. Tutorial projects usually show isolated pieces — auth without wallet logic, or trading forms without proper settlement.

### 2.3 Limitations
The biggest issue across non-enterprise projects is fragmented workflows. Auth exists but doesn't connect to trading. Orders go through but the wallet doesn't update. Transaction logs are missing. Security is half-baked — authentication without proper authorization. And most are hard to extend because the code isn't properly layered.

### 2.4 What CoinX Does Differently
CoinX treats auth, trading, wallet, payments, and admin as parts of one connected system. When you place a BUY order, the wallet actually gets debited, a transaction log is created, and the asset holding is updated — all atomically. When a withdrawal is requested, it goes to an admin queue where it can be approved or declined with proper balance adjustments.

### 2.5 Comparison

| Feature | Tracker Apps | Demo Apps | CoinX |
|---|---|---|---|
| Auth | Basic/Optional | Basic | JWT + 2FA + OAuth2 |
| Trading | No | Partial | Full buy/sell with settlement |
| Wallet | Limited | Partial | Wallet + transactions + transfers |
| Payments | No | Rare | Stripe + Razorpay |
| Admin Flow | No | No | Withdrawal approval/decline |
| Backend | API-light | Minimal | Spring Boot layered architecture |

</details>

<details>
<summary><strong>Chapter 3: System Analysis and Requirements</strong></summary>

### 3.1 Overview
React handles the UI, Spring Boot serves the REST API. Backend is split into controller, service, and repository layers. External APIs are called from dedicated service methods so the core logic doesn't get tangled with third-party code.

### 3.2 Functional Requirements
Users need to: register, sign in, browse coins, search, view charts, buy/sell, view portfolio and history, manage wallet (top-up, transfer, withdraw), manage watchlist, and use the chatbot. Admins need to: view and process withdrawal requests.

### 3.3 Non-Functional Requirements
Low latency for common operations. JWT-based security with proper token validation. Transactional consistency so wallet and order states stay in sync. Modular code so it's maintainable. Responsive UI.

### 3.4 Feasibility

**Technical**: Spring Boot and React are mature, well-documented, and have big ecosystems. CoinGecko, Stripe, Razorpay all have solid APIs. Nothing exotic here.

**Economic**: Everything is open source. External APIs have free tiers. Can run on a regular laptop for development.

**Operational**: The workflows match what users expect from a trading app. Modular design makes it manageable for a small team.

### 3.5 Requirements
- Java 21+, Maven 3.6+, Node.js 16+, MySQL 8+
- 8 GB RAM, dual-core CPU, 10 GB disk, internet connection

</details>

<details>
<summary><strong>Chapter 4: System Design</strong></summary>

### 4.1 Data Flow Diagrams

<details>
<summary>DFD Level 0</summary>

```mermaid
flowchart LR
    User[User]
    Admin[Admin]
    CoinX[CoinX Trading Platform]
    Market[CoinGecko API]
    Pay[Stripe and Razorpay]
    Mail[Email Service]
    AI[Gemini API]

    User -->|Register, Login, Trade, Wallet Ops| CoinX
    CoinX -->|Dashboard, Portfolio, Notifications| User
    Admin -->|Review Withdrawals| CoinX
    CoinX -->|Admin Reports| Admin
    CoinX -->|Market Requests| Market
    Market -->|Coin Data and Charts| CoinX
    CoinX -->|Payment Links and Verify Status| Pay
    Pay -->|Payment Confirmation| CoinX
    CoinX -->|OTP and Alerts| Mail
    CoinX -->|Prompt| AI
    AI -->|Response| CoinX
```

</details>

<details>
<summary>DFD Level 1</summary>

```mermaid
flowchart TB
    U[User]
    A[Admin]

    P1[1.0 Authentication and Authorization]
    P2[2.0 Market and Coin Management]
    P3[3.0 Order and Portfolio Processing]
    P4[4.0 Wallet and Payment Processing]
    P5[5.0 Withdrawal Management]
    P6[6.0 Verification and Notifications]

    D1[(D1 User Store)]
    D2[(D2 Coin Store)]
    D3[(D3 Order Store)]
    D4[(D4 Asset Store)]
    D5[(D5 Wallet Store)]
    D6[(D6 Wallet Transaction Store)]
    D7[(D7 Withdrawal Store)]
    D8[(D8 Verification and OTP Store)]

    ExtCoin[CoinGecko API]
    ExtPay[Stripe and Razorpay]
    ExtMail[SMTP]

    U --> P1
    U --> P2
    U --> P3
    U --> P4
    U --> P5
    A --> P5
    P1 <--> D1
    P2 <--> D2
    P2 <--> ExtCoin
    P3 <--> D1
    P3 <--> D3
    P3 <--> D4
    P3 <--> D5
    P4 <--> D5
    P4 <--> D6
    P4 <--> ExtPay
    P5 <--> D7
    P5 <--> D5
    P6 <--> D8
    P6 <--> ExtMail
```

</details>

<details>
<summary>DFD Level 2 — Order Execution</summary>

```mermaid
flowchart LR
    U[User] --> O1[3.1 Submit Order Request]
    O1 --> O2[3.2 Validate JWT and User]
    O2 --> O3[3.3 Fetch Coin and Market Price]
    O3 --> O4{Order Type}
    O4 -->|BUY| O5[3.4 Check Wallet Balance]
    O4 -->|SELL| O6[3.5 Check Asset Quantity]
    O5 --> O7[3.6 Create Order and OrderItem]
    O6 --> O7
    O7 --> O8[3.7 Update Wallet Ledger]
    O8 --> O9[3.8 Update Asset Holdings]
    O9 --> O10[3.9 Mark Order SUCCESS]
    O10 --> U

    D1[(User)] --> O2
    D2[(Coin)] --> O3
    D3[(Order)] --> O7
    D4[(Asset)] --> O6
    D4 --> O9
    D5[(Wallet)] --> O5
    D5 --> O8
    D6[(WalletTransaction)] --> O8
```

</details>

### 4.2 UML Diagrams

<details>
<summary>Use Case Diagram</summary>

```mermaid
flowchart LR
    User((User))
    Admin((Admin))
    Payment((Payment Gateway))
    Market((Market API))
    Mail((Email Service))

    UC1([Sign Up / Sign In])
    UC2([Enable Two Factor Auth])
    UC3([Reset Password])
    UC4([Browse Coins])
    UC5([View Coin Charts])
    UC6([Place Buy Order])
    UC7([Place Sell Order])
    UC8([View Portfolio and History])
    UC9([Wallet Top-up])
    UC10([Wallet Transfer])
    UC11([Create Withdrawal Request])
    UC12([Manage Payment Details])
    UC13([Process Withdrawal Request])
    UC14([Chatbot Query])
    UC15([Send and Verify OTP])

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC14
    User --> UC15

    Admin --> UC13

    UC4 --> Market
    UC5 --> Market
    UC9 --> Payment
    UC15 --> Mail
```

</details>

<details>
<summary>Class Diagram</summary>

```mermaid
classDiagram
    class User {
      +Long id
      +String fullName
      +String email
      +String mobile
      +String password
      +boolean isVerified
      +USER_ROLE role
      +TwoFactorAuth twoFactorAuth
    }
    class Wallet {
      +Long id
      +BigDecimal balance
    }
    class WalletTransaction {
      +Long id
      +WalletTransactionType type
      +Long amount
      +String purpose
      +String transferId
      +LocalDate date
    }
    class Order {
      +Long id
      +OrderType orderType
      +OrderStatus status
      +BigDecimal price
      +LocalDateTime timestamp
    }
    class OrderItem {
      +Long id
      +double quantity
      +double buyPrice
      +double sellPrice
    }
    class Coin {
      +String id
      +String symbol
      +String name
      +double currentPrice
      +long marketCap
      +double high24h
      +double low24h
    }
    class Asset {
      +Long id
      +double quantity
      +double buyPrice
    }
    class Withdrawal {
      +Long id
      +Long amount
      +WithdrawalStatus status
      +LocalDateTime date
    }
    class PaymentOrder {
      +Long id
      +Long amount
      +PaymentMethod paymentMethod
      +PaymentOrderStatus status
    }
    class PaymentDetails {
      +Long id
      +String accountNumber
      +String accountHolderName
      +String ifsc
      +String bankName
    }
    class Watchlist {
      +Long id
    }
    class VerificationCode {
      +Long id
      +String otp
      +VerificationType verificationType
    }
    class ForgotPasswordToken {
      +String id
      +String otp
      +VerificationType verificationType
      +String sendTo
    }
    class TwoFactorOTP {
      +String id
      +String otp
      +String jwt
    }

    User "1" --> "1" Wallet : owns
    User "1" --> "*" Order : places
    User "1" --> "*" Asset : holds
    User "1" --> "*" Withdrawal : requests
    User "1" --> "*" PaymentOrder : creates
    User "1" --> "1" PaymentDetails : configures
    User "1" --> "1" Watchlist : manages
    User "1" --> "*" VerificationCode : receives
    User "1" --> "*" ForgotPasswordToken : requests
    User "1" --> "*" TwoFactorOTP : authenticates
    Wallet "1" --> "*" WalletTransaction : records
    Order "1" --> "1" OrderItem : contains
    OrderItem "*" --> "1" Coin : references
    Asset "*" --> "1" Coin : tracks
```

</details>

<details>
<summary>Activity Diagram</summary>

```mermaid
flowchart TD
    Start([Start]) --> Login[User Login]
    Login --> Auth{JWT Valid?}
    Auth -- No --> AuthFail[Show Login Error]
    AuthFail --> End([End])
    Auth -- Yes --> Dashboard[Open Dashboard]
    Dashboard --> Select{Select Feature}

    Select --> Market[Browse Coin Market]
    Market --> CoinDetails[Open Coin Details]
    CoinDetails --> Trade{Trade Action?}
    Trade -- Buy --> BuyFlow[Submit BUY Order]
    Trade -- Sell --> SellFlow[Submit SELL Order]
    BuyFlow --> Refresh[Update Wallet and Portfolio]
    SellFlow --> Refresh

    Select --> Wallet[Open Wallet Page]
    Wallet --> WalletAction{Wallet Operation}
    WalletAction -- Top-up --> CreatePay[Create Payment Order]
    WalletAction -- Transfer --> Transfer[Wallet to Wallet Transfer]
    WalletAction -- Withdraw --> RequestWd[Create Withdrawal Request]
    CreatePay --> ConfirmPay[Verify Payment and Credit Wallet]
    Transfer --> Refresh
    RequestWd --> Pending[Withdrawal Pending for Admin]
    ConfirmPay --> Refresh

    Select --> Profile[Profile and Security]
    Profile --> Otp[Send and Verify OTP]
    Otp --> Refresh

    Refresh --> End
```

</details>

### 4.3 Database Design

<details>
<summary>ER Diagram</summary>

```mermaid
erDiagram
    USER ||--|| WALLET : owns
    USER ||--o{ ORDER : places
    USER ||--o{ ASSET : holds
    USER ||--o{ WITHDRAWAL : requests
    USER ||--o{ PAYMENT_ORDER : creates
    USER ||--|| WATCHLIST : owns
    USER ||--|| PAYMENT_DETAILS : configures
    USER ||--o{ VERIFICATION_CODE : receives
    USER ||--o{ FORGOT_PASSWORD_TOKEN : requests
    USER ||--o{ TWO_FACTOR_OTP : authenticates
    WALLET ||--o{ WALLET_TRANSACTION : records
    ORDER ||--|| ORDER_ITEM : contains
    ORDER_ITEM }o--|| COIN : references
    ASSET }o--|| COIN : references

    USER {
      bigint id PK
      string full_name
      string email
      string mobile
      string password
      string role
    }
    WALLET {
      bigint id PK
      decimal balance
      bigint user_id FK
    }
    WALLET_TRANSACTION {
      bigint id PK
      bigint wallet_id FK
      string type
      bigint amount
      string purpose
      date txn_date
      string transfer_id
    }
    ORDER {
      bigint id PK
      bigint user_id FK
      decimal price
      string status
      string order_type
      datetime timestamp
    }
    ORDER_ITEM {
      bigint id PK
      bigint order_id FK
      string coin_id FK
      double quantity
      double buy_price
      double sell_price
    }
    COIN {
      string id PK
      string symbol
      string name
      double current_price
    }
    ASSET {
      bigint id PK
      bigint user_id FK
      string coin_id FK
      double quantity
      double buy_price
    }
    WITHDRAWAL {
      bigint id PK
      bigint user_id FK
      bigint amount
      string status
      datetime req_date
    }
    PAYMENT_ORDER {
      bigint id PK
      bigint user_id FK
      bigint amount
      string payment_method
      string status
    }
    WATCHLIST {
      bigint id PK
      bigint user_id FK
    }
    PAYMENT_DETAILS {
      bigint id PK
      bigint user_id FK
      string account_number
      string account_holder_name
      string ifsc
      string bank_name
    }
    VERIFICATION_CODE {
      bigint id PK
      bigint user_id FK
      string otp
      string verification_type
      string send_to
    }
    FORGOT_PASSWORD_TOKEN {
      string id PK
      bigint user_id FK
      string otp
      string verification_type
      string send_to
    }
    TWO_FACTOR_OTP {
      string id PK
      bigint user_id FK
      string otp
      string jwt_token
    }
```

</details>

<details>
<summary>Data Dictionary</summary>

| Table | Field | Type | Constraints | Description |
|---|---|---|---|---|
| `user` | `id` | BIGINT | PK, Auto Increment | Unique user identifier |
| `user` | `email` | VARCHAR | Unique, Not Null | Login email |
| `user` | `password` | VARCHAR | Not Null | BCrypt-hashed |
| `user` | `role` | VARCHAR | Not Null | ROLE_USER or ROLE_ADMIN |
| `user` | `is_verified` | BOOLEAN | Default false | Account verification status |
| `wallet` | `id` | BIGINT | PK | Wallet identifier |
| `wallet` | `user_id` | BIGINT | FK -> user.id | Owner |
| `wallet` | `balance` | DECIMAL | Not Null | Current balance |
| `wallet_transaction` | `id` | BIGINT | PK | Transaction ID |
| `wallet_transaction` | `wallet_id` | BIGINT | FK -> wallet.id | Parent wallet |
| `wallet_transaction` | `type` | VARCHAR | Not Null | Deposit, withdrawal, transfer, buy, sell |
| `wallet_transaction` | `amount` | BIGINT | Not Null | Signed amount |
| `wallet_transaction` | `txn_date` | DATE | Not Null | Transaction date |
| `coin` | `id` | VARCHAR | PK | Coin slug (e.g. bitcoin) |
| `coin` | `symbol` | VARCHAR | Indexed | Ticker symbol |
| `coin` | `current_price` | DOUBLE | Not Null | Latest price |
| `order` | `id` | BIGINT | PK | Order ID |
| `order` | `user_id` | BIGINT | FK -> user.id | Who placed it |
| `order` | `order_type` | VARCHAR | Not Null | BUY or SELL |
| `order` | `status` | VARCHAR | Not Null | PENDING, SUCCESS, CANCELLED |
| `order` | `price` | DECIMAL | Not Null | Total order value |
| `order_item` | `coin_id` | VARCHAR | FK -> coin.id | Which coin |
| `order_item` | `quantity` | DOUBLE | Not Null | How much |
| `asset` | `user_id` | BIGINT | FK -> user.id | Owner |
| `asset` | `coin_id` | VARCHAR | FK -> coin.id | Which coin |
| `asset` | `quantity` | DOUBLE | Not Null | Units held |
| `withdrawal` | `amount` | BIGINT | Not Null | Requested amount |
| `withdrawal` | `status` | VARCHAR | Not Null | PENDING, SUCCESS, DECLINE |
| `payment_order` | `payment_method` | VARCHAR | Not Null | STRIPE or RAZORPAY |

</details>

### 4.4 UI Navigation

<details>
<summary>Navigation Diagram</summary>

```mermaid
flowchart LR
    App[CoinX App]
    App --> Auth[Auth Screens]
    App --> UserDash[User Dashboard]
    App --> AdminDash[Admin Dashboard]

    Auth --> SignIn[Sign In]
    Auth --> SignUp[Sign Up]
    Auth --> Forgot[Forgot Password]
    Auth --> TwoFA[2FA Verification]

    UserDash --> Home[Home and Market]
    UserDash --> CoinDetail[Coin Detail and Chart]
    UserDash --> Portfolio[Portfolio]
    UserDash --> Wallet[Wallet]
    UserDash --> Watchlist[Watchlist]
    UserDash --> Profile[Profile]
    UserDash --> Search[Search]

    Wallet --> Topup[Top-up]
    Wallet --> Transfer[Transfer]
    Wallet --> Withdrawal[Withdrawal]
    Wallet --> TxnHistory[Transaction History]

    AdminDash --> WAdmin[Withdrawal Approval Panel]
```

</details>

</details>

<details>
<summary><strong>Chapter 5: Implementation</strong></summary>

### 5.1 Dev Environment
Backend: Java 21, Spring Boot 3.4.2, Maven. Frontend: React 18.2, Vite 7.2. Database: MySQL 8. Works on Windows, macOS, or Linux with IntelliJ or VS Code.

### 5.2 Tech Used
**Backend**: Spring Boot for the API, Spring Security + JWT for auth, Spring Data JPA for database, Spring Mail for OTP emails, OAuth2 for Google login, Caffeine for caching. **Frontend**: React for components, Redux Toolkit for state, React Router for navigation, Axios for HTTP, Tailwind + Radix UI for styling. **External**: CoinGecko (market data), Stripe + Razorpay (payments), Gemini (chatbot).

### 5.3 Modules
- **Auth**: signup, signin, JWT, 2FA, password reset
- **Coin**: listing, detail, search, trending, charts (from CoinGecko)
- **Order**: buy/sell processing, order history, cancellation
- **Wallet**: balance, top-up, transfer, withdrawal, transaction log
- **Withdrawal**: user creates request → admin approves/declines
- **Watchlist**: add/remove favorite coins
- **Chat**: Gemini-powered coin Q&A

### 5.4 Key Logic
JWT generation uses HMAC-SHA signing with 24h expiry. OTP is a random 6-digit code stored in DB and sent via email. BUY flow checks wallet balance before debiting. SELL flow checks asset quantity before crediting. Wallet transfers validate sender balance. All order operations use `@Transactional` for atomicity.

### 5.5 Code Snippets

```java
// JWT generation in JwtProvider.java
String jwt = Jwts.builder()
    .setIssuedAt(new Date())
    .setExpiration(new Date(new Date().getTime() + 86400000))
    .claim("email", auth.getName())
    .claim("authorities", roles)
    .signWith(key)
    .compact();
```

```javascript
// Fetching coin list in CoinSlice.js
const response = await axios.get(`${API_BASE_URL}/coins?page=${page}`);
dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: response.data });
```

</details>

<details>
<summary><strong>Chapter 6: Testing</strong></summary>

### 6.1 Strategy
Unit tests for individual service methods. Integration tests for API flows (order + wallet + asset updates together). Manual end-to-end testing for complete user journeys.

### 6.2 Unit Testing
Backend: testing order processing logic, wallet mutation rules, verification checks. Frontend: reducer tests, utility helpers, action dispatch behavior.

### 6.3 Integration Testing
Key scenarios: authenticated endpoint access, order creation with wallet/asset sync, payment → wallet credit, withdrawal lifecycle (create → admin approve/decline).

### 6.4 System Testing
Full user journey: signup → login → browse market → trade → wallet top-up → withdrawal → admin handling.

</details>

<details>
<summary><strong>Chapter 7: Results</strong></summary>

### 7.1 What Was Built
Complete screens for auth (signup, signin, 2FA, password reset), dashboard with market cards, coin detail with charts and trading forms, wallet with top-up/transfer/withdrawal/history, portfolio, and admin withdrawal panel.

### 7.2 Performance
Works well for development and prototype usage. API responses are quick for typical loads. The slowest parts are external API calls (CoinGecko, Gemini) — those depend on network and provider quotas.

### 7.3 Compared to Others
Unlike most student projects, CoinX actually connects all the pieces. An order isn't just a form submission — it triggers wallet updates, asset changes, and transaction logging in one atomic operation. That's closer to how real exchanges work.

</details>

<details>
<summary><strong>Chapter 8: Conclusion</strong></summary>

### 8.1 Summary
CoinX does what it set out to do — a working crypto trading platform with proper auth, trading, wallet management, payment integration, and admin governance. The code is modular enough to extend without major rewrites.

### 8.2 Limitations
Depends on third-party APIs (CoinGecko can be slow, payment gateways have quotas). No automated test suite beyond unit tests. Not designed for high-frequency trading or institutional use.

### 8.3 Future Work
Redis caching for coin data, RabbitMQ for order processing, Docker + Kubernetes for deployment, CI/CD with GitHub Actions, Stripe webhook signature validation, rate limiting on auth endpoints, and monitoring with Prometheus + Grafana.

</details>

<details>
<summary><strong>References</strong></summary>

1. Spring Boot — https://spring.io/projects/spring-boot  
2. Spring Security — https://spring.io/projects/spring-security  
3. React — https://react.dev  
4. Redux Toolkit — https://redux-toolkit.js.org  
5. Vite — https://vitejs.dev  
6. CoinGecko API — https://www.coingecko.com/en/api/documentation  
7. Stripe API — https://docs.stripe.com  
8. Razorpay API — https://razorpay.com/docs  
9. Mermaid — https://mermaid.js.org  

</details>

<details>
<summary><strong>Appendices</strong></summary>

### A. Source Code
Backend code is in `Backend-Spring boot/`. Frontend code is in `Frontend-React/`.

### B. User Manual
Setup instructions are in the Getting Started section above. Frontend-specific notes are in `Frontend-React/README.md`.

### C. Publication
Reserved for future publications, conference submissions, or institutional repository links.

</details>

---

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/something`)
3. Commit your changes (`git commit -m 'add something'`)
4. Push (`git push origin feature/something`)
5. Open a Pull Request

---

## License

MIT License. See LICENSE file for details.
