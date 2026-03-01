<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=220&section=header&text=🪙%20CoinX&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Cryptocurrency%20Trading%20Platform&descSize=22&descAlignY=55&descColor=cccccc" width="100%" />
</p>

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

<p align="center">
  <b>A full-stack crypto trading platform built with <ins>Spring Boot</ins> and <ins>React</ins>.</b><br/>
  Sign up · Browse live markets · Buy & sell crypto · Manage wallets · Track portfolios
</p>

---

## 🎯 Problem We Solve

1. 🔓 **No unified auth** — Most crypto demos lack JWT + OAuth2 + 2FA working together
2. 💸 **Fake trading** — Orders go through but wallets never actually update
3. 🧾 **No audit trail** — Transactions happen with zero logging or history
4. 🏦 **Missing payments** — No real Stripe/Razorpay integration for wallet top-ups
5. 🚫 **No admin governance** — Withdrawals process without any approval workflow

---

## 🔮 About the Project

**CoinX** is a production-style cryptocurrency trading platform where users can register, browse real-time coin data from **CoinGecko**, execute buy/sell orders with actual wallet debit/credit, manage their wallets (top-up, transfer, withdraw), track portfolio performance, and interact with an AI chatbot powered by **Google Gemini**. Admins can review and approve or decline withdrawal requests.

| Area | Details |
|---|---|
| 🖥️ **Backend** | 12 REST Controllers · 13 Service Interfaces · 16 Implementations · 17 JPA Entities |
| 🎨 **Frontend** | 16 Page Modules · 7 Redux Slices · Radix UI Components · Tailwind CSS |
| 🔐 **Security** | JWT (HMAC-SHA, 24h) · BCrypt · OAuth2 Google Login · 2FA Email OTP |
| 🔗 **Integrations** | CoinGecko API · Stripe · Razorpay · Google Gemini · SMTP Email |
| 🗄️ **Database** | MySQL + Spring Data JPA · `@Transactional` atomic order processing |

---

## ✨ Features

| | Highlights |
|---|---|
| 🔐 **Auth** | JWT + OAuth2 Google login + 2FA (email OTP) + BCrypt + password reset |
| 📈 **Trading** | Live prices & charts via CoinGecko · Buy/sell with atomic wallet settlement · Order history |
| 💰 **Wallet** | `BigDecimal` precision · Stripe & Razorpay top-up · Transfers · Full audit trail |
| 📊 **Portfolio** | Holdings dashboard · Watchlist · Asset tracking with buy-price capture |
| �️ **Admin** | Withdrawal approval/decline panel with balance adjustments |
| 🤖 **AI Chat** | Coin Q&A powered by Google Gemini |
| 🎨 **UI** | Dark glassmorphism theme · ApexCharts · Responsive desktop & mobile |

---

## 🧰 Tech Stack

### 🟢 Backend

| Component | Technology | Version |
|---|---|---|
| Framework | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) | `3.4.2` |
| Language | ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | `21` |
| Database | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | `8+` |
| ORM | ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white) | Spring Data JPA |
| Security | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | `jjwt 0.13.0` |
| Auth | ![Google](https://img.shields.io/badge/OAuth2-4285F4?style=flat-square&logo=google&logoColor=white) | Google Login |
| Payments | ![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white) | `26.0.0` |
| Payments | ![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat-square&logo=razorpay&logoColor=white) | `1.4.8` |
| Build | ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white) | `3.6+` |

### 🔵 Frontend

| Component | Technology | Version |
|---|---|---|
| Library | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | `18.2.0` |
| Build Tool | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `7.2.7` |
| State | ![Redux](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) | `2.11.2` |
| Routing | ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | `6.21.3` |
| HTTP | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | `1.6.7` |
| Styling | ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | `3.4.1` |
| UI | ![Radix](https://img.shields.io/badge/Radix%20UI-161618?style=flat-square&logo=radixui&logoColor=white) | Dialog, Select, Toast… |
| Charts | ![ApexCharts](https://img.shields.io/badge/ApexCharts-FF6384?style=flat-square&logoColor=white) | `5.3.6` |




## 🌐 API Endpoints

### 🔑 Auth — `/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/signup` | Register new user | ❌ |
| `POST` | `/auth/signin` | Login, returns JWT | ❌ |
| `POST` | `/auth/two-factor/otp/{otp}` | Verify 2FA OTP | ❌ |

### 👤 Users — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/users/profile` | Get current user profile | 🔒 JWT |
| `PUT` | `/api/users/profile` | Update profile | 🔒 JWT |

### 💎 Coins — `/coins`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/coins` | List coins (paginated) | ❌ |
| `GET` | `/coins/{coinId}` | Coin details | ❌ |
| `GET` | `/coins/search?q=` | Search coins | ❌ |
| `GET` | `/coins/top50` | Top 50 by market cap | ❌ |
| `GET` | `/coins/trending` | Trending coins | ❌ |
| `GET` | `/coins/{coinId}/chart?days=` | Chart data | ❌ |

### 📦 Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/orders/pay` | Place BUY/SELL order | 🔒 JWT |
| `GET` | `/api/orders` | User's order history | 🔒 JWT |
| `GET` | `/api/orders/{orderId}` | Order details | 🔒 JWT |

### 👜 Wallet — `/api/wallet`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/wallet` | Get wallet balance | 🔒 JWT |
| `PUT` | `/api/wallet/deposit` | Credit wallet (after payment) | 🔒 JWT |
| `PUT` | `/api/wallet/transfer` | Transfer to another wallet | 🔒 JWT |
| `GET` | `/api/wallet/transactions` | Transaction history | 🔒 JWT |

### 📊 Assets — `/api/assets`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/assets` | Get user's coin holdings | 🔒 JWT |
| `GET` | `/api/assets/{assetId}` | Specific asset details | 🔒 JWT |

### ⭐ Watchlist — `/api/watchlist`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/watchlist/user` | Get user's watchlist | 🔒 JWT |
| `POST` | `/api/watchlist/add/coin/{coinId}` | Add coin to watchlist | 🔒 JWT |

### 💸 Withdrawal
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/withdrawal/{amount}` | Create withdrawal request | 🔒 JWT |
| `PATCH` | `/api/admin/withdrawal/{id}/proceed/{accept}` | Admin approve/decline | 🔒 Admin |
| `GET` | `/api/admin/withdrawal` | All withdrawal requests | 🔒 Admin |

### 💳 Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/payment/{paymentMethod}/amount/{amount}` | Create payment link | 🔒 JWT |
| `GET` | `/api/payment` | Verify payment callback | 🔒 JWT |

---

## 🚀 Getting Started

> **Prerequisites:** Java 21+, Maven 3.6+, Node.js 16+, MySQL 8+

```bash
# 1. Clone & enter
git clone https://github.com/himanshugupta91/CoinX-Cryptocurrency-Trading-Platform.git
cd CoinX-Cryptocurrency-Trading-Platform

# 2. Create MySQL database
mysql -u root -p -e "CREATE DATABASE trading_platform;"

# 3. Backend — configure application.properties (see Environment Variables below)
cd "Backend-Spring boot"
mvn clean install && mvn spring-boot:run    # ✅ Runs at http://localhost:5454

# 4. Frontend
cd "../Frontend-React"
npm install && npm run dev                  # ✅ Runs at http://localhost:5173
```

---

## 🔑 Environment Variables

> ⚠️ The `application.properties` file is **gitignored** for security. You must create it yourself.

| Variable | Purpose | Where to Get |
|---|---|---|
| `spring.datasource.*` | MySQL connection | Your local MySQL |
| `razorpay.key.id` / `secret` | Razorpay payments | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `stripe.api.key` | Stripe payments | [Stripe Dashboard](https://dashboard.stripe.com) |
| `spring.mail.*` | Email OTP | Gmail App Password |
| Google OAuth2 credentials | Google login | [Google Cloud Console](https://console.cloud.google.com) |

---

## 🤝 Contributing

1. **Fork** the repo
2. Create a branch — `git checkout -b feature/something`
3. Commit — `git commit -m 'add something'`
4. Push — `git push origin feature/something`
5. Open a **Pull Request**

---

## 📄 License

MIT License. See [LICENSE](LICENSE) file for details.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=120&section=footer" width="100%" />
</p>

<p align="center">
  Built with ❤️ by <a href="https://github.com/himanshugupta91">Himanshu</a>
</p>
