# CoinX — Cryptocurrency Trading Platform

A full-stack crypto trading platform built with **Spring Boot** and **React**.  
Sign up · Browse live markets · Buy & sell crypto · Manage wallets · Track portfolios

---

## Problem We Solve

1. **No unified auth** — Most crypto demos lack JWT + OAuth2 + 2FA working together
2. **Fake trading** — Orders go through but wallets never actually update
3. **No audit trail** — Transactions happen with zero logging or history
4. **Missing payments** — No real Stripe/Razorpay integration for wallet top-ups
5. **No admin governance** — Withdrawals process without any approval workflow

---

## About the Project

**CoinX** is a production-style cryptocurrency trading platform where users can register, browse real-time coin data from **CoinGecko**, execute buy/sell orders with actual wallet debit/credit, manage their wallets (top-up, transfer, withdraw), track portfolio performance, and interact with an AI chatbot powered by **Google Gemini**. Admins can review and approve or decline withdrawal requests.

| Area | Details |
|---|---|
| **Backend** | 12 REST Controllers · 13 Service Interfaces · 16 Implementations · 17 JPA Entities |
| **Frontend** | 16 Page Modules · 7 Redux Slices · Radix UI Components · Tailwind CSS |
| **Security** | JWT (HMAC-SHA, 24h) · BCrypt · OAuth2 Google Login · 2FA Email OTP |
| **Integrations** | CoinGecko API · Stripe · Razorpay · Google Gemini · SMTP Email |
| **Database** | MySQL + Spring Data JPA · `@Transactional` atomic order processing |

---

## Features

| Category | Highlights |
|---|---|
| **Auth** | JWT + OAuth2 Google login + 2FA (email OTP) + BCrypt + password reset |
| **Trading** | Live prices & charts via CoinGecko · Buy/sell with atomic wallet settlement · Order history |
| **Wallet** | `BigDecimal` precision · Stripe & Razorpay top-up · Transfers · Full audit trail |
| **Portfolio** | Holdings dashboard · Watchlist · Asset tracking with buy-price capture |
| **Admin** | Withdrawal approval/decline panel with balance adjustments |
| **AI Chat** | Coin Q&A powered by Google Gemini |
| **UI** | Dark glassmorphism theme · ApexCharts · Responsive desktop & mobile |

---

## Tech Stack

### Backend

| Component | Technology | Version |
|---|---|---|
| Framework | Spring Boot | 3.4.2 |
| Language | Java | 21 |
| Database | MySQL | 8+ |
| ORM | Spring Data JPA + Hibernate | — |
| Security | JWT (jjwt) | 0.13.0 |
| Auth | OAuth2 (Google) | — |
| Payments | Stripe | 26.0.0 |
| Payments | Razorpay | 1.4.8 |
| Build | Maven | 3.6+ |

### Frontend

| Component | Technology | Version |
|---|---|---|
| Library | React | 18.2.0 |
| Build Tool | Vite | 7.2.7 |
| State | Redux Toolkit | 2.11.2 |
| Routing | React Router DOM | 6.21.3 |
| HTTP | Axios | 1.6.7 |
| Styling | Tailwind CSS | 3.4.1 |
| UI | Radix UI | Dialog, Select, Toast… |
| Charts | ApexCharts | 5.3.6 |

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
| PATCH | `/api/admin/withdrawal/{id}/proceed/{accept}` | Admin approve/decline | Admin |
| GET | `/api/admin/withdrawal` | All withdrawal requests | Admin |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/payment/{paymentMethod}/amount/{amount}` | Create payment link | JWT |
| GET | `/api/payment` | Verify payment callback | JWT |

---

## Getting Started

> **Prerequisites:** Java 21+, Maven 3.6+, Node.js 16+, MySQL 8+

```bash
# 1. Clone & enter
git clone https://github.com/himanshugupta91/CoinX-Cryptocurrency-Trading-Platform.git
cd CoinX-Cryptocurrency-Trading-Platform

# 2. Create MySQL database
mysql -u root -p -e "CREATE DATABASE trading_platform;"

# 3. Backend — configure application.properties (see Environment Variables below)
cd "Backend-Spring boot"
mvn clean install && mvn spring-boot:run    # Runs at http://localhost:5454

# 4. Frontend
cd "../Frontend-React"
npm install && npm run dev                  # Runs at http://localhost:5173
```

---

## Environment Variables

> The `application.properties` file is **gitignored** for security. You must create it yourself.

| Variable | Purpose | Where to Get |
|---|---|---|
| `spring.datasource.*` | MySQL connection | Your local MySQL |
| `razorpay.key.id` / `secret` | Razorpay payments | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `stripe.api.key` | Stripe payments | [Stripe Dashboard](https://dashboard.stripe.com) |
| `spring.mail.*` | Email OTP | Gmail App Password |
| Google OAuth2 credentials | Google login | [Google Cloud Console](https://console.cloud.google.com) |

---

## Contributing

1. **Fork** the repo
2. Create a branch — `git checkout -b feature/something`
3. Commit — `git commit -m 'add something'`
4. Push — `git push origin feature/something`
5. Open a **Pull Request**

---

## License

MIT License. See [LICENSE](LICENSE) file for details.

---

Built with care by [Himanshu](https://github.com/himanshugupta91)
