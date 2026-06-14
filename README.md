# Science Hub 🔬📝

Science Hub is a robust, full-stack scientific journal and article management platform built on the MERN stack. The system streamlines the entire lifecycle of scientific publishing—from draft submission and rigorous peer review to final publication, community discussion, and analytical tracking.

Designed with a high-performance **Role-Based Access Control (RBAC)** architecture, the platform ensures secure and tailored workspaces for 5 distinct user types, backed by data-driven analytics dashboards.

---

## 🚀 Key Features & Architecture

### 🔐 Multi-Tier Access Control (RBAC)

The application implements a secure middleware-driven authentication system supporting 5 separate user roles:

- **User / Author:** Submit drafts, track review status, engage in comments, and explore the public archive.
- **Reviewer:** Dedicated workspace to audit pending drafts, leave annotations, and approve/reject submissions.
- **Content Manager:** Manage journal metadata, organize scientific categories, and oversee publication queues.
- **Admin:** Advanced control panel for complete content moderation, log audits, and platform setting tweaks.
- **Superadmin:** High-level system configuration, infrastructure parameters, and global team permissions management.

### 📊 Data & Analytics Dashboards

- **Aggregation Engines:** Deep MongoDB aggregation pipelines to compile real-time statistics on article volume, active users, journal ratings, and grant allocations.
- **Visual Analytics:** Interactive front-end charts displaying publishing trends, approval ratios, and processing bottlenecks.

### 📑 Editorial Pipeline & Archive _(In Progress)_

- Fully managed submission workflow mapping states from `Draft` -> `Under Review` -> `Revisions Required` -> `Approved`.
- A clean, optimized public archive space for cross-referencing published papers.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Axios, modern state management, and UI charts.
- **Backend:** Node.js, Express.js (Modular routing, RBAC middlewares, centralized error handling).
- **Database:** MongoDB (Mongoose ODM, specialized indexing, data aggregation pipelines).
- **Authentication:** JSON Web Tokens (JWT) secured via HTTP-Only cookies.

---

## 📦 Installation & Setup

1. **Clone the repository:**

```bash
   git clone [https://github.com/KeLar36/science_hub.git](https://github.com/KeLar36/science_hub.git)
   cd science_hubч
```
