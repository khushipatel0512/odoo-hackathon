# 🚛 TransitOps — Smart Transport Operations Platform

A centralized platform to manage the complete lifecycle of transport operations — from vehicle registration and driver management to dispatching, maintenance, fuel tracking, and analytics.

Built for the Odoo Hackathon 2026.

---

## 🧩 Problem Statement

Logistics companies rely on spreadsheets and manual logbooks to manage transport operations — leading to scheduling conflicts, missed maintenance, expired licenses, and poor visibility.

TransitOps solves this with a unified digital platform.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS + Recharts |
| Backend | Django + Django REST Framework |
| Database | SQLite |
| Auth | JWT (simplejwt) |

---

## 🚀 Features

- 🔐 Role-based login (Fleet Manager, Driver, Safety Officer, Financial Analyst)
- 🚛 Vehicle registry with lifecycle status tracking
- 👤 Driver management with license expiry alerts
- 🗺️ Trip dispatch with business rule validations
- 🔧 Maintenance workflow with auto status transitions
- ⛽ Fuel and expense tracking
- 📊 Dashboard with real-time KPIs and charts
- 📈 Reports with CSV export

---

## 🏃 How to Run Locally

### Frontend
```bash
cd frontend
npm install
npm start
```
Opens at `http://localhost:3000`

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Opens at `http://localhost:8000`

---

## 📁 Project Structure

```
odoo-hackathon/
├── frontend/     # React app
├── backend/      # Django REST API
└── README.md
```
