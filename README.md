# Mobile Currency Exchange System

A complete mobile currency exchange application enabling users to buy, sell, and track currencies with real-time rates from the National Bank of Poland (NBP).

## Project Overview

*   **Mobile App:** React Native (Expo)
*   **Backend:** Java Spring Boot
*   **Database:** PostgreSQL
*   **API Integration:** NBP (Narodowy Bank Polski)

## Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** & **npm**
*   **Java JDK 17+**
*   **Maven**
*   **PostgreSQL**

## Database Setup

1.  Open your terminal and verify PostgreSQL is running.
2.  Create the database:
    ```bash
    psql -U postgres -c "CREATE DATABASE exchangecurrency;"
    ```
    *(If you don't have `psql` in your path, use pgAdmin or your preferred tool to create a database named `exchangecurrency`)*

## Quick Start (Using Scripts)

We have provided easy-to-use scripts to run the project.

### 1. Run Backend
Open a terminal in the project root and run:
```bash
./run-backend.sh
```

### 2. Run Mobile App
Open a **new** terminal window in the project root and run:
```bash
./run-mobile.sh
```
*Follow the on-screen instructions (press `w` for Web, `i` for iOS, `a` for Android).*

## Manual Setup (Alternative)

### Backend
1.  Navigate to `backend` folder.
2.  Run `mvn spring-boot:run`.

### Mobile
1.  Navigate to `mobile` folder.
2.  Run `npm install` then `npm start`.

## Features

*   **User Authentication:** Secure registration and login.
*   **Real-time Rates:** Fetches current exchange rates from NBP API.
*   **Currency Exchange:** Buy and sell currencies (USD, EUR, etc.) against PLN.
*   **Wallet Management:** View portfolio balance and history.
*   **Historical Data:** View currency rate trends via interactive charts.

## Remote Access (Ngrok) Setup

If you want to run the app on a physical device over a different network (using Ngrok):

1.  **Modify Mobile Config (`mobile/src/config.ts`):**
    Update the `BASE_URL` with your unique Ngrok URL.
    ```typescript
    export const API_CONFIG = {
      // BASE_URL: `http://${DEV_MACHINE_IP}:8080/api`, // Comment out Local IP
      BASE_URL: 'https://your-ngrok-url.ngrok-free.dev/api', // Use Ngrok URL
      TIMEOUT: 10000,
    };
    ```

2.  **Enable Tunnel Mode (`run-mobile.sh`):**
    Open `run-mobile.sh` and change the startup command to use the tunnel flag.
    ```bash
    # Change this line:
    npm start -- --lan
    
    # To this:
    npm start -- --tunnel
    ```

3.  **Run Ngrok:**
    Expose your local backend port (8080) to the internet.
    ```bash
    ngrok http 8080
    ```

## Technologies

*   **Frontend:** React Native, TypeScript, Expo, React Navigation, React Native Chart Kit
*   **Backend:** Spring Boot, Spring Data JPA, Spring Security (BCrypt), Hibernate
*   **Database:** PostgreSQL
