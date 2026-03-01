# CoinX — Cryptocurrency Trading Platform

A crypto trading platform backend built with **Spring Boot**.  
Sign up · Browse live markets · Buy & sell crypto · Manage wallets · Track portfolios

---

## Problem We Solve

1. **No unified auth** — Most crypto lack JWT + OAuth2 + 2FA working together
2. **Fake trading** — Orders go through but wallets never actually update
3. **No audit trail** — Transactions happen with zero logging or history
4. **Missing payments** — No real Stripe/Razorpay integration for wallet top-ups
5. **No admin governance** — Withdrawals process without any approval workflow

---

## About the Project

**CoinX** is a production-style cryptocurrency trading platform where users can register, browse real-time coin data from **CoinGecko**, execute buy/sell orders with actual wallet debit/credit, manage their wallets (top-up, transfer, withdraw), and track portfolio performance. Admins can review and approve or decline withdrawal requests.

| Area | Details |
|---|---|
| **Backend** | 12 REST Controllers · 13 Service Interfaces · 16 Implementations · 17 JPA Entities |

| **Security** | JWT (HMAC-SHA, 24h) · BCrypt · OAuth2 Google Login · 2FA Email OTP |
| **Integrations** | CoinGecko API · Stripe · Razorpay · SMTP Email |
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


