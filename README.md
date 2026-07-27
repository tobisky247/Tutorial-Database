# Exam Mastery Platform

A full-stack exam preparation platform for **IELTS Academic** and **AP English Language and Composition** — Phase 1.

## Stack
- **Frontend**: Vite + React + TypeScript + Vanilla CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite via Prisma ORM

## Getting Started

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Set up the database
```bash
cd server
npx prisma migrate dev --name init
```
This also runs the seed script automatically (creates exam data, questions, and a demo user).

### 3. Start the servers

In two separate terminals:

```bash
# Terminal 1 — Backend API (port 4000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Demo login
The seed script creates a demo student:
- **Email**: `sena@example.com`
- **Password**: `password123`

## Features (Phase 1)
- Student dashboard with IELTS and AP progress cards
- IELTS Academic Reading Practice (True/False/Not Given)
- IELTS Academic Writing Task 2 Mock (timed, with rubric feedback)
- AP English MCQ Practice (passage-based rhetorical analysis)
- AP English Argument FRQ Mock (timed, with 3-dimension rubric feedback)
- Rule-based personalised recommendations

## Project Structure
```
├── client/          # Vite + React frontend
│   └── src/
│       ├── App.tsx
│       └── index.css
├── server/          # Express API backend
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── db.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
```
