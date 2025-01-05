# Advanced Authentication MERN & Next.js

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Stars](https://img.shields.io/github/stars/kushalpatel0265/Advanced-Authentication-MERN-Next.js?style=social)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Welcome to the **Advanced Authentication MERN & Next.js** repository! This project demonstrates a robust authentication system built using the MERN stack (MongoDB, Express.js, React, Node.js) integrated with Next.js for server-side rendering and enhanced performance. It showcases advanced authentication features ensuring secure user management for modern web applications.

## Features

- **User Registration & Login:** Secure user signup and login functionalities.
- **JWT Authentication:** Implements JSON Web Tokens for stateless authentication.
- **OAuth Integration:** Supports third-party authentication via Google and GitHub.
- **Password Reset:** Allows users to reset their passwords through email verification.
- **Email Verification:** Ensures users verify their email addresses during registration.
- **Protected Routes:** Restricts access to certain pages based on authentication status.
- **Responsive UI:** Built with Next.js and React for a seamless user experience across devices.

## Demo

![Authentication Flow](./assets/auth-flow.png)

*Screenshot showcasing the authentication flow.*

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React.js](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/) (or any CSS framework used)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)

- **Authentication:**
  - [JSON Web Tokens (JWT)](https://jwt.io/)
  - [Passport.js](http://www.passportjs.org/) for OAuth strategies

- **Other Tools:**
  - [Nodemailer](https://nodemailer.com/) for email services
  - [dotenv](https://github.com/motdotla/dotenv) for environment variables

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kushalpatel0265/Advanced-Authentication-MERN-Next.js.git
   cd Advanced-Authentication-MERN-Next.js
   ```

2. **Install Dependencies**

   - **Backend:**

     ```bash
     cd backend
     npm install
     ```

   - **Frontend:**

     ```bash
     cd ../frontend
     npm install
     ```

3. **Set Up Environment Variables**

   - **Backend:**

     Create a `.env` file in the `backend` directory and add the following:

     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     CLIENT_URL=http://localhost:3000
     ```

   - **Frontend:**

     Create a `.env.local` file in the `frontend` directory and add the following:

     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     NEXTAUTH_URL=http://localhost:3000
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     GITHUB_CLIENT_ID=your_github_client_id
     GITHUB_CLIENT_SECRET=your_github_client_secret
     ```

4. **Run the Application**

   - **Backend:**

     ```bash
     cd backend
     npm run dev
     ```

   - **Frontend:**

     ```bash
     cd ../frontend
     npm run dev
     ```

   The application should now be running at `http://localhost:3000`.

## Configuration

### OAuth Providers

To enable OAuth authentication, you need to set up applications with the respective providers:

- **Google:**
  - Go to [Google Developers Console](https://console.developers.google.com/).
  - Create a new project and set up OAuth credentials.
  - Obtain the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

- **GitHub:**
  - Go to [GitHub Developer Settings](https://github.com/settings/developers).
  - Register a new OAuth application.
  - Obtain the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

### Email Service

The application uses Nodemailer for sending emails. Ensure you provide valid email credentials in the `.env` file.

## Usage

1. **Register a New User**

   - Navigate to the registration page.
   - Fill in the required details.
   - Check your email for the verification code and verify your account.

2. **Login**

   - Use your registered credentials to log in.
   - Alternatively, use OAuth providers (Google or GitHub) to authenticate.

3. **Password Reset**

   - If you forget your password, use the "Forgot Password" feature.
   - An email will be sent with instructions to reset your password.

4. **Access Protected Routes**

   - Once authenticated, access routes that require authentication.

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/forgot-password` - Initiate password reset
- **POST** `/api/auth/reset-password` - Reset password
- **GET** `/api/auth/verify-email?token=...` - Verify email address

### User

- **GET** `/api/user/profile` - Get user profile (Protected)
- **PUT** `/api/user/profile` - Update user profile (Protected)
- 
## Contributing

Contributions are welcome! Please follow these steps:

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Author:** Kushal Patel
- **Email:** kushalpatel0265@example.com
- **GitHub:** [kushalpatel0265](https://github.com/kushalpatel0265)
