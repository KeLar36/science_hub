# Science Hub 🔬📝

Science Hub is a full-stack scientific journal and article management platform built on the MERN stack. The system streamlines the entire lifecycle of scientific publishing—from draft submission and peer review workflows to community discussion and administrative tracking.

Designed with a high-performance Role-Based Access Control (RBAC) architecture, the platform ensures secure and tailored workspaces for 5 distinct user types, backed by data-driven analytics.

---

## 🚀 Key Features & Architecture

### 🔐 Multi-Tier Access Control (RBAC)

The application implements a secure middleware-driven authentication system supporting 5 separate user roles based on the principle of least privilege:

- User / Author: Submit drafts, track review status, and engage in the public archive.
- Reviewer: Dedicated workspace to audit pending drafts and submit approval/rejection feedback.
- Content Manager: Manage journal metadata and oversee publication queues.
- Admin & Superadmin: Advanced control panels for content moderation, log audits, and system configuration.

### 📊 Data & Analytics Dashboards

- Data Aggregation: Frontend interactive charts displaying publishing trends, active users, and approval ratios based on dynamic backend data filtering.
- State Machine Pipeline: Fully managed submission workflow mapping states from Draft -> Under Review -> Revisions Required -> Approved.

---

## 🛠️ Tech Stack

- Frontend: React.js, React Router, Axios, UI Charts.
- Backend: Node.js, Express.js (Modular routing, RBAC middlewares, centralized error handling).
- Database: MongoDB (Mongoose ODM, Specialized Indexing).
- Authentication: JSON Web Tokens (JWT).

---

## 🗺️ Roadmap & Tech Debt Optimization (In Progress)

To prepare the system for production-scale loads and enhanced security, the following architectural upgrades are currently being implemented:

1. Security Hardening: Migrating JWT storage from localStorage to secure HTTP-Only Cookies to completely mitigate XSS vulnerability vectors.
2. Database Performance: Replacing application-level data processing with heavy MongoDB Aggregation Pipelines (`$match`, `$group`) to compute dashboard metrics directly on the database level.
3. DevOps & Deployment: Containerizing the application using Docker & Docker-Compose for seamless environment replication and setting up a reverse proxy using Nginx.
