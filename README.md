# Space Pirates API

This API provides endpoints for managing space pirates and their ships. It is built using Node.js, Express, and Postgres.

## Table of Contents

- [Installation](#installation)
- [Swagger Documentation](#swagger-documentation)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/space-pirates-api.git
   ```
2. Install dependencies:
   ```
   cd space-pirates-api
   npm install
   ```
3. Create a `.env` file and set up your environment variables.
4. Start the development server:
   ```
   npm run dev
   ```

## Swagger Documentation

Once the server is running, the API documentation is available at `http://localhost:3000/api-docs`.

## To Do Eventually

- Add authentication
- Move swagger docs to a static file generated at build time
- Minify the api code to shrink total image size
- Move the shared base docker image into a custom built / updated docker image
