# Science Hub 🔬📝

Science Hub is a comprehensive, full-stack scientific journal, article management, and community blogging platform built on the MERN stack. The system orchestrates the entire lifecycle of scientific publishing—from draft submission and rigorous peer review workflows to public discussions, institutional blogging, and advanced administrative tracking.

Designed with a high-performance Role-Based Access Control (RBAC) architecture, the platform delivers tailored, secure workspaces for 5 distinct user types, backed by data-driven analytics.

---

## 🚀 Key Features & System Modules

### 🔐 Advanced Access Control (RBAC) & Dedicated Workspaces

The application implements a secure middleware-driven authentication system supporting 5 separate user roles based on the principle of least privilege:

- Author: Submit scientific drafts to active academic programs, track review statuses, and manage personal submissions.
- Reviewer Panel: A dedicated workspace where assigned experts audit pending drafts, read submissions, and provide structured approval/rejection feedback and editorial notes.
- Content Manager Panel: A fully-featured content management dashboard allowing designated users to publish, edit, and maintain the institutional blog.
- Admin & Superadmin Dashboard: The ultimate control center featuring aggregated system analytics, user account management, article moderation, and the ability to create and configure new academic Programs (Projects).

### 📰 Academic Publishing Workflow (State Machine)

- Seamless submission pipeline mapping states from Draft -> Under Review -> Revisions Required -> Approved & Archived.
- Automatic permission shifts: articles become read-only for authors while undergoing active reviewer audits.
- Public Archive: Approved articles are instantly moved to a publicly accessible archive for global readers.

### 💬 Community Engagement & Blogging

- Dynamic Blog Module: Allows Content Managers to post updates, academic news, and articles.
- Interactive Discussion System: Full support for user comments under blog posts, enabling open community discussions and feedback loops.
- Informational Hub: Dedicated, clean pages for platform documentation, "About Us" sections, and publishing guidelines.

### 📊 Admin Analytics

- Frontend interactive charts displaying publishing trends, registration metrics, and approval ratios based on dynamic backend data filtering.

---

## 🛠️ Tech Stack

- Frontend: React.js, React Router, Axios, UI Charts.
- Backend: Node.js, Express.js (Modular routing, RBAC middlewares, centralized error handling).
- Database: MongoDB (Mongoose ODM, Schema References & Relationships).
- Authentication: JSON Web Tokens (JWT) stored client-side.

---

## 🗺️ Roadmap & Tech Debt Optimization (In Progress)

To prepare the system for production-scale loads and enterprise-grade security, the following architectural upgrades are currently being implemented:

1. Security Hardening: Migrating JWT storage from application memory/localStorage to secure, encrypted HTTP-Only & SameSite Cookies to completely mitigate XSS vulnerability vectors.
2. Database Performance: Replacing application-level data mapping with heavy MongoDB Aggregation Pipelines (`$match`, $group, `$lookup`) to compute complex dashboard metrics and comment threads directly on the database level.
3. DevOps & Containerization: Packaging the application using Docker & Docker-Compose for seamless environment replication and setting up an Nginx reverse proxy for enhanced routing security.
