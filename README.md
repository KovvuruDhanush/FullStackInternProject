# Store Rating App

## Overview
The **Store Rating App** is a web application that allows users to rate stores based on their experience. It consists of a backend built using **Spring Boot** and a frontend developed with **React.js**.

## Features
### Backend (Spring Boot)
- REST API for managing store ratings
- User authentication and authorization
- Database integration with PostgreSQL
- Error handling and validation

### Frontend (React.js)
- User-friendly UI for rating stores
- Dynamic updates using React state
- API integration with backend

## Tech Stack
### Backend:
- **Spring Boot** (Java)
- **PostgreSQL** (Database)
- **Spring Security** (Authentication & Authorization)
- **JWT** (Token-based authentication)
- **Maven** (Build tool)

### Frontend:
- **React.js** (JavaScript)
- **Axios** (API calls)
- **Tailwind CSS** (Styling)

## Installation
### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/store-rating-backend.git
   cd store-rating-backend
   ```
2. Configure the database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/store_rating
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   ```
3. Run the application:
   ```sh
   mvn spring-boot:run
   ```

### Frontend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/store-rating-frontend.git
   cd store-rating-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token

### Store Ratings
- `GET /api/stores` - Get all stores
- `POST /api/stores/{id}/rate` - Rate a store
- `GET /api/stores/{id}/ratings` - Get store ratings

## Contributing
Feel free to fork the repository and submit pull requests. Contributions are welcome! 😊

## License
This project is licensed under the MIT License.

## Contact
For any queries, reach out at kovurudhanush@gmail.com .
