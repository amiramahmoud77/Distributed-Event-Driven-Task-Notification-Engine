#  Distributed Event-Driven Task & Notification Engine

> An enterprise-grade, event-driven backend system built with Node.js, Express, TypeScript, MongoDB, and BullMQ for asynchronous task processing and automated email notifications.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (with User association & Task ownership)
- **Queue & Event Broker:** BullMQ & Redis (Asynchronous event-driven architecture)
- **Authentication:** JWT-based Auth with Role-Based Access Control (RBAC)
- **Email Service:** Nodemailer for automated background notifications

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

---

## 🔄 Event-Driven Flow (BullMQ Workflow)

1. **User Action:** A user creates, updates, or changes the status of a task via the API.
2. **Event Dispatch:** The controller pushes an event payload (`TASK_CREATED`, `TASK_UPDATED`, `TASK_STATUS_CHANGED`) to the Redis-backed BullMQ queue.
3. **Background Worker:** The dedicated `task.worker.ts` picks up the job asynchronously.
4. **Notification Dispatch:** The worker triggers the email service to notify the user instantly without blocking the main event loop.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js & npm installed
- Running Redis instance (Local or Docker)
- MongoDB

