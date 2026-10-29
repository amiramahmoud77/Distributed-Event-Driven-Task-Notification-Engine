
# 🌟 Distributed Event-Driven Task & Notification Engine

> An enterprise-grade, event-driven backend system built with Node.js, Express, TypeScript, MongoDB, and BullMQ for asynchronous task processing and automated email notifications.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (with User association & Task ownership)
- **Queue & Event Broker:** BullMQ & Redis (Asynchronous event-driven architecture)
- **Authentication:** JWT-based Auth with Role-Based Access Control (RBAC)
- **Security & Logging:** Helmet (HTTP Security Headers), Express Rate Limit, Winston (Centralized Logging)
- **DevOps & Containerization:** Docker & Docker Compose (Multi-container orchestration)
- **CI/CD Pipeline:** GitHub Actions & Docker Hub Integration
- **Email Service:** Nodemailer for automated background notifications
- **API Documentation:** OpenAPI 3.0 / Swagger UI (Modular YAML architecture)

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
| **Security & Rate Limiting** | Enterprise security hardening using Helmet HTTP headers and Express Rate Limit to prevent DDoS/Brute-force attacks. | ✅ Completed |
| **Docker Containerization** | Fully containerized environment with Docker & Docker Compose for seamless deployment. | ✅ Completed |
| **CI/CD Automation Pipeline** | Automated build verification, TypeScript compilation checks, and continuous deployment to Docker Hub. | ✅ Completed |
| **API Documentation** | Professional OpenAPI 3.0 / Swagger documentation using modular YAML files (`/api-docs`). | ✅ Completed |

---

##  Continuous Integration & Continuous Deployment (CI/CD)

The project leverages **GitHub Actions** for an automated, production-grade CI/CD pipeline, ensuring high code quality and seamless container delivery.


```

[ Push / Merge to main ]
│
├──> 1. CI Phase: Run Automated Build & TypeScript Checks (tsc)
│
└──> 2. CD Phase: Authenticate with Docker Hub
│
└──> Build Docker Image & Push to Docker Hub (`/task-engine:latest`)

```

### ⚙️ Pipeline Lifecycle & Automation Mechanics:
1. **Continuous Integration (CI):**
   - Triggers automatically on any `push` or `pull_request` targeting the `main` branch.
   - Sets up a clean Node.js environment, installs dependencies via `npm ci`, and executes `npm run build` (`tsc`) to guarantee zero compilation errors before merging.
2. **Continuous Deployment (CD):**
   - Automatically executes after the CI checks pass upon pushing/merging to `main`.
   - Authenticates securely with **Docker Hub** using encrypted repository secrets (`DOCKER_USERNAME` and `DOCKER_PASSWORD`).
   - Builds the production Docker image and publishes it instantly to Docker Hub.

---

## 📄 API Documentation (Swagger)

The project includes an interactive, enterprise-grade OpenAPI 3.0 (Swagger) documentation, structured cleanly using modular YAML files under `src/docs/`.

- **Access URL (when running via Docker):** `http://localhost:5001/api-docs`
- **Documented Modules:**
  - **Auth (`auth.yaml`):** User registration and login (`/api/v1/auth/*`)
  - **Tasks (`tasks.yaml`):** Task creation and retrieval with JWT Bearer authentication (`/api/v1/tasks/*`)

---

## 🔄 Event-Driven Flow (BullMQ Workflow)

1. **User Action:** A user creates, updates, or changes the status of a task via the API.
2. **Event Dispatch:** The controller pushes an event payload (`TASK_CREATED`, `TASK_UPDATED`, `TASK_STATUS_CHANGED`) to the Redis-backed BullMQ queue.
3. **Background Worker:** The dedicated `task.worker.ts` picks up the job asynchronously.
4. **Notification Dispatch:** The worker triggers the email service to notify the user instantly without blocking the main event loop.

---

## ⚙️ Getting Started & Deployment

### Prerequisites
- Node.js & npm installed (for local development)
- **Docker & Docker Compose** (Recommended for seamless running)

---

## 🐳 Docker & Containerization (DevOps Guide)

This project is fully containerized and orchestrated using **Docker Compose**, allowing you to run the complete microservices architecture (Node.js API, MongoDB, and Redis) with a single command without installing databases locally.

### 📦 Services Breakdown
1. **`app` (Node.js & TypeScript API):** 
   - Built using a lightweight `node:18-alpine` base image.
   - Automatically connects to MongoDB and Redis inside the Docker isolated network.
   - Mapped to external port `5001` (`5001:5000`) to avoid local port conflicts.
2. **`mongo` (Database):** 
   - Runs the official MongoDB image with a dedicated named volume (`mongo_data`) ensuring your tasks and users data persist even if containers are stopped or removed.
3. **`redis` (Broker & Queue):** 
   - Runs Redis to power BullMQ background job processing and asynchronous event handling.

### 🛡️ Database Health Checks & Startup Reliability
To ensure the backend application never crashes due to database connection race conditions, the project implements professional **Docker Health Checks**:
- The `mongo` container features an active health check (`mongosh` ping command) verifying that the database engine is fully up and responsive before dependent services start.
- The `app` service utilizes `condition: service_healthy` in its `depends_on` configuration, guaranteeing that Node.js will only spin up and accept traffic *after* MongoDB has completed its startup sequence.

###  How to Run with Docker

1. Make sure Docker Desktop is running on your machine.
2. Ensure your `.env` file is properly configured at the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/task-engine
   REDIS_HOST=redis
   REDIS_PORT=6379
   JWT_SECRET=your_super_secret_jwt_key_here


3. Spin up all containers in detached mode:

```bash
docker-compose up -d --build

```


4. Check the status of your running services:
```bash
docker-compose ps

```
