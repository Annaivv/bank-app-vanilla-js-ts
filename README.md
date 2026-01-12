# 🏦 Example Bank Application

This project is a vanilla JavaScript + TypeScript banking application that simulates basic operations on a user’s bank account.

## 🚀 Features

- **User Registration**: A new signup system that allows users to create accounts dynamically.
- **Dynamic Credential Generation**: Automatically generates unique usernames based on user initials (e.g., "John Smith" → "js").
- **Intelligent Localization**: Automatically detects the user's browser locale and region to set the default currency using modern `Intl` APIs.
- **Secure Authentication**: Allows users to log in securely to both predefined test accounts and newly created user profiles.
- **Financial Overview**: Displays real-time account balance and a detailed, localized transaction history.
- **Peer-to-Peer Transfers**: Enables secure money transfers between different users within the application.
- **Loan Management**: A dedicated system to request loans, which are instantly processed and reflected in the account movements.
- **Automated Financial Summaries**: Provides real-time calculations of total incomes, expenses, and interest accrued.
- **Smart Notifications**: A centralized feedback system providing clear toasts for errors, warnings, successful actions, and general information.

## 🛠 Technical Improvements

This project is a refactor of the "Bankist" app from Jonas Schmedtmann's JavaScript course.
I have significantly upgraded the codebase by:

- **TypeScript Migration**: Implemented strict type-checking for better developer experience and fewer bugs.
- **Modular Architecture**: Split the monolithic script into specialized modules.
- **Modern Tooling**: Moved from a standard script tag to **Vite** for optimized bundling and deployment.
- **Data persistence**: Account data are saved in localStorage after a loan request or a money transfer is performed. Account data are retrieved from localStorage if already stored, and from accounts array stored locally otherwise.
- **Notifications**: A user gets a notification when an action was successful, on the error occured with a comprehensive error message, warnings and useful information.
- **Service-Oriented Architecture**: Moved beyond simple modules to a "Controller-Service" pattern. The userService handles business logic (user creation/validation), while main.ts acts as a clean controller for event delegation.
- **External Library Integration (iso-country-currency)**: Leveraged a specialized 3rd party library to bridge the gap between browser-detected regions and financial standards. This allows for:
  - **Standardized Mapping**: Accurately mapping ISO country codes (e.g., "UA") to official currency codes ("UAH").
  - **Scalability**: Avoiding brittle, hardcoded maps by using a community-maintained database for international currency standards.
