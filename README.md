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

## Technologies

*   **Frontend:** React Native, TypeScript, Expo, React Navigation, React Native Chart Kit
*   **Backend:** Spring Boot, Spring Data JPA, Spring Security (BCrypt), Hibernate
*   **Database:** PostgreSQL
