# Professional Services Booking System
This project is a comprehensive system for managing professional services appointments. It includes features for user management, service creation, professional scheduling, and appointment handling through a well-defined database schema utilizing Drizzle ORM and PostgreSQL.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- 
## Features
- **User Authentication**: Implements user authentication using OpenID.
- **Service Management**: Create, read, update, and delete services.
- **Professional Management**: Manage professionals along with their services and schedules.
- **Appointment Management**: Clients can book, modify, and cancel appointments.
- **Break Scheduled Management**: Takes into account breaks in professional schedules.
- 
## Technologies Used
- **TypeScript**: For type-safe JavaScript development.
- **Drizzle ORM**: For database interaction using PostgreSQL.
- **Express.js**: For building the application server.
- **PostgreSQL**: The database system used for storing application data.
- **Passport.js**: For handling user authentication through OpenID.

## Setup and Installation
1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    
2. **Install dependencies**:
   Install the necessary packages using npm:
   ```bash
   npm install
   ```
   
3. **Set environment variables**:
   Make sure to set the required environment variables in a .env file:
   ```plaintext
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   REPL_ID=your_repl_id
   REPLIT_DOMAINS=your_replit_domains
   ISSUER_URL=https://replit.com/oidc
   ```

4. **Start the application**:
   To run your application, use:
   ```bash
   npm start
   ```
   The application will be accessible at http://localhost:5000.


## Usage
- Navigate to the provided endpoint to access the application.
- You can register as a user and start using the services provided.
- The authentication is handled through the login endpoint, which redirects you to the appropriate authentication provider.

## API Endpoints
- **GET /api/login**: Start the login process.
- **GET /api/callback**: Callback endpoint for authentication.
- **GET /api/logout**: Logout from the application.
- **/api/appointments**: Manage appointments (Create, Update, Delete).
- **/api/services**: Manage services (Create, Update, Delete).
- **/api/professionals**: Manage professionals and their schedules.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
