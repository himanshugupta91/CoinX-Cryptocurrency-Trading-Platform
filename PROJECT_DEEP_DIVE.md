# Project Deep Dive: CoinX Cryptocurrency Trading Platform

This document is your **"Cheat Sheet"** for explaining your project in an interview. It breaks down the "Why", "How", and "What" of your system.

---

## 🚀 1. The Elevator Pitch (30 Seconds)
"I built **CoinX**, a full-stack cryptocurrency trading platform similar to Binance or Coinbase. It allows users to manage wallets, trade cryptocurrencies in real-time, and track their portfolio performance.
Technically, it's a **Spring Boot** monolithic backend serving a **React** frontend. I used **MySQL** for data persistence and integrated **Stripe** and **Razorpay** for handling fiat payments. Security is handled via **JWT** and **Spring Security**."

---

## 🏗️ 2. System Architecture

### **High-Level Design**
*   **Architecture Pattern**: Monolithic (Simpler to deploy/manage for this scale).
*   **Frontend**: React (Vite) + Redux (State Management) + TailwindCSS (Styling).
*   **Backend**: Spring Boot (REST API) + Hibernate/JPA (ORM).
*   **Database**: MySQL (Relational data for Users, Orders, Wallets).
*   **External APIs**:
    *   **CoinGecko**: For fetching real-time crypto market data.
    *   **Stripe/Razorpay**: For processing fiat deposits.

### **Why this stack?**
*   **Java/Spring Boot**: Chosen for its robustness, strict typing, and excellent ecosystem for FinTech applications (transaction management, security).
*   **React**: For a responsive, Single Page Application (SPA) experience that feels like a native app.
*   **MySQL**: ACID compliance is non-negotiable for financial transactions (ensuring money isn't lost).

---

## 🔄 3. Key Workflows (The "How It Works")

### **A. Authentication Flow (Security)**
1.  **User Login**: User sends credentials to `/auth/signin`.
2.  **Token Generation**: Backend validates creds and generates a **JWT (JSON Web Token)** using `JwtProvider.java`.
    *   *Claim*: Includes user email and roles (ROLE_CUSTOMER, ROLE_ADMIN).
    *   *Expiration*: Set to 24 hours.
3.  **Storage**: Frontend stores the JWT in `localStorage`.
4.  **Requests**: Axios interceptors attach `Authorization: Bearer <token>` to every subsequent API reference.
5.  **Validation**: Spring Security's filter chain validates the token signature on every protected request.

### **B. Placing a Buy Order (The Core Feature)**
*Endpoint*: `POST /api/orders/pay` (Handled by `OrderController`)

1.  **Request**: Frontend sends `coinId`, `quantity`, and `orderType` (BUY).
2.  **Validation**: `OrderService` checks if the coin exists and if the user is valid.
3.  **Transaction Start** (`@Transactional`):
    *   **Price Check**: System calculates the total cost (`price * quantity`).
    *   **Wallet Deduction**: Calls `WalletService.payOrderPayment()`.
        *   *Check*: Does user have enough balance?
        *   *Deduct*: `balance = balance - cost`.
    *   **Order Creation**: Saves a new `Order` entity with status `PENDING` or `SUCCESS`.
    *   **Asset Update**: Finds or creates an `Asset` record for that user and coin, increasing their holding.
4.  **Response**: Returns the created Order object.

### **C. Wallet Top-Up (Payment Gateway)**
1.  **Initiation**: User selects amount and provider (e.g., Stripe).
2.  **Creation**: Backend calls Stripe API to create a `PaymentIntent`.
3.  **User Action**: User enters card details on Frontend.
4.  **Verification**:
    *   *Callback*: On success, Frontend calls backend `/api/wallet/deposit`.
    *   *Update*: Backend verifies payment ID and updates `Wallet` balance.

---

## 💻 4. Code Highlights & Patterns

### **Controller-Service-Repository Pattern**
You used the standard layered approach:
*   **Controller** (`OrderController`): Handles HTTP requests, parses JWT, returns DTOs.
*   **Service** (`OrderServiceImpl`): Contains all business logic (calculations, rules).
*   **Repository** (`OrderRepository`): Handles DB interactions (find by user, save).

### **Exception Handling**
*   **Global Exception Handler**: You likely have a `@ControllerAdvice` class.
*   **Custom Exceptions**: `WalletException` allows you to catch specific business errors (like "Insufficient Funds") and return a clean 400 Bad Request instead of a generic 500 Error.

### **Strategy Pattern (Implicit)**
*   You have `PaymentService` handling generic payments, but specific implementations for `Razorpay` and `Stripe`. This shows you can write extensible code—adding "PayPal" later would be easy.

---

## ❓ 5. Anticipated "Tough" Questions

**Q: How do you handle concurrency? (e.g., Two buy orders at the exact same time)**
*   **A**: "Currently, I rely on database transactions (`@Transactional`). For a production scale, I would add **Optimistic Locking** (`@Version` column in JPA) on the Wallet entity to prevent race conditions where two threads try to deduct balance from the same wallet version."

**Q: Why do you store price as `BigDecimal`?**
*   **A**: "Floating point arithmetic (float/double) can introduce rounding errors. In FinTech, even a fraction of a penny matters, so `BigDecimal` provides arbitrary precision for exact calculations."

**Q: How did you handle the 3rd party API limits (CoinGecko)?**
*   **A**: "If the API rate limits us, I would implement **Caching** (using generic Spring Cache or Redis). We store the price for 60 seconds. If a user asks for the price, we serve the cached version instead of hitting the API again."
