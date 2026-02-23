# Top 30 Interview Questions for CoinX Cryptocurrency Trading Platform

These questions are tailored to the technical stack and specific domains of your project (FinTech, Real-time Trading, Spring Boot, React).

## 🏗️ Architecture & System Design

1.  **Can you explain the high-level architecture of your trading platform?**
    *   *Focus*: Monolithic structure, communication between React and Spring Boot, Database interaction, and external API integrations (CoinGecko, Stripe).
2.  **Why did you choose a Monolithic architecture over Microservices for this project?**
    *   *Focus*: Complexity management for the current scale, ease of deployment, transaction management (ACID), and when you might consider splitting it (e.g., breaking out the 'Order Matching Engine' or 'User Service').
3.  **How does the application handle real-time cryptocurrency price updates?**
    *   *Focus*: Do you use WebSockets, Polling, or Server-Sent Events (SSE)? How efficiently does the frontend update the UI without freezing?
4.  **This is a FinTech application. How do you ensure ensure data consistency across multiple services (e.g., Wallet and Order Service)?**
    *   *Focus*: Database transactions (`@Transactional`), ACID properties, and how you handle failure scenarios (e.g., Order created but Wallet deduction failed).
5.  **How would you scale this application to handle 100,000 concurrent users placing orders?**
    *   *Focus*: Horizontal scaling (multiple backend instances), Load Balancing, Database read replicas, Caching (Redis) for coin prices, and potentially moving to an event-driven architecture (Kafka/RabbitMQ) for order processing.

---

## ☕ Backend Engineering (Spring Boot & Java)

6.  **Code Review Scenario**: In `WalleteServiceImplementation.java`, the method `payOrderPayment` calculates `newBalance` and checks:
    ```java
    if (newBalance.compareTo(order.getPrice()) < 0) { throw ... }
    ```
    **What is potentially wrong with this logic?**
    *   *Answer*: It compares the *remaining balance* with the *order price*, instead of checking if the remaining balance is non-negative (>= 0). If a user has $100 and buys $60, remaining is $40. $40 < $60 is True, so it throws "Insufficient funds" incorrectly.
7.  **How do you handle floating-point precision issues with financial data in Java?**
    *   *Focus*: Usage of `BigDecimal` over `double`/`float` to avoid rounding errors in money calculations.
8.  **Explain how the generic `UserService` and `CustomUserServiceImplementation` typically work with Spring Security.**
    *   *Focus*: `UserDetailsService` interface implementation, loading user by username, and returning `UserDetails` with authorities/roles.
9.  **What is the purpose of the `PaymentService` interface having implementations for both Razorpay and Stripe?**
    *   *Focus*: Strategy Pattern or abstraction to switch payment providers easily without changing business logic code.
10. **How does your exception handling work? I see a `WalletException` class.**
    *   *Focus*: Global Exception Handling (`@ControllerAdvice`), custom unchecked vs checked exceptions, and returning meaningful HTTP status codes (400 vs 500) to the frontend.
11. **Explain the role of `Lombok` in your specific Entity classes (e.g., `User`, `Order`).**
    *   *Focus*: Reducing boilerplate code (`@Data`, `@Builder`), but also potential pitfalls (e.g., `hashCode/equals` issues with JPA relationships/Circular references).
12. **How do you implement Pagination for fetching the Order History?**
    *   *Focus*: Using `Pageable` and `PageRequest` in Spring Data JPA repositories to avoid loading millions of records into memory.
13. **What is the difference between `@Controller` and `@RestController` in your API?**
    *   *Focus*: `@RestController` implies `@ResponseBody` on all methods, returning JSON directly suitable for your React frontend, whereas `@Controller` is typically for server-side rendering (JSP/Thymeleaf).
14. **How do you validate user input (like negative numbers for deposits)?**
    *   *Focus*: Bean Validation (`@Valid`, `@NotNull`, `@Min(0)`) in DTOs vs manual validation in Service layer.
15. **If the third-party CoinGecko API goes down, how does your system react?**
    *   *Focus*: Circuit Breaker pattern (Resilience4j), fallback mechanisms, or using cached data to prevent cascading failures.

---

## 💾 Database & Concurrency

16. **How do you prevent a 'Double Spend' problem where a user tries to withdraw the same funds twice simultaneously?**
    *   *Focus*: Database Locking (Optimistic `@Version` vs Pessimistic `select for update`), Isolation levels (`SERIALIZABLE`), or synchronized blocks (though bad for scaling).
17. **Explain the relationship between `User` and `Wallet` in your database schema.**
    *   *Focus*: One-to-One relationship. Design choice: Shared Primary Key vs Foreign Key. FetchType (Lazy vs Eager).
18. **In `WalletTransaction`, you store `purpose` as a String. Would an Enum be better? Why?**
    *   *Focus*: Data integrity, type safety, query efficiency, vs flexibility.
19. **How would you optimize a query to find the "Top 10 users with highest portfolio value"?**
    *   *Focus*: Indexing on balance columns, or maintaining a separate optimized table/cache if calculation involves complex joining of Assets * Current Price.
20. **What are the pros and cons of using JPA/Hibernate vs writing raw SQL / JDBC in this project?**
    *   *Focus*: Development speed (ORM) vs Performance/Control (SQL).

---

## 🔐 Security (Auth & Payments)

21. **How does JWT (JSON Web Token) flow work from Login to accessing a protected resource like `/api/wallet`?**
    *   *Focus*: Auth -> Token Generation -> Send to Client -> Client stores (localStorage/cookie) -> Client sends 'Authorization: Bearer' header -> Filter validates signature -> SecurityContext held.
22. **Why do you use `BCrypt` for password hashing? Can't we just use SHA-256?**
    *   *Focus*: Salting (prevents Rainbow table attacks) and Work Factor (slowness) to resist Brute Force attacks.
23. **You integrated OAuth2 (Social Login). How do you link a Google Account to an existing email/password user?**
    *   *Focus*: checking email usage on first OAuth login and linking identities in the User table.
24. **When processing payments (Stripe/Razorpay), how do you ensure the user actually paid before crediting the wallet?**
    *   *Focus*: Webhooks (Server-to-Server verification) vs trusting the Client-side success callback (Insecure).
25. **How do you secure your API against Cross-Site Scripting (XSS) and CSRF?**
    *   *Focus*: React automatically escapes content (XSS). For CSRF: Stateless JWTs are immune if stored in localStorage, but if in Cookies, SameSite attributes are needed.

---

## ⚛️ Frontend (React & State)

26. **How do you manage the application state for things like User Auth and Portfolio Data?**
    *   *Focus*: Redux (Global Store). Why use Redux over `useContext`? (Performance for frequent updates like prices, DevTools).
27. **Explain the folder structure choice `components/ui` vs `components/custom`.**
    *   *Focus*: Separation of primitive, reusable design system components (buttons, inputs - likely from shadcn/ui or Radix) vs domain-specific business components (OrderForm, WalletCard).
28. **How does your React application authenticate requests with the Backend?**
    *   *Focus*: Axios Interceptors to inject the JWT token automatically into headers of every request.
29. **What strategies do you use to optimize the performance of the Asset/Price Chart rendering (ApexCharts)?**
    *   *Focus*: Memoization (`React.memo`, `useMemo`), preventing re-renders when other parts of the dashboard update, downsampling data points.
30. **How would you handle a scenario where the backend token expires while the user is trading?**
    *   *Focus*: Silent Refresh Token flow (using an interceptor to catch 401s, refresh, retry original request) or Auto-Logout UX.
