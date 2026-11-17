# NexCampus ERP — Engineering University Portal

A full-stack Engineering Student & Academic Management System built with **React**, **Tailwind CSS**, **FastAPI**, and **SQLite**.

## Key Features
- **Interactive 3D Glassmorphic Authentication**: Obsidian-and-amber UI featuring cursor-tracking 3D card tilt, HTML5 Canvas particle trails, and Web Audio API sound effects.
- **Register-Once, Verify-Always Security**: First-time Admin and Faculty emails register permanently with their chosen password hash; subsequent logins strictly verify matching credentials.
- **Role-Based Workspaces**: Dedicated views for **Admin / Registrar** (full ERP control, fee ledger, student admissions, analytics) and **Faculty / Professor** (daily subject attendance register & CIE internal marks).
- **Student 360° Portal & 75% Attendance Predictor**: Comprehensive academic tracking, SGPA progression, and attendance eligibility calculator.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide-React Icons, HTML5 Canvas, Web Audio API
- **Backend**: Python FastAPI, SQLAlchemy ORM, SQLite

## Local Setup & Run Guide

### 1. Backend (FastAPI)

    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

### 2. Frontend (React + Vite)

    cd frontend
    npm install
    npm run dev

Open **`http://localhost:5173`** in your browser to access the portal.
