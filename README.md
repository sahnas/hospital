# Hospital Management System

## Project Structure

```
hospital/
├── hospital-be/     # Node.js backend
├── hospital-fe/     # Angular frontend
├── hospital-lib/    # Shared library
├── package.json     # Main monorepo configuration
├── Dockerfile       # Docker configuration for all services
├── docker-compose.yml # Docker Compose configuration
└── README.md        # This file
```

## Prerequisites

- Node.js (recommended version: 14.x or higher)
- Yarn (version 1.x)
- Docker and Docker Compose (for containerized setup)

## Installation

1. Clone the repository:
   ```
   git clone [REPO_URL]
   cd hospital
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Available Scripts

- `yarn clean`: Clean build folders and cache
- `yarn build:lib`: Build the shared library
- `yarn install:fe`: Install frontend dependencies
- `yarn start:be`: Start the backend server
- `yarn start:fe`: Start the frontend development server
- `yarn prepare:all`: Prepare all projects (cleaning, building, installation)
- `yarn start:all`: Start all services (backend and frontend)

## Quick Start

### Using Yarn

To start the entire system:

```
yarn start:all
```

This will prepare all projects, start the backend, and then the frontend.

### Using Docker

To start the entire system using Docker:

```
docker-compose up --build
```

This will build the Docker images and start the containers for both the backend and frontend services.

## Development

### hospital-lib

The shared library uses TypeScript, ESLint, Prettier, Alsatian, and Jest.

#### Specific Scripts

- `yarn build:vite`: Build with Vite
- `yarn build:dev`: Build in development mode
- `yarn build:prod`: Build in production mode
- `yarn test`: Run Alsatian tests
- `yarn test:jest`: Run Jest tests
- `yarn test:watch`: Run Jest tests in watch mode
- `yarn lint`: Lint the code
- `yarn format`: Format the code with Prettier

### hospital-fe

The frontend is an Angular application.

### hospital-be

The backend is a Node.js application.

## Docker Setup

The project includes a Dockerfile and docker-compose.yml for containerized deployment.

### Dockerfile

The Dockerfile is set up to build and run both the backend and frontend services. It uses a multi-stage build process to optimize the image size and build times.

### Docker Compose

The docker-compose.yml file defines two services:

1. `hospital-be`: The backend service
2. `hospital-fe`: The frontend service

To run the application using Docker Compose:

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:4200
   - Backend: http://localhost:7200

3. To stop the containers:
   ```
   docker-compose down
   ```

## Testing

Each project in the monorepo has its own test suites. Refer to individual READMEs for more details.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.