# ARL OilSync Enterprise Platform

ARL OilSync is a full-stack Enterprise Resource Planning (ERP) and logistics dashboard designed for the Oil Department of Attock Refinery Limited (ARL). 

This platform tracks procurement (crude oil purchases), downstream sales (refined product dispatches), logistics (tank lorry tracking), supplier risk analysis, and customer credit utilization. It features an automated 3-way match system and an AI-driven Exception Center for management approvals.

## Tech Stack
* **Frontend:** React + Vite, Recharts, Lucide React (Vanilla CSS, Industrial Theme)
* **Backend:** Node.js + Express.js
* **Database:** MongoDB + Mongoose
* **Infrastructure:** Docker & Docker Compose

---

## Getting Started

You can run this project either completely locally (using your own installed Node and MongoDB) or via Docker for the backend.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Docker Desktop](https://www.docker.com/) (Optional, for containerized database and backend)
* [MongoDB](https://www.mongodb.com/try/download/community) (If not using Docker)

### Option A: Running with Docker (Recommended for Backend/DB)
The repository includes a `docker-compose.yml` file that spins up the Node backend and a MongoDB database automatically.

1. **Start the backend and database services:**
   ```bash
   docker-compose up -d --build
   ```
   *This starts MongoDB on port `27017` and the Express Backend on port `5001`.*

2. **Seed the database with sample data:**
   Open a new terminal, navigate to the `backend` folder, and run the seeding scripts to generate the enterprise mock data (Note: If using Docker, you may need to run this inside the container, or just use your local Node if you prefer):
   ```bash
   cd backend
   npm install
   node import_sales.js
   node seed_enterprise.js
   ```

3. **Start the Frontend locally:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

### Option B: Running Entirely Locally (Without Docker)

1. **Start your local MongoDB server.**
   Ensure it is running on `mongodb://localhost:27017`.

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   
   # Populate the database with test data
   node import_sales.js
   node seed_enterprise.js
   
   # Start the server
   node server.js
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Navigate to `http://localhost:5173` in your browser.

---

## Core Features
* **Executive Dashboard:** Live "Morning Brief" AI summary of current operational state.
* **3-Way Matching:** Automatically compares GRN (Received Volume) vs Purchase Order vs Invoice.
* **Dispatch Control Tower:** Live traffic tracking of loading/waiting Tank Lorries.
* **Exception Center & Approval Inbox:** Managerial workflow for handling pricing or volume anomalies (e.g. Tank Lorry overloaded).
* **Supplier Risk Radar:** Scorecard tracking supplier on-time deliveries and quality acceptance.
* **OMC Profitability:** Tracks customer (Oil Marketing Companies) profit margins and live credit utilization.

## Excel Data Pipeline
To import historical dispatch data, replace the `sales_data.xlsx` file in the root directory and run `node backend/import_sales.js`. The system will automatically parse the spreadsheet and map it to the active MongoDB collections.
