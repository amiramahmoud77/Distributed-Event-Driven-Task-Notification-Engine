# 🌟 Distributed Event-Driven Task & Notification Engine

> An enterprise-grade, event-driven system built with Node.js, Express, TypeScript, MongoDB, and BullMQ for asynchronous task processing and automated email notifications, with a React + Vite dashboard.

---

## 🛠️ Tech Stack & Architecture

**Backend**
- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (with User association & Task ownership)
- **Queue & Event Broker:** BullMQ & Redis (Asynchronous event-driven architecture)
- **Authentication:** JWT-based Auth with Role-Based Access Control (RBAC)
- **Security & Logging:** Helmet (HTTP Security Headers), Express Rate Limit, Winston (Centralized Logging)
- **Email Service:** Nodemailer for automated background notifications
- **API Documentation:** OpenAPI 3.0 / Swagger UI (Modular YAML architecture)

**Frontend**
- **Framework:** React + TypeScript, built with Vite
- **Styling:** Tailwind CSS, lucide-react icons
- **Features:** Signup / Login screens, dashboard, light & dark mode
- **API access:** relative `/api/*` calls, forwarded to the backend by the Vite dev proxy

**DevOps**
- Docker & Docker Compose (multi-container orchestration)
- GitHub Actions & Docker Hub integration (CI/CD)

---

## 🌟 Key Features Implemented

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Authentication & RBAC** | Secure JWT authentication with role-based access control (Admin / User). | ✅ Completed |
| **Task CRUD Operations** | Full lifecycle management of tasks linked to specific users. | ✅ Completed |
| **Filtering, Search & Pagination** | Advanced query filtering by status/priority, regex title search, and pagination. | ✅ Completed |
| **Task Status Workflow** | Dedicated state transition management (`pending`, `in-progress`, `completed`, `cancelled`). | ✅ Completed |
| **Event-Driven Architecture** | Decoupled background processing using BullMQ for asynchronous task events. | ✅ Completed |
| **Automated Notifications** | Background workers processing queue events to dispatch instant email notifications. | ✅ Completed |
| **Global Error Handling & Logging** | Centralized error management with custom operational classes and Winston persistent logging (`logs/`). | ✅ Completed |
| **Security & Rate Limiting** | Helmet HTTP headers and Express Rate Limit to prevent DDoS/Brute-force attacks. | ✅ Completed |
| **Docker Containerization** | Fully containerized environment (API, frontend, MongoDB, Redis) with Docker Compose. | ✅ Completed |
| **CI/CD Automation Pipeline** | Automated build verification, TypeScript compilation checks, and continuous deployment to Docker Hub. | ✅ Completed |
| **API Documentation** | OpenAPI 3.0 / Swagger documentation using modular YAML files (`/api-docs`). | ✅ Completed |
| **Web Dashboard** | React + Vite frontend with signup, login, and a dashboard. | ✅ Completed |

---

## 🌐 Access URLs (when running via Docker)

| Service | URL |
| :--- | :--- |
| **Frontend (Vite)** | http://localhost:5173 |
| **Backend API** | http://localhost:5001 |
| **Swagger Docs** | http://localhost:5001/api-docs |
| **MongoDB (from host, e.g. Compass)** | `mongodb://127.0.0.1:27018` |
| **Redis (from host)** | `127.0.0.1:6379` |

---

## 🔌 Auth Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Log in (`email`, `password`) and receive a JWT |

> From the frontend, call these as relative paths (`/api/auth/login`). In Docker, Vite forwards `/api/*` to the `app` service.

---

## 🔄 Event-Driven Flow (BullMQ Workflow)

1. **User Action:** A user creates, updates, or changes the status of a task via the API.
2. **Event Dispatch:** The controller pushes an event payload (`TASK_CREATED`, `TASK_UPDATED`, `TASK_STATUS_CHANGED`) to the Redis-backed BullMQ queue.
3. **Background Worker:** The dedicated `task.worker.ts` picks up the job asynchronously.
4. **Notification Dispatch:** The worker triggers the email service to notify the user instantly without blocking the main event loop.

---

## 🐳 Docker & Containerization (DevOps Guide)

The whole stack runs with a single command, without installing MongoDB or Redis locally.

### 📦 Services Breakdown

1. **`app` (Node.js & TypeScript API)**
   - Built from the root `Dockerfile` (`node:20-alpine`).
   - Connects to MongoDB and Redis inside the Docker network.
   - Exposed on host port `5001` (`5001:5000`) to avoid local port conflicts.
2. **`frontend` (React + Vite)**
   - Built from `Dockerfile.frontend`, which copies only the `frontend/` folder.
   - Runs the Vite dev server on port `5173`.
   - `VITE_API_PROXY=http://app:5000` tells Vite where to forward `/api/*` requests inside the Docker network.
3. **`mongo` (Database)**
   - Official `mongo:7` image with a named volume (`mongo_data`) so data persists across restarts.
   - Exposed on host port `27018` (mapped to `27017` inside the container) to avoid clashing with a local MongoDB.
4. **`redis` (Broker & Queue)**
   - `redis:7-alpine`, powers BullMQ background jobs.

### 🛡️ Database Health Checks & Startup Reliability

- The `mongo` container has a health check (`mongosh` ping) that confirms the database is responsive.
- The `app` service uses `condition: service_healthy` in `depends_on`, so Node.js starts only after MongoDB is ready.

### 🚀 How to Run with Docker

1. Make sure Docker Desktop is running.
2. Create your `.env` file at the repository root from the example, then set real values:

   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/task-engine
   REDIS_HOST=redis
   REDIS_PORT=6379
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

   Email settings for Nodemailer are listed in `.env.example`.

3. Start everything in detached mode:

   ```bash
   docker-compose up -d --build
   ```

4. Check the services:

   ```bash
   docker-compose ps
   docker-compose logs frontend --tail 20
   docker-compose logs app --tail 20
   ```

5. Open http://localhost:5173, create an account, and log in.

To stop everything (data is kept in the `mongo_data` volume):

```bash
docker-compose down
```

---

## 💻 Local Development (without Docker)

**Backend** (needs MongoDB and Redis running locally):

```bash
npm install
npm run dev:server
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Outside Docker, the Vite proxy defaults to `http://localhost:5000`. To point it elsewhere, set `VITE_API_PROXY` before starting Vite.

---

## 🧯 Troubleshooting

| Problem | Fix |
| :--- | :--- |
| `failed to connect to the docker API` | Docker Desktop is not running. Start it and wait until it is ready. |
| `ports are not available: ... 27017` | Another process holds the port. The compose file already maps Mongo to `27018`; if it persists, restart Docker Desktop (`wsl --shutdown`, then reopen it). |
| Red squiggles in VS Code on every JSX tag | Local `node_modules` are missing. Run `npm install` inside `frontend/`, then restart the TS server. Docker is not affected. |
| Frontend loads but login/signup fails | Check `docker-compose logs app`, and confirm `VITE_API_PROXY` is set on the `frontend` service. |

---

## Continuous Integration & Continuous Deployment (CI/CD)

The project uses **GitHub Actions** for an automated CI/CD pipeline.

```
[ Push / Merge to main ]
│
├──> 1. CI Phase: Run Automated Build & TypeScript Checks (tsc)
│
└──> 2. CD Phase: Authenticate with Docker Hub
     │
     └──> Build Docker Image & Push to Docker Hub (`<username>/task-engine:latest`)
```

### ⚙️ Pipeline Lifecycle & Automation Mechanics

1. **Continuous Integration (CI):**
   - Triggers on any `push` or `pull_request` targeting `main`.
   - Sets up a clean Node.js environment, installs dependencies via `npm ci`, and runs `npm run build` (`tsc`) to catch compilation errors before merging.
2. **Continuous Deployment (CD):**
   - Runs after CI passes on a push/merge to `main`.
   - Authenticates with Docker Hub using encrypted repository secrets (`DOCKER_USERNAME` and `DOCKER_PASSWORD`).
   - Builds the production Docker image and publishes it to Docker Hub.

---

## 📄 API Documentation (Swagger)

Interactive OpenAPI 3.0 documentation, structured as modular YAML files under `src/docs/`.

- **Access URL (when running via Docker):** http://localhost:5001/api-docs
- **Documented Modules:**
  - **Auth (`auth.yaml`):** User registration and login
  - **Tasks (`tasks.yaml`):** Task creation and retrieval with JWT Bearer authentication
