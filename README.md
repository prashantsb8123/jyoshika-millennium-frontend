# Jyoshika Millennium

Luxury jewellery e-commerce web application with a React (Vite + TypeScript) storefront/admin dashboard and a Spring Boot backend.

## Project Structure

- `src/` — React + TypeScript frontend (storefront and admin dashboard)
- `backend/` — Spring Boot 3 backend (REST API, PostgreSQL, JWT auth, Razorpay payments)

## Run Locally

**Prerequisites:** Node.js 18+, Java 24, PostgreSQL, Maven

### Backend

1. Copy `.env.example` to `.env` (or otherwise set the listed environment variables) and fill in your own values.
2. From `backend/`, run `mvn spring-boot:run`.

### Frontend

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` if the backend isn't running on `http://localhost:8080`.
3. Run the app: `npm run dev`
