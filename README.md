# Kandan

A kanban-style project management application built from scratch as a portfolio project. Kandan allows users to create boards, organize columns, and manage items with support for nested child items.

## Tech Stack

**Backend**
- Java 21
- Quarkus 3.34
- Hibernate ORM with Panache
- PostgreSQL
- Flyway (database migrations)
- SmallRye OpenAPI (Swagger UI)

**Frontend**
- React 19 with TypeScript
- Vite
- TanStack Query (data fetching)
- Axios
- Tailwind CSS

**Infrastructure**
- Docker (local PostgreSQL)
- Git Flow branching strategy

## Features

- Create and list boards
- Create columns inside a board
- Create items inside columns
- Support for nested items (parent/child hierarchy)
- REST API with full Swagger documentation

## Getting Started

### Prerequisites

- WSL2 (Ubuntu) or Linux/macOS
- Docker Desktop
- Java 21 (via SDKMAN)
- Node.js 20+ (via nvm)
- Quarkus CLI

### Running locally

**1. Clone the repository**
```bash
git clone https://github.com/notSoDaniel/kandan-app.git
cd kandan-app
```

**2. Start the database**
```bash
docker compose up -d
```

**3. Start the backend**
```bash
cd kandan-backend
quarkus dev
```

The API will be available at `http://localhost:8080`.
Swagger UI: `http://localhost:8080/q/swagger-ui`

**4. Start the frontend**
```bash
cd kandan-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /boards | List all boards |
| POST | /boards | Create a board |
| PUT | /boards/{id} | Update a board |
| DELETE | /boards/{id} | Delete a board |
| GET | /column/board/{boardId} | List columns by board |
| POST | /column | Create a column |
| PUT | /column/{id} | Update a column |
| DELETE | /column/{id} | Delete a column |
| GET | /items/column/{columnId} | List items by column |
| POST | /items | Create an item |
| PUT | /items/{id} | Update an item |
| DELETE | /items/{id} | Delete an item |

## Roadmap

- [ ] Drag and drop for columns and items
- [ ] Nested item visualization
- [ ] Authentication
- [ ] Deploy to cloud (Vercel + Railway)

## License

MIT